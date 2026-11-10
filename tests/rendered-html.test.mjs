import assert from 'node:assert/strict';
import test from 'node:test';

test('production pages and core assets respond', { skip: !process.env.TEST_BASE_URL }, async () => {
  const base = process.env.TEST_BASE_URL;
  for (const path of ['/', '/studio', '/rewards', '/card-silver-relief.png', '/favicon.svg', '/og-rewardlab.png']) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    if (path === '/' || path === '/studio' || path === '/rewards') {
      const html = await response.text();
      assert.match(html, /Rewardlab|REWARDLAB/);
      assert.doesNotMatch(html, /Brandble|BRANDBLE|Bhavya G|BHAVYA G|by Bhavya/i);
      assert.doesNotMatch(html, /\u2014/);
      assert.doesNotMatch(html, /Your site is taking shape/);
    }
  }
});

test('no waitlist or early-access capture remains in the source', async () => {
  const { readdir, readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  async function walk(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); out.push(...(e.isDirectory() ? await walk(p) : [p])); } return out; }
  const files = await walk(new URL('../app', import.meta.url).pathname);
  assert.ok(!files.some(f => f.includes('/api/')), 'no API routes expected');
  for (const f of files) {
    const text = await readFile(f, 'utf8');
    assert.doesNotMatch(text, /formsubmit|WaitlistForm|api\/waitlist|Brandble|Bhavya G|by Bhavya/i, f);
  }
});
