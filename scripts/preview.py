#!/usr/bin/env python3
"""One TrustGo development service per checkout; macOS/Linux, standard library only."""

import argparse
import fcntl
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import signal
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
STATE_DIR = ROOT / '.local-preview'
NEXT = ROOT / 'node_modules/next/dist/bin/next'


class PreviewError(Exception):
    pass


def run(*args):
    return subprocess.run(args, capture_output=True, text=True)


def process(pid):
    result = run('ps', '-p', str(pid), '-o', 'ppid=,pgid=,lstart=,command=')
    if result.returncode:
        if 'permitted' in result.stderr.lower():
            raise PreviewError('Process inspection is blocked; run this command with local process permissions.')
        return None
    fields = result.stdout.strip().split(None, 7)
    if len(fields) != 8:
        return None
    return {'parent': int(fields[0]), 'group': int(fields[1]),
            'started': ' '.join(fields[2:7]), 'command': fields[7]}


def cwd(pid):
    result = run('lsof', '-a', '-p', str(pid), '-d', 'cwd', '-Fn')
    return next((Path(line[1:]).resolve() for line in result.stdout.splitlines()
                 if line.startswith('n')), None)


def listeners(port):
    result = run('lsof', '-nP', f'-iTCP:{port}', '-sTCP:LISTEN', '-t')
    if result.returncode not in (0, 1):
        raise PreviewError(f'Cannot inspect port {port}: {result.stderr.strip()}')
    return sorted({int(line) for line in result.stdout.splitlines() if line.isdigit()})


def other_development_port(port):
    result = run('lsof', '-nP', '-a', '-c', 'node', '-iTCP', '-sTCP:LISTEN', '-Fpn')
    pid = None
    for line in result.stdout.splitlines():
        if line.startswith('p'):
            pid = int(line[1:])
        elif pid and line.startswith('n'):
            match = re.search(r':(\d+)$', line)
            if match and int(match[1]) != port and cwd(pid) == ROOT and dev_owner(pid):
                return int(match[1])
    return None


def dev_command(command):
    # A next-server process title alone cannot distinguish dev from production.
    words = shlex.split(command)
    return any(Path(word).name == 'next' and i + 1 < len(words) and words[i + 1] == 'dev'
               for i, word in enumerate(words))


def dev_owner(pid):
    """Return a proven same-checkout Next dev ancestor, never an arbitrary listener."""
    current = pid
    for _ in range(6):
        info = process(current)
        if not info or cwd(current) != ROOT:
            return None
        if dev_command(info['command']):
            return current
        current = info['parent']
        if current <= 1:
            return None
    return None


def load_state(port):
    try:
        return json.loads((STATE_DIR / f'runtime-{port}.json').read_text())
    except (FileNotFoundError, ValueError):
        return None


def managed(state):
    if not state or state.get('root') != str(ROOT):
        return False
    pid = state['pid']
    info = process(pid)
    return bool(info and info['started'] == state['started'] and info['group'] == pid
                and str(NEXT) in info['command'] and dev_command(info['command']) and cwd(pid) == ROOT)


def probe(port, path, timeout=8):
    result = run('curl', '--noproxy', '*', '--silent', '--show-error', '--max-time', str(timeout),
                 '--max-filesize', '8388608', '--write-out', '\n%{http_code}',
                 f'http://127.0.0.1:{port}{path}')
    body, _, status = result.stdout.rpartition('\n')
    # App Router preloads its not-found boundary inside Flight scripts even on
    # successful pages. Only rendered HTML can identify the active error page.
    html = re.sub(r'<script\b[^>]*>.*?</script\s*>', '', body, flags=re.I | re.S)
    healthy = result.returncode == 0 and status == '200' and '<h1' in html and 'TrustGo' in html
    healthy = healthy and 'next-error-h1' not in html and 'NEXT_HTTP_ERROR_FALLBACK;500' not in body
    return healthy, status or '000'


def show_log(port):
    log = STATE_DIR / f'server-{port}.log'
    if log.exists():
        print('\n'.join(log.read_text(errors='replace').splitlines()[-35:]), file=sys.stderr)


def stop(port):
    state = load_state(port)
    pids = listeners(port)
    owners = {pid: dev_owner(pid) for pid in pids}
    if any(owner is None for owner in owners.values()):
        raise PreviewError(f'Port {port} belongs to an unverified or unrelated process {pids}; left untouched.')
    if managed(state):
        os.killpg(state['pid'], signal.SIGTERM)
    else:
        # Legacy npm/Next launches: terminate only the verified dev parent/listener.
        for pid in sorted(set(pids) | set(owners.values()), reverse=True):
            if cwd(pid) == ROOT and dev_owner(pid):
                try:
                    os.kill(pid, signal.SIGTERM)
                except ProcessLookupError:
                    pass
    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        if not listeners(port) and not managed(state):
            (STATE_DIR / f'runtime-{port}.json').unlink(missing_ok=True)
            print(f'Stopped TrustGo preview on port {port}.', flush=True)
            return
        time.sleep(0.2)
    raise PreviewError('The verified development service did not stop within 10 seconds; no forced kill was used.')


