const https = require('https');

function fetchPage(path) {
  return new Promise(resolve => {
    https.get('https://nordickitchens.ru' + path, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const imgs = data.match(/https:\/\/static\.tildacdn\.com\/[^\s\"\'\)\>]+\.(?:jpg|png|webp)/gi) || [];
        const hasLego = /лего|lego/i.test(data);
        resolve({ path, status: res.statusCode, imgCount: imgs.length, hasLego, imgs: [...new Set(imgs)].slice(0, 10) });
      });
    }).on('error', e => resolve({ path, error: e.message }));
  });
}

async function run() {
  const pages = ['/', '/variants', '/moduli', '/mebel', '/price', '/about'];
  for (const p of pages) {
    const res = await fetchPage(p);
    console.log(res.path, 'Status:', res.status, 'Has Lego in text:', res.hasLego, 'Imgs:', res.imgCount);
    if (res.imgs && res.imgs.length) {
      console.log('Sample imgs:', res.imgs.slice(0, 3));
    }
  }
}
run();
