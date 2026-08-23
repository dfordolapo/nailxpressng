const fs = require('fs');

function processFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // 1. Add ImageZoomModal import
  if (!content.includes('ImageZoomModal')) {
    content = content.replace(
      'import { useToast } from "@/context/ToastContext";',
      'import { useToast } from "@/context/ToastContext";\nimport ImageZoomModal from "@/components/product/ImageZoomModal";'
    );
  }

  // 2. Add ZoomInIcon
  if (!content.includes('function ZoomInIcon')) {
    const zoomIconStr = `
function ZoomInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 11h6" />
      <path d="M11 8v6" />
    </svg>
  );
}`;
    content = content.replace(
      'export default function ',
      zoomIconStr + '\n\nexport default function '
    );
  }

  // 3. Add states for zoom
  if (!content.includes('const [isZoomOpen')) {
    content = content.replace(
      'const [added, setAdded] = useState(false);',
      'const [added, setAdded] = useState(false);\n  const [isZoomOpen, setIsZoomOpen] = useState(false);'
    );
  }

  // 4. Add handleZoom
  if (!content.includes('const handleZoom')) {
    content = content.replace(
      'const handleQty = (delta, e) => {',
      `const handleZoom = (e) => {\n    e.preventDefault();\n    e.stopPropagation();\n    setIsZoomOpen(true);\n  };\n\n  const handleQty = (delta, e) => {`
    );
  }

  // 5. Add zoom button and out of stock badge
  const badgeStr = `
            <button 
              className={styles.quickAction} 
              style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 10 }}
              onClick={handleZoom}
              aria-label="Zoom image"
            >
              <ZoomInIcon />
            </button>

            <div className={styles.shine} />

            <div className={styles.badges}>
              {!product.inStock ? (
                <span className={\`\${styles.badge}\`} style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>Sold Out</span>
              ) : (
                <>
                  {product.newArrival && (
                    <span className={\`\${styles.badge} \${styles.badgeNew}\`}>New</span>
                  )}
                  {product.bestseller && (
                    <span className={\`\${styles.badge} \${styles.badgeBestseller}\`}>Bestseller</span>
                  )}
                </>
              )}
            </div>
`;
  if (!content.includes('<ZoomInIcon />')) {
    content = content.replace(
      /<div className=\{styles\.shine\} \/>\s*<div className=\{styles\.badges\}>[\s\S]*?<\/div>/,
      badgeStr
    );
  }

  // 6. Update add to cart buttons
  content = content.replace(
    /<button\s*className=\{\`\$\{styles\.addBtn\} \$\{added \? styles\.added : styles\.default\}\`\}\s*onClick=\{handleAddToCart\}\s*>/g,
    `<button
                className={\`\${styles.addBtn} \${added ? styles.added : styles.default}\`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={!product.inStock ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >`
  );
  content = content.replace(
    /\{added \? \(\<\>\<CheckIcon \/\> Added to Cart\<\/\>\) : "Add to Cart"\}/g,
    `{!product.inStock ? "Sold Out" : added ? (<><CheckIcon /> Added to Cart</>) : "Add to Cart"}`
  );

  // 7. Add modal to end OUTSIDE of cardWrapper
  if (!content.includes('<ImageZoomModal')) {
    // Change return ( <div className={styles.cardWrapper}> to return ( <> <div className={styles.cardWrapper}>
    content = content.replace(
      'return (\n    <div\n      className={styles.cardWrapper}',
      'return (\n    <>\n      <div\n        className={styles.cardWrapper}'
    );

    // Append ImageZoomModal outside
    content = content.replace(
      /\s*<\/div>\n\s*<\/div>\n\s*\);\n\}\s*$/,
      `
      </div>
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
  }

  fs.writeFileSync(filename, content);
}

processFile('src/components/product/ProductCard.js');
processFile('src/components/product/HandmadeProductCard.js');
