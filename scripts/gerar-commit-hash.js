const { execSync } = require('child_process');
const fs = require('fs');

let hash = 'desconhecido';
try {
  hash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {}
fs.writeFileSync('src/constants/commit.ts', `export const COMMIT_HASH = '${hash}';\n`);
console.log('Commit de referência:', hash);
