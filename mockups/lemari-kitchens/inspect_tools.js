const fs = require('fs');
const raw = fs.readFileSync('nordic_raw.html', 'utf8');

// Find occurrences of tildacdn images and surrounding text
const imgRegex = /https:\/\/static\.tildacdn\.com\/[^\s"']+\.(?:jpg|png|webp|svg)/gi;
let m;
const found = new Set();
while ((m = imgRegex.exec(raw)) !== null) {
  const url = m[0];
  if (!found.has(url)) {
    found.add(url);
    const start = Math.max(0, m.index - 300);
    const end = Math.min(raw.length, m.index + 300);
    const context = raw.substring(start, end).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(`\nURL: ${url}`);
    console.log(`Context: ${context.substring(0, 180)}...`);
  }
}
