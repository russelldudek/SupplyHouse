import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const routes = [
  ['resume.html', 'docs/Russell-Dudek-SupplyHouse-Resume.pdf'],
  ['cover-letter.html', 'docs/Russell-Dudek-SupplyHouse-Cover-Letter.pdf'],
  ['interview-brief.html', 'docs/Russell-Dudek-SupplyHouse-Interview-Brief.pdf'],
  ['120-day-plan.html', 'docs/Russell-Dudek-SupplyHouse-120-Day-Plan.pdf'],
  ['commissioning-review.html', 'docs/Russell-Dudek-SupplyHouse-Workflow-Commissioning-Review.pdf']
];

await mkdir('docs', { recursive: true });
const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let ready = false;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const response = await fetch('http://127.0.0.1:4173/index.html');
    if (response.ok) { ready = true; break; }
  } catch {}
  await wait(500);
}
if (!ready) {
  server.kill('SIGTERM');
  throw new Error('Static server did not become ready.');
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [route, output] of routes) {
    await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: output,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
  }
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
