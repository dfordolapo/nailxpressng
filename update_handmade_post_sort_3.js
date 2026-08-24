const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const priceMap = {
  "Short": 10000,
  "Medium": 12000,
  "Long": 15000,
  "Extra Long": 20000
};

const updates = [
  // all medum almond
  { name: "Dreamy Crystal", length: "Medium", shape: "almond" },
  { name: "Vibrant Eclipse", length: "Medium", shape: "almond" },
  { name: "Subtle Pearl", length: "Medium", shape: "almond" },
  { name: "Gilded Whisper", length: "Medium", shape: "almond" },
  { name: "Soft Halo", length: "Medium", shape: "almond" },
  { name: "Glamour Glow", length: "Medium", shape: "almond" },
  { name: "Fierce Dawn", length: "Medium", shape: "almond" },
  { name: "Radiant Crystal", length: "Medium", shape: "almond" },
  
  // others
  { name: "Midnight Crystal", length: "Long", shape: "stiletto" },
  
  // both medium square
  { name: "Glazed Quartz", length: "Medium", shape: "square" },
  { name: "Classic Glow", length: "Medium", shape: "square" },
  
  { name: "Crystalline Mirage", length: "Medium", shape: "almond" },
  { name: "Velvet Rose", length: "Extra Long", shape: "square" }, // 'Matte Rose' maybe?
  { name: "Fierce Bloom", length: "Medium", shape: "almond" },
  { name: "Elegant Pearl", length: "Medium", shape: "square" },
  { name: "Midnight Vibe", length: "Long", shape: "stiletto" },
  { name: "Sparkle Charm", length: "Medium", shape: "square" },
  { name: "Dreamy Dawn", length: "Medium", shape: "almond" },
  { name: "Vibrant Gem", length: "Medium", shape: "almond" },
  { name: "Regal Fern", length: "Long", shape: "almond" },
  { name: "Dreamy Vibe", length: "Short", shape: "almond" },
  { name: "Dreamy Dusk", length: "Long", shape: "almond" },
  { name: "Glazed Dusk", length: "Short", shape: "almond" },
  { name: "Ocean Bloom", length: "Medium", shape: "almond" },
  { name: "Prismatic Maple", length: "Long", shape: "stiletto" },
  { name: "Vibrant Onyx", length: "Medium", shape: "stiletto" },
  { name: "Luxe Tide", length: "Medium", shape: "almond" },
  { name: "Radiant Dawn", length: "Medium", shape: "almond" },
  
  // both medium almond
  { name: "Chic Gem", length: "Medium", shape: "almond" },
  { name: "Glossy Vibe", length: "Medium", shape: "almond" },
  
  { name: "Glossy Gem", length: "Long", shape: "square" }
];

async function run() {
  console.log("Starting product updates...");
  
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: allProducts } = await supabase.from('products').select('id, name').eq('category_id', cat.id);
  
  for (const item of updates) {
    let dbName = item.name;
    // Basic match
    let match = allProducts.find(p => p.name.toLowerCase() === dbName.toLowerCase());
    
    // Fallback for Matte/Velvet renaming
    if (!match && item.name.includes('Velvet')) {
        dbName = item.name.replace('Velvet', 'Matte');
        match = allProducts.find(p => p.name.toLowerCase() === dbName.toLowerCase());
    }
    
    // Typo fixing fallbacks
    if (!match && item.name === 'Classic Glow') {
       match = allProducts.find(p => p.name.toLowerCase() === 'classic vibe'); // if the user typoed classic vibe/glow
    }
    if (!match && item.name === 'Sparkle Charm') {
       match = allProducts.find(p => p.name.toLowerCase() === 'sparrkle charm'); // just in case
    }
    
    if (!match) {
        console.error(`Could not find product matching: ${item.name}`);
        continue;
    }
    
    const price = priceMap[item.length];
    
    const payload = {
        name: item.name, 
        lengths: [item.length],
        nail_shape: item.shape,
        price: price
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', match.id)
      .select();
      
    if (error) {
      console.error(`Error updating ${item.name}:`, error.message);
    } else {
      console.log(`Successfully updated ${item.name} (${data.length} row(s))`);
    }
  }
  console.log("Done updating products!");
}

run();
