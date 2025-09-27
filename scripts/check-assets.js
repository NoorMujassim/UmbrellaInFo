const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const assetRegex = /(?:src|href)\s*=\s*"(assets\/[^"]+)"/ig;
let m; const missing=[]; const seen = new Set();
while((m = assetRegex.exec(html))){ const p = path.join(__dirname,'..',m[1]); if(seen.has(p)) continue; seen.add(p); if(!fs.existsSync(p)){ missing.push(m[1]); }}
if(missing.length>0){ console.error('Missing assets:'); missing.forEach(x=> console.error(' -', x)); process.exitCode = 2; } else { console.log('All assets present.'); }
