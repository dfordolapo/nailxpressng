const fs = require('fs');

let code = fs.readFileSync('src/data/products.js', 'utf-8');

// 1. Fix the image path
code = code.replace(/\/images\/Factory made\//g, '/images/factory-made/');

// 2. Set featured and bestseller for specific slugs
const slugsToFeature = ['rose-pearl', 'sunset-drops', 'classic-french', 'bridal-bows', 'cherry-bomb', 'comic-hearts'];

slugsToFeature.forEach(slug => {
  const targetStr = `"slug": "${slug}",`;
  const idx = code.indexOf(targetStr);
  if (idx !== -1) {
    const endIdx = code.indexOf('}', idx);
    let objStr = code.substring(idx, endIdx);
    objStr = objStr.replace(/"bestseller": false/, '"bestseller": true');
    objStr = objStr.replace(/"featured": false/, '"featured": true');
    code = code.substring(0, idx) + objStr + code.substring(endIdx);
  }
});

fs.writeFileSync('src/data/products.js', code);
console.log('Successfully updated products.js with renamed paths and featured items.');
