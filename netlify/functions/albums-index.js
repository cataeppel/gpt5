const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const dir = path.join(__dirname, '../../content/albums');
    const names = fs.readdirSync(dir).filter(n => n.endsWith('.json'));
    const albums = names.map(name => {
      const p = path.join(dir, name);
      const raw = fs.readFileSync(p, 'utf8');
      const data = JSON.parse(raw);
      return { slug: name.replace(/\.json$/, ''), ...data };
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
