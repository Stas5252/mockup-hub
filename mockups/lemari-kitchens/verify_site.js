const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Check tags balance
const tags = ['div', 'section', 'header', 'footer', 'nav', 'table', 'form'];
tags.forEach(tag => {
  const open = (html.match(new RegExp('<' + tag + '(\\s|>|$)', 'gi')) || []).length;
  const close = (html.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
  console.log(tag.padEnd(10), 'open:', open, 'close:', close, open === close ? 'OK' : 'MISMATCH!');
});

// Check duplicate IDs
const ids = [...html.matchAll(/id="([^"]+)"/gi)].map(m => m[1]);
const counts = {};
ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
const duplicates = Object.entries(counts).filter(([_, c]) => c > 1);
console.log('Duplicate IDs:', duplicates);
