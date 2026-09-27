import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToCopy = ['index.html', 'style.css', 'script.js', 'templates-data.js'];

// Ensure compatibility with Vercel and any static hosting presets:
// Root (.), public/, and dist/ directories will all contain the required static assets
const targetDirs = ['public', 'dist'];

for (const dirName of targetDirs) {
  const targetPath = path.join(__dirname, dirName);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  for (const file of filesToCopy) {
    const src = path.join(__dirname, file);
    const dest = path.join(targetPath, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
}

console.log('Build completed successfully: assets prepared for Vercel (., public, dist)');
