import { spawn } from 'node:child_process';

/** Optional native curl transport for hosts whose Node TLS path is unavailable. */
export function demoHttpFetch(url, options) {
  if (process.env.TRUSTGO_HTTP_TRANSPORT !== 'curl') return fetch(url, options);
  return new Promise((resolve, reject) => {
    const args = ['--http1.1', '--compressed', '--silent', '--show-error', '--include', '--max-time', '30', '--config', '-'];
    // Optional DNS override retains the requested hostname, SNI and certificate validation.
    if (process.env.TRUSTGO_HTTP_RESOLVE) args.push('--resolve', `${url.hostname}:443:${process.env.TRUSTGO_HTTP_RESOLVE}`);
    const child = spawn('curl', [...args, url.href],
      { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      if (code) { reject(new Error(`curl transport failed (${code}): ${stderr}`)); return; }
      const end = stdout.indexOf('\r\n\r\n');
      const lines = stdout.slice(0, end).split('\r\n');
      const status = Number(lines.shift()?.split(' ')[1]);
      const headers = new Headers();
      for (const line of lines) {
        const colon = line.indexOf(':');
        if (colon > 0) headers.append(line.slice(0, colon), line.slice(colon + 1).trim());
      }
      resolve({ status, headers, text: async () => stdout.slice(end + 4) });
    });
    const config = [`request = ${JSON.stringify(options.method)}`,
      ...Object.entries(options.headers).map(([key, value]) => `header = ${JSON.stringify(`${key}: ${value}`)}`)];
    if (options.body !== undefined) config.push(`data = ${JSON.stringify(options.body)}`);
    child.stdin.end(config.join('\n') + '\n');
  });
}