def ensure(args):
    """Return True only when this invocation created the server."""
    pids = listeners(args.port)
    if pids:
        if not all(dev_owner(pid) for pid in pids):
            raise PreviewError(f'Port {args.port} belongs to an unverified or unrelated process {pids}; left untouched.')
        healthy, status = probe(args.port, args.path, min(args.timeout, 30))
        if healthy:
            print(f'Reusing healthy TrustGo preview: http://localhost:{args.port}{args.path}', flush=True)
            print('No second server was started. Stop it with: npm run preview:stop', flush=True)
            return False
        raise PreviewError(f'Existing TrustGo service returned HTTP {status}; use npm run preview:restart. '
                           'A source error needs a code fix, not repeated startup.')
    previous = load_state(args.port)
    if managed(previous):
        raise PreviewError('A managed server is still starting or stopped listening; use npm run preview:restart.')
    other_port = other_development_port(args.port)
    if other_port:
        raise PreviewError(f'This checkout already runs Next dev on port {other_port}; use that preview instead.')
    for file in STATE_DIR.glob('runtime-*.json'):
        other = json.loads(file.read_text())
        if other.get('port') != args.port and managed(other):
            raise PreviewError(f'This checkout already runs on port {other["port"]}; do not share its dev cache.')
    node = shutil.which('node')
    if not node or not NEXT.is_file():
        raise PreviewError('Node.js or Next.js is missing. Install project dependencies first.')
    log = STATE_DIR / f'server-{args.port}.log'
    if log.exists():
        log.replace(STATE_DIR / f'server-{args.port}.previous.log')
    with log.open('w') as output:
        child = subprocess.Popen([node, str(NEXT), 'dev', '--turbopack', '-p', str(args.port)],
                                 cwd=ROOT, stdin=subprocess.DEVNULL, stdout=output, stderr=output,
                                 start_new_session=True)
    info = process(child.pid)
    if not info:
        raise PreviewError('Next.js exited before startup; inspect the preview log.')
    state = {'root': str(ROOT), 'port': args.port, 'pid': child.pid, 'started': info['started']}
    (STATE_DIR / f'runtime-{args.port}.json').write_text(json.dumps(state, indent=2) + '\n')
    print(f'Starting TrustGo; log: {log}', flush=True)
    deadline = time.monotonic() + args.timeout
    while time.monotonic() < deadline and child.poll() is None:
        healthy, status = probe(args.port, args.path, min(10, max(1, int(deadline - time.monotonic()))))
        if healthy:
            print(f'HTTP 200, homepage content found: http://localhost:{args.port}{args.path}', flush=True)
            return True
        time.sleep(1)
    show_log(args.port)
    stop(args.port)
    raise PreviewError('Preview failed its homepage check; failed service stopped. Fix the logged cause before retrying.')


def follow(args):
    print('Foreground preview: Ctrl+C stops this service. For background mode use npm run preview.', flush=True)
    log = STATE_DIR / f'server-{args.port}.log'

    def request_stop(signum, frame):
        raise KeyboardInterrupt

    signal.signal(signal.SIGTERM, request_stop)
    try:
        with log.open() as output:
            while managed(load_state(args.port)):
                chunk = output.read()
                if chunk:
                    print(chunk, end='', flush=True)
                time.sleep(0.5)
    finally:
        with (STATE_DIR / 'control.lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            stop(args.port)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['dev', 'ensure', 'status', 'restart', 'stop'])
    parser.add_argument('--port', type=int, default=4000)
    parser.add_argument('--path', default='/zh')
    parser.add_argument('--timeout', type=int, default=90)
    parser.add_argument('--clean-cache', action='store_true', help='Restart only: rotate .next-dev after stopping')
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535 or not 1 <= args.timeout <= 180:
        parser.error('Port must be 1024–65535 and timeout 1–180 seconds.')
    if not re.fullmatch(r'/[a-zA-Z0-9/_-]*', args.path):
        parser.error('Use a public local page path without query strings or personal data.')
    if args.clean_cache and args.action != 'restart':
        parser.error('--clean-cache is allowed only with restart.')
    if json.loads((ROOT / 'package.json').read_text()).get('name') != 'trustgo-car-rental':
        parser.error('This helper is scoped to the TrustGo repository.')
    STATE_DIR.mkdir(mode=0o700, exist_ok=True)
    for tool in ('ps', 'lsof', 'curl'):
        if not shutil.which(tool):
            raise PreviewError(f'Required local tool is missing: {tool}')
    with (STATE_DIR / 'control.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise PreviewError('Another preview command is in progress; wait for its result before retrying.')
        if args.action == 'status':
            pids = listeners(args.port)
            owned = bool(pids) and all(dev_owner(pid) for pid in pids)
            healthy, status = probe(args.port, args.path) if owned else (False, 'not-probed')
            print(json.dumps({'url': f'http://localhost:{args.port}{args.path}', 'listeners': pids,
                              'trustgo_dev': owned, 'healthy': healthy, 'http': status,
                              'managed': managed(load_state(args.port)),
                              'log': str(STATE_DIR / f'server-{args.port}.log')}, indent=2))
            return 0 if healthy else 1
        if args.action in ('stop', 'restart'):
            if args.clean_cache:
                other_port = other_development_port(args.port)
                if other_port:
                    raise PreviewError(f'Another development service uses port {other_port}; cache left untouched.')
            stop(args.port)
            if args.clean_cache:
                cache = ROOT / '.next-dev'
                if cache.is_symlink():
                    raise PreviewError('Refusing to rotate a symlinked cache.')
                if cache.exists():
                    backup = STATE_DIR / f'cache-{time.time_ns()}'
                    cache.rename(backup)
                    print(f'Development cache backed up to {backup}', flush=True)
            if args.action == 'stop':
                return 0
        try:
            created = ensure(args)
        except KeyboardInterrupt:
            if managed(load_state(args.port)):
                stop(args.port)
            raise
    if args.action == 'dev' and created:
        follow(args)
    elif created:
        print('Running in background. Stop: npm run preview:stop', flush=True)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\nPreview command interrupted.', file=sys.stderr)
        sys.exit(130)
    except (PreviewError, OSError, ValueError) as error:
        print(f'Preview: {error}', file=sys.stderr)
        sys.exit(1)
