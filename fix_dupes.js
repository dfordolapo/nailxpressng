const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const i = line.indexOf('=');
      return [line.substring(0, i).trim(), line.substring(i + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Word pools for generating unique names
const adjectives = ['Luxe', 'Silken', 'Golden', 'Frosted', 'Polished', 'Gilded', 'Tinted', 'Brushed', 'Sheer', 'Dusted', 'Crystalline', 'Iridescent', 'Luminous', 'Prismatic', 'Opal', 'Satin', 'Regal', 'Amber', 'Ivory', 'Copper', 'Sterling', 'Moonlit', 'Sunlit', 'Pearlized'];
const nouns = ['Mirage', 'Whisper', 'Spark', 'Luster', 'Shimmer', 'Frost', 'Prism', 'Flare', 'Blaze', 'Mist', 'Cove', 'Ridge', 'Tide', 'Vale', 'Fern', 'Maple', 'Orchid', 'Iris', 'Jasper', 'Coral', 'Topaz', 'Slate', 'Ember', 'Starling'];

async function run() {
  // Get ALL product names to know what's taken
  const { data: allProducts } = await supabase.from('products').select('id, name, slug');
  const existingNames = new Set(allProducts.map(p => p.name));
  const existingSlugs = new Set(allProducts.map(p => p.slug));

  // Find duplicates
  const counts = {};
  allProducts.forEach(p => {
    if (!counts[p.name]) counts[p.name] = [];
    counts[p.name].push(p);
  });

  let renamed = 0;

  for (const [name, products] of Object.entries(counts)) {
    if (products.length <= 1) continue;

    // Keep the first one, rename the rest
    for (let i = 1; i < products.length; i++) {
      let newName;
      let attempts = 0;
      
      // Generate a unique name
      do {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        newName = `${adj} ${noun}`;
        attempts++;
      } while (existingNames.has(newName) && attempts < 100);

      if (existingNames.has(newName)) {
        console.log(`Could not find unique name for duplicate of "${name}"`);
        continue;
      }

      const newSlug = newName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      
      const { error } = await supabase.from('products').update({ 
        name: newName, 
        slug: newSlug 
      }).eq('id', products[i].id);

      if (error) {
        console.log(`Error renaming "${name}" -> "${newName}":`, error.message);
      } else {
        existingNames.add(newName);
        existingSlugs.add(newSlug);
        console.log(`Renamed: "${name}" -> "${newName}"`);
        renamed++;
      }
    }
  }

  console.log(`\nDone! Renamed ${renamed} products.`);
}

run();
