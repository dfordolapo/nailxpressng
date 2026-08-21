const fs = require('fs');
let content = fs.readFileSync('src/data/products.js', 'utf-8');
content = content.replace(/lengths: \['short', 'medium', 'long', 'extra long'\]/g, "lengths: ['Short', 'Medium', 'Long', 'Extra Long']");
fs.writeFileSync('src/data/products.js', content);
console.log('Done!');
