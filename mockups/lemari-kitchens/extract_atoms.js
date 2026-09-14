const fs = require('fs');
const html = fs.readFileSync('nordic_raw.html', 'utf8');

// In Zero blocks, text is in class tn-atom
const atoms = html.match(/<div class=\"tn-atom\"[^>]*>([\s\S]*?)<\/div>/gi) || [];
console.log('Total atoms:', atoms.length);
const seen = new Set();
atoms.forEach(a => {
  const clean = a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length > 2 && !seen.has(clean)) {
    seen.add(clean);
    console.log('-', clean);
  }
});
