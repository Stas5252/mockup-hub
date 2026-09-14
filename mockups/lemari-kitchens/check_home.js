const https = require('https');

https.get('https://nordickitchens.ru/', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Find all titles, texts, alts
    const alts = data.match(/alt=\"([^\"]+)\"/g) || [];
    console.log('--- ALTS ---');
    console.log([...new Set(alts)].slice(0, 30).join('\n'));

    const h = data.match(/<div class=\"t[0-9]+__(?:title|descr)\"[^>]*>([\s\S]*?)<\/div>/g) || [];
    console.log('--- TITLES ---');
    h.slice(0, 20).forEach(x => console.log(x.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
  });
});
