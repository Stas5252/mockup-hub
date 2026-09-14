const https = require('https');

https.get('https://nordickitchens.ru/', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const rawMatches = data.match(/>([^<]{4,100})</g) || [];
    const clean = rawMatches.map(m => m.slice(1, -1).trim()).filter(s => s && !s.includes('{') && !s.includes(';') && !s.startsWith('window.') && !s.startsWith('function'));
    console.log('Homepage texts:');
    console.log([...new Set(clean)].slice(0, 50).join('\n'));
  });
});
