/* Verify that the checked-in static entry points reference usable build output. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'index.html',
  'evolve/main.js',
  'evolve/evolve.css',
  'wiki.html',
  'wiki/wiki.js',
  'wiki/wiki.css',
  'chronicles.html',
  'evolve/chronicles.js',
];

let failed = false;
for (const relativePath of requiredFiles) {
  const filePath = path.join(root, relativePath);
  try {
    if (fs.statSync(filePath).size === 0) {
      throw new Error('file is empty');
    }
  } catch (error) {
    console.error(`Missing or invalid build artifact: ${relativePath} (${error.message})`);
    failed = true;
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const wiki = fs.readFileSync(path.join(root, 'wiki.html'), 'utf8');
const chronicles = fs.readFileSync(path.join(root, 'chronicles.html'), 'utf8');
for (const [documentName, document, reference] of [
  ['index.html', index, 'evolve/main.js'],
  ['index.html', index, 'evolve/evolve.css'],
  ['wiki.html', wiki, 'wiki/wiki.js'],
  ['wiki.html', wiki, 'wiki/wiki.css'],
  ['chronicles.html', chronicles, 'evolve/chronicles.js'],
]) {
  if (!document.includes(reference)) {
    console.error(`${documentName} does not reference ${reference}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Smoke check passed: static entry points and build artifacts are present.');
