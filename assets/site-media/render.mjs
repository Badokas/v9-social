// V9 Social marketing media renderer.
// Renders the original scenes in ./scenes to MP4 videos, JPG posters and WebP
// stills in apps/frontend/public/v9social/site/.
//
// Needs: ffmpeg + ImageMagick (`magick`) on PATH, and playwright-core with a
// matching Chromium, e.g.
//   mkdir -p /tmp/v9-render && cd /tmp/v9-render && npm i playwright-core@1.56.1
//   npx playwright-core install chromium-headless-shell   (if not cached)
//   PLAYWRIGHT_CORE=/tmp/v9-render/node_modules/playwright-core node render.mjs [name...]
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../../apps/frontend/public/v9social/site');
const FPS = 30;
const SCALE = 1.5; // 1280x720 CSS px -> 1920x1080 video

const videos = [
  { name: 'v9-in-action', file: 'in-action.html', poster: 10.2 },
  { name: 'v9-tiktok-settings', file: 'tiktok-settings.html', poster: 8.4 },
  { name: 'v9-instagram-settings', file: 'instagram-settings.html', poster: 8.4 },
  { name: 'v9-ai-agent', file: 'ai-agent.html', poster: 9.5 },
];
// element ids in stills.html, rendered with a transparent background
const stills = ['ai-chatgpt', 'ai-claude', 'ai-code', 'feat-calendar', 'feat-composer', 'feat-media', 'feat-team'];

const only = process.argv.slice(2);
const want = (n) => !only.length || only.includes(n) || (only.includes('stills') && stills.includes(n));

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: SCALE });

for (const v of videos.filter((v) => want(v.name))) {
  const frames = join('/tmp', `v9-frames-${v.name}`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  await page.goto(pathToFileURL(join(here, 'scenes', v.file)).href + '?render=1');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const duration = await page.evaluate(() => window.DURATION);
  const n = Math.round(duration * FPS);
  for (let f = 0; f < n; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    await page.screenshot({ path: join(frames, `${String(f).padStart(4, '0')}.png`) });
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, '%04d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    join(out, `${v.name}.mp4`)]);
  await page.evaluate((t) => window.seek(t), v.poster);
  await page.screenshot({ path: join(frames, 'poster.png') });
  execFileSync('magick', [join(frames, 'poster.png'), '-quality', '82', join(out, `${v.name}.webp`)]);
  rmSync(frames, { recursive: true, force: true });
  console.log(`video ${v.name}: ${n} frames`);
}

const todo = stills.filter(want);
if (todo.length) {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(pathToFileURL(join(here, 'scenes', 'stills.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  for (const id of todo) {
    const png = join('/tmp', `v9-still-${id}.png`);
    await page.locator(`#${id}`).screenshot({ path: png, omitBackground: true });
    execFileSync('magick', [png, '-quality', '85', join(out, `${id}.webp`)]);
    rmSync(png);
    console.log(`still ${id}`);
  }
}
await browser.close();
