"""Process-level checks with a tiny local server in an isolated temporary checkout."""

import concurrent.futures
import importlib.util
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch


class PreviewProbeTest(unittest.TestCase):
    def setUp(self):
        spec = importlib.util.spec_from_file_location('trustgo_preview', Path(__file__).with_name('preview.py'))
        self.preview = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.preview)

    def probe(self, html, status='200'):
        result = subprocess.CompletedProcess([], 0, stdout=f'{html}\n{status}')
        with patch.object(self.preview, 'run', return_value=result):
            return self.preview.probe(4000, '/zh')[0]

    def test_preloaded_error_boundary_does_not_reject_a_healthy_homepage(self):
        html = '<h1>TrustGo</h1><script>self.__next_f.push([1,"next-error-h1"])</script>'
        self.assertTrue(self.probe(html))

    def test_rendered_error_page_and_server_error_remain_unhealthy(self):
        self.assertFalse(self.probe('<title>TrustGo</title><h1 class="next-error-h1">404</h1>'))
        self.assertFalse(self.probe('<h1>TrustGo</h1>', '500'))
        self.assertFalse(self.probe('<h1>TrustGo</h1><script>NEXT_HTTP_ERROR_FALLBACK;500</script>'))

    def test_script_content_cannot_substitute_for_rendered_homepage(self):
        self.assertFalse(self.probe('<script>"<h1>TrustGo</h1>"</script>'))


class PreviewLifecycleTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='trustgo-preview-test-')
        self.root = Path(self.temp.name)
        (self.root / 'scripts').mkdir()
        self.script = self.root / 'scripts/preview.py'
        shutil.copyfile(Path(__file__).with_name('preview.py'), self.script)
        (self.root / 'package.json').write_text(json.dumps({'name': 'trustgo-car-rental'}))
        self.next = self.root / 'node_modules/next/dist/bin/next'
        self.next.parent.mkdir(parents=True)
        self.next.write_text('''
const http = require('node:http');
const fs = require('node:fs');
const port = Number(process.argv[process.argv.indexOf('-p') + 1]);
http.createServer((req, res) => {
  const bad = fs.existsSync('fail-response');
  res.writeHead(bad ? 500 : 200, { 'Content-Type': 'text/html' });
  res.end(bad ? 'Internal Server Error' : '<title>TrustGo</title><h1>TrustGo Preview</h1>');
}).listen(port);
''')
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            self.port = sock.getsockname()[1]
        self.extra = []

    def command(self, action, *extra):
        return [sys.executable, str(self.script), action, '--port', str(self.port),
                '--timeout', '5', *extra]

    def call(self, action, *extra):
        return subprocess.run(self.command(action, *extra), capture_output=True, text=True, timeout=25)

    def state(self):
        return json.loads((self.root / f'.local-preview/runtime-{self.port}.json').read_text())

    def tearDown(self):
        for proc in self.extra:
            if proc.poll() is None:
                proc.terminate()
                proc.wait(timeout=8)
        self.call('stop')
        self.temp.cleanup()

    def test_repeat_start_and_foreground_reuse(self):
        first = self.call('ensure')
        self.assertEqual(first.returncode, 0, first.stderr)
        pid = self.state()['pid']
        for action in ('ensure', 'dev'):
            result = self.call(action)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn('Reusing healthy', result.stdout)
            self.assertEqual(self.state()['pid'], pid)
        status = json.loads(self.call('status').stdout)
        self.assertTrue(status['healthy'])
        self.assertTrue(status['managed'])

    def test_restart_rotates_only_development_cache(self):
        self.assertEqual(self.call('ensure').returncode, 0)
        pid = self.state()['pid']
        for directory in ('.next', '.next-dev'):
            (self.root / directory).mkdir()
            (self.root / directory / 'marker').write_text('keep')
        result = self.call('restart', '--clean-cache')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotEqual(self.state()['pid'], pid)
        self.assertTrue((self.root / '.next/marker').exists())
        self.assertEqual(len(list((self.root / '.local-preview').glob('cache-*/marker'))), 1)

    def test_unrelated_listener_survives_restart(self):
        foreign = subprocess.Popen([shutil.which('node'), '-e',
                                    f"require('http').createServer((q,s)=>s.end('other')).listen({self.port})"],
                                   cwd=self.root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.extra.append(foreign)
        time.sleep(0.4)
        for action in ('ensure', 'restart', 'stop'):
            result = self.call(action)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('left untouched', result.stderr)
            self.assertIsNone(foreign.poll())

    def test_legacy_next_dev_can_be_taken_over(self):
        legacy = subprocess.Popen([shutil.which('node'), str(self.next), 'dev', '-p', str(self.port)],
                                  cwd=self.root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.extra.append(legacy)
        time.sleep(0.4)
        result = self.call('restart')
        self.assertEqual(result.returncode, 0, result.stderr)
        legacy.wait(timeout=5)
        self.assertNotEqual(self.state()['pid'], legacy.pid)
        self.assertTrue(json.loads(self.call('status').stdout)['managed'])

    def test_other_port_prevents_start_and_cache_rotation(self):
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            other_port = sock.getsockname()[1]
        legacy = subprocess.Popen([shutil.which('node'), str(self.next), 'dev', '-p', str(other_port)],
                                  cwd=self.root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.extra.append(legacy)
        cache = self.root / '.next-dev'
        cache.mkdir()
        (cache / 'marker').write_text('keep')
        time.sleep(0.4)
        for action, extra in [('ensure', []), ('restart', ['--clean-cache'])]:
            result = self.call(action, *extra)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(other_port), result.stderr)
            self.assertTrue((cache / 'marker').exists())
            self.assertIsNone(legacy.poll())

    def test_foreground_ctrl_c_releases_port(self):
        output_path = self.root / 'foreground.log'
        with output_path.open('w') as output:
            foreground = subprocess.Popen(self.command('dev'), stdout=output, stderr=output)
            self.extra.append(foreground)
            deadline = time.monotonic() + 15
            while 'Foreground preview:' not in output_path.read_text() and time.monotonic() < deadline:
                time.sleep(0.2)
            self.assertIn('Foreground preview:', output_path.read_text())
            foreground.send_signal(signal.SIGINT)
            foreground.wait(timeout=15)
        self.assertEqual(json.loads(self.call('status').stdout)['listeners'], [])

    def test_http_500_is_not_success_and_failed_server_stops(self):
        (self.root / 'fail-response').write_text('500')
        result = self.call('ensure')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('failed its homepage check', result.stderr)
        self.assertEqual(json.loads(self.call('status').stdout)['listeners'], [])

    def test_parallel_commands_do_not_create_duplicate_servers(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            results = list(executor.map(lambda _: self.call('ensure'), range(2)))
        self.assertTrue(any(result.returncode == 0 for result in results))
        for result in results:
            if result.returncode:
                self.assertIn('in progress', result.stderr)
        status = json.loads(self.call('status').stdout)
        self.assertTrue(status['healthy'])
        self.assertEqual(len(status['listeners']), 1)


if __name__ == '__main__':
    unittest.main(verbosity=2)
