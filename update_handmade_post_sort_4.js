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
  { name: "Glossy Petal", length: "Long", shape: "stiletto" },
  { name: "Vibrant Bloom", length: "Long", shape: "stiletto" }, // fixed blooom
  { name: "Sparkle Onyx", length: "Long", shape: "almond" },
  { name: "Glamour Petal", length: "Medium", shape: "almond" },
  { name: "Sparkle Gem", length: "Short", shape: "almond" },
  { name: "Soft Vibe", length: "Medium", shape: "almond" },
  { name: "Sparkle Quartz", length: "Medium", shape: "almond" },
  { name: "Glazed Rose", length: "Medium", shape: "almond" },
  { name: "Elegant Gem", length: "Short", shape: "almond" },
  { name: "Glossy Aura", length: "Medium", shape: "almond" },
  { name: "Soft Petal", length: "Medium", shape: "almond" }, // fixed sogt
  { name: "Vibrant Aura", length: "Medium", shape: "stiletto" },
  { name: "Glazed Charm", length: "Short", shape: "almond" },
  { name: "Iridescent Veil", length: "Medium", shape: "square" }, // fixed vale
  { name: "Opal Mist", length: "Medium", shape: "stiletto" },
  { name: "Mystic Aura", length: "Short", shape: "oval" }, // fixed mystaic
  { name: "Chic Quartz", length: "Medium", shape: "almond" },
  { name: "Mystic Vibe", length: "Long", shape: "almond" }, // fixed mustic
  { name: "Glamour Bloom", length: "Medium", shape: "almond" },
  { name: "Gilded Core", length: "Medium", shape: "stiletto" },
  { name: "Glossy Crystal", length: "Medium", shape: "almond" },
  { name: "Subtle Onyx", length: "Medium", shape: "almond" },
  { name: "Velvet Bloom", length: "Medium", shape: "almond" },
  { name: "Radiant Onyx", length: "Medium", shape: "almond" },
  { name: "Fierce Eclipse", length: "Medium", shape: "stiletto" },
  { name: "Glazed Glow", length: "Medium", shape: "almond" },
  { name: "Chic Eclipse", length: "Medium", shape: "almond" }, // fixed chip
  { name: "Sterling Iris", length: "Medium", shape: "almond" },
  { name: "Radiant Bloom", length: "Medium", shape: "almond" },
  { name: "Regal Mist", length: "Long", shape: "almond" }, // fixed ragal
  { name: "Velvet Onyx", length: "Medium", shape: "almond" } // Matte Onyx mapped to Velvet
];

async function run() {
  console.log("Starting product updates for batch 4...");
  
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
    
    // Fallbacks for typos we might have guessed wrong
    if (!match && item.name === 'Iridescent Veil') {
       match = allProducts.find(p => p.name.toLowerCase() === 'iridescent vale');
    }
    if (!match && item.name === 'Chic Eclipse') {
       match = allProducts.find(p => p.name.toLowerCase() === 'chip eclipse');
    }
    if (!match && item.name === 'Vibrant Bloom') {
       match = allProducts.find(p => p.name.toLowerCase() === 'vibrant blooom');
    }
    if (!match && item.name === 'Soft Petal') {
       match = allProducts.find(p => p.name.toLowerCase() === 'sogt petal');
    }
    if (!match && item.name === 'Mystic Aura') {
       match = allProducts.find(p => p.name.toLowerCase() === 'mystaic aura');
    }
    if (!match && item.name === 'Mystic Vibe') {
       match = allProducts.find(p => p.name.toLowerCase() === 'mustic vibe');
    }
    if (!match && item.name === 'Regal Mist') {
       match = allProducts.find(p => p.name.toLowerCase() === 'ragal mist');
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
