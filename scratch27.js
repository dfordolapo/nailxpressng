const fs = require('fs');

function fixCollectionClient() {
  const f = 'src/components/product/CollectionClient.js';
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace the empty state logic
  const oldEmpty = `            {filtered.length === 0 ? (
              <div className={filterStyles.noResults} style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "80px 20px", background: "var(--color-bg-card)", borderRadius: "var(--radius-xl)", 
                border: "1px dashed var(--color-border)", textAlign: "center", minHeight: "400px"
              }}>
                <PackageSearch size={48} color="var(--color-primary)" style={{ marginBottom: "20px", opacity: 0.8 }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", marginBottom: "8px" }}>We're fresh out of sets!</h3>
                <p className={filterStyles.mobileSmallText} style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "450px", marginBottom: "24px", lineHeight: "1.6" }}>
                  We couldn't find any nails matching your exact shape and length preferences. Try tweaking your selection.
                </p>
                <button 
                  onClick={() => { setSelectedShapes([]); setSelectedLengths([]); setSelectedColors([]); }}
                  style={{
                    padding: "10px 24px", backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)", color: "var(--color-text)", fontSize: "0.85rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (`;

  const newEmpty = `            {allProducts.length === 0 ? (
              <div className={filterStyles.noResults} style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "80px 20px", background: "var(--color-bg-card)", borderRadius: "var(--radius-xl)", 
                border: "1px dashed var(--color-border)", textAlign: "center", minHeight: "400px"
              }}>
                <PackageSearch size={48} color="var(--color-primary)" style={{ marginBottom: "20px", opacity: 0.8 }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", marginBottom: "8px" }}>We're fresh out of sets!</h3>
                <p className={filterStyles.mobileSmallText} style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "450px", marginBottom: "24px", lineHeight: "1.6" }}>
                  We're currently sold out of this entire collection! Check back soon for restocks.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={filterStyles.noResults} style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "80px 20px", background: "var(--color-bg-card)", borderRadius: "var(--radius-xl)", 
                border: "1px dashed var(--color-border)", textAlign: "center", minHeight: "400px"
              }}>
                <PackageSearch size={48} color="var(--color-primary)" style={{ marginBottom: "20px", opacity: 0.8 }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", marginBottom: "8px" }}>No exact matches</h3>
                <p className={filterStyles.mobileSmallText} style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "450px", marginBottom: "24px", lineHeight: "1.6" }}>
                  We couldn't find any nails matching your exact shape and length preferences. Try tweaking your selection.
                </p>
                <button 
                  onClick={() => { setSelectedShapes([]); setSelectedLengths([]); setSelectedColors([]); }}
                  style={{
                    padding: "10px 24px", backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)", color: "var(--color-text)", fontSize: "0.85rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (`;

  // Use a softer replace just in case indentation or newlines differ slightly
  if (content.includes("We couldn't find any nails matching your exact shape and length preferences")) {
    // Let's replace the whole block by finding {filtered.length === 0 ? ( ... ) : (
    // Regex might be safer here since it's a huge block
    content = content.replace(/\{filtered\.length === 0 \? \([\s\S]*?<\/button>\s*<\/div>\s*\) : \(/m, newEmpty.trim());
    fs.writeFileSync(f, content);
  }
}

function fixFactoryVideos() {
  const f = 'src/components/product/FactoryVideos.js';
  let content = fs.readFileSync(f, 'utf8');

  // Fix subtitle
  content = content.replace(
    'Get a closer look at our beautiful ready-to-wear sets.',
    'Get a closer look at our ready-to-wear sets.'
  );

  // Fix click logic
  // Remove onMouseEnter and onMouseLeave
  content = content.replace(/\s*onMouseEnter=\{handleMouseEnter\}/g, '');
  content = content.replace(/\s*onMouseLeave=\{handleMouseLeave\}/g, '');

  fs.writeFileSync(f, content);
}

fixCollectionClient();
fixFactoryVideos();
