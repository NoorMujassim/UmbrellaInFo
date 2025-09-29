// Run: node scripts/convert-icons.js
// Requires: npm install sharp
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assets = path.join(__dirname, '..', 'assets');
const svgs = [
  { src: 'umbrella-icon-192.svg', out: 'umbrella-icon-192.png', size: 192 },
  { src: 'umbrella-icon-512.svg', out: 'umbrella-icon-512.png', size: 512 }
];

(async function(){
  for(const s of svgs){
    const inPath = path.join(assets, s.src);
    const outPath = path.join(assets, s.out);
    if(!fs.existsSync(inPath)){
      console.error('Missing', inPath); continue;
    }
    try{
      const svg = fs.readFileSync(inPath);
      await sharp(svg).png({ quality: 100 }).resize(s.size, s.size).toFile(outPath);
      console.log('Wrote', outPath);
    }catch(err){
      console.error('Failed', inPath, err);
    }
  }
})();