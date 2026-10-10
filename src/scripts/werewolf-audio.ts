/**
 * Generates the werewolf narration audio once per line and locale.
 *
 *   pnpm audio:werewolf            only missing or changed lines
 *   pnpm audio:werewolf --force    everything
 *
 * Env: AI_BASE_URL, AI_API_KEY, AI_MODEL, optional AI_VOICE.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { DICTIONARIES, LOCALES } from '@/app/(app)/werewolf/i18n';
import { narrationLines } from '@/app/(app)/werewolf/lib/narration';

const OUT_DIR = path.join(process.cwd(), 'public', 'werewolf', 'audio');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
const CONCURRENCY = 2;
const MAX_ATTEMPTS = 5;

type Manifest = Record<string, Record<string, string>>;

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}. Set it in .env.`);
    process.exit(1);
  }
  return value;
}

function speechUrl(base: string) {
  const trimmed = base.replace(/\/+$/, '');
  const withVersion = /\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/v1`;
  return `${withVersion}/audio/speech`;
}

async function readManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8')) as Manifest;
  } catch {
    return {};
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class FatalError extends Error {}

async function main() {
  const force = process.argv.includes('--force');
  const url = speechUrl(requireEnv('AI_BASE_URL'));
  const apiKey = requireEnv('AI_API_KEY');
  const model = requireEnv('AI_MODEL');
  const voice = process.env.AI_VOICE?.trim() || 'JBFqnCBsd6RMkjVDRZzb';

  const manifest = await readManifest();
  const jobs: { locale: string; key: string; text: string; file: string }[] = [];
  let skipped = 0;

  for (const locale of LOCALES) {
    manifest[locale] ??= {};
    await mkdir(path.join(OUT_DIR, locale), { recursive: true });
    for (const [key, text] of narrationLines(DICTIONARIES[locale])) {
      const file = path.join(OUT_DIR, locale, `${key}.mp3`);
      if (!force && existsSync(file) && manifest[locale][key] === text) {
        skipped++;
        continue;
      }
      jobs.push({ locale, key, text, file });
    }
  }

  console.log(`Model ${model}, voice ${voice}, endpoint ${url}`);
  console.log(`${jobs.length} to generate, ${skipped} up to date.`);
  if (jobs.length === 0) return;

  async function generate(text: string) {
    for (let attempt = 1; ; attempt++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, input: text, voice, response_format: 'mp3' }),
      });
      if (res.ok) {
        const audio = Buffer.from(await res.arrayBuffer());
        if (audio.length === 0) throw new FatalError('Empty audio response.');
        return audio;
      }
      const body = await res.text().catch(() => '');
      const retry = res.status === 429 || res.status >= 500;
      if (retry && attempt < MAX_ATTEMPTS) {
        const after = Number(res.headers.get('retry-after'));
        const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 1000 * 2 ** attempt;
        console.warn(`  HTTP ${res.status}, retrying in ${Math.round(wait / 1000)}s`);
        await sleep(wait);
        continue;
      }
      let hint = '';
      if (res.status === 400 || res.status === 422) {
        hint = `\nIf the voice is rejected, set AI_VOICE to a voice your provider offers for ${model} (currently "${voice}").`;
      }
      throw new FatalError(`HTTP ${res.status} ${res.statusText}\n${body}${hint}`);
    }
  }

  let done = 0;
  let next = 0;
  const saveManifest = () => writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      const audio = await generate(job.text);
      await writeFile(job.file, audio);
      manifest[job.locale][job.key] = job.text;
      done++;
      console.log(`[${done}/${jobs.length}] ${job.locale}/${job.key}.mp3`);
    }
  }

  try {
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));
  } finally {
    await saveManifest();
  }
  console.log('Done.');
}

main().catch((error: unknown) => {
  console.error(error instanceof FatalError ? `Failed: ${error.message}` : error);
  process.exit(1);
});
