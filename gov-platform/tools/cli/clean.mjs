// tools/clean.mjs
import { rimraf } from 'rimraf';

const patterns = [
  'apps/**/dist',
  'packages/gov-portal/**/dist',
  '**/.vite'
];

// Force glob mode so Windows shells don't break it
const run = async () => {
  for (const p of patterns) {
    await rimraf(p, { glob: true });
  }
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
