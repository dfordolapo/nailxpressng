const fs = require('fs');

function processFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // Change return ( <div className={styles.cardWrapper}> to return ( <> <div className={styles.cardWrapper}>
  content = content.replace(
    'return (\n    <div\n      className={styles.cardWrapper}',
    'return (\n    <>\n      <div\n        className={styles.cardWrapper}'
  );

  // Append ImageZoomModal outside
  content = content.replace(
    /<\/div>\r?\n\s*<\/div>\r?\n\s*\);\r?\n}\s*$/,
    `  </div>
      <ImageZoomModal 
        isOpen={isZoomOpen} 
        onClose={() => setIsZoomOpen(false)} 
        imageSrc={product.image || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"}
        altText={product.name}
      />
    </>
  );
}
`
  );

  fs.writeFileSync(filename, content);
}

processFile('src/components/product/ProductCard.js');
processFile('src/components/product/HandmadeProductCard.js');
