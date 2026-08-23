const fs = require('fs');

function appendModal(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  if (!content.includes('<ImageZoomModal')) {
    // We already prepended `<>` using the earlier node script!
    // So we just need to replace the final </div></div>); } with </div><ImageZoomModal/></>); }
    
    // For ProductCard.js
    if (content.includes('        )}\\r\\n      </div>\\r\\n    </div>\\r\\n  );\\r\\n}')) {
       // Windows newlines
    }

    // Let's just use string replace on the known end string
    const endString = '      </div>\n    </div>\n  );\n}';
    const endStringWin = '      </div>\r\n    </div>\r\n  );\r\n}';
    
    const replacement = `      </div>
      <ImageZoomModal 
        isOpen={isZoomOpen} 
        onClose={() => setIsZoomOpen(false)} 
        imageSrc={product.image || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"}
        altText={product.name}
      />
    </>
  );
}`;

    if (content.includes(endString)) {
      content = content.replace(endString, replacement);
    } else if (content.includes(endStringWin)) {
      content = content.replace(endStringWin, replacement);
    } else {
        // Fallback regex if it's slightly different
        content = content.replace(
            /<\/div>\r?\n\s*<\/div>\r?\n\s*\);\r?\n}\s*$/,
            replacement
        );
    }

    fs.writeFileSync(filename, content);
  }
}

appendModal('src/components/product/ProductCard.js');
appendModal('src/components/product/HandmadeProductCard.js');
