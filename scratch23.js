const fs = require('fs');

function processFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // Find the exact return statement for the main component
  // It's after all the small SVG functions. 
  // Let's replace the first instance of <div className={styles.cardWrapper}
  
  if (!content.includes('<>\n')) {
    content = content.replace(
      /return \(\s*<div\s+className=\{styles\.cardWrapper\}/,
      'return (\n    <>\n      <div className={styles.cardWrapper}'
    );
  }

  fs.writeFileSync(filename, content);
}

processFile('src/components/product/ProductCard.js');
processFile('src/components/product/HandmadeProductCard.js');
