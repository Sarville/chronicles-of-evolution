import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

export async function importBundled(entry, name) {
  await mkdir('.test-build', { recursive: true });
  const outfile = `.test-build/${name}.mjs`;
  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    logLevel: 'silent',
  });
  return import(pathToFileURL(`${process.cwd()}/${outfile}`).href + `?t=${Date.now()}`);
}

