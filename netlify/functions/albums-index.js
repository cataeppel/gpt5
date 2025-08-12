const fs = require('fs');
const path = require('path');

function albumsDir() {
  const candidates = [
    path.resolve('content/albums'),
    path.join(__dirname, '../../content/albums'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('albums directory not found');
}

exports.handler = async function() {
  try {
    const dir = albumsDir();
    const names = fs.readdirSync(dir).filter(n => n.endsWith('.json'));
    const albums = names.map(name => {
      const raw = fs.readFileSync(path.join(dir, name), 'utf8');
      const data = JSON.parse(raw);
      const slug = data.slug || name.replace(/\.json$/, '');
      return { slug, ...data };
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ albums })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
