const fs = require('fs');
const html = fs.readFileSync('nordic_raw.html', 'utf8');

const matches = [];
const textRegex = />([^<]{3,100})</g;
let m;
while ((m = textRegex.exec(html)) !== null) {
  const t = m[1].trim();
  if (t && !t.includes('{') && !t.includes(';') && !t.startsWith('var ') && !t.startsWith('function') && !t.includes('css')) {
    matches.push(t);
  }
}
const unique = [...new Set(matches)];
console.log('Total unique strings:', unique.length);
console.log(unique.slice(60, 160).join('\n'));
