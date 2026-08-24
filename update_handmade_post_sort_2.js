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
  { name: "Fierce Dusk", length: "Short", shape: "almond" },
  { name: "Glamour Quartz", length: "Medium", shape: "almond" },
  { name: "Velvet Dawn", length: "Medium", shape: "almond" },
  { name: "Velvet Aura", length: "Long", shape: "stiletto" },
  { name: "Opal Prism", length: "Long", shape: "stiletto" },
  { name: "Polished Whisper", length: "Short", shape: "almond" },
  { name: "Subtle Gem", length: "Medium", shape: "oval" },
  { name: "Radiant Rose", length: "Short", shape: "almond" },
  { name: "Fierce Petal", length: "Medium", shape: "almond" },
  { name: "Luminous Shimmer", length: "Medium", shape: "almond" },
  { name: "Glazed Dawn", length: "Long", shape: "stiletto" },
  { name: "Mystic Eclipse", length: "Short", shape: "oval" },
  { name: "Sparkle Halo", length: "Short", shape: "almond" },
  { name: "Velvet Bloom", length: "Short", shape: "almond" },
  { name: "Glamour Dawn", length: "Short", shape: "almond" },
  { name: "Elegant Dusk", length: "Short", shape: "almond" },
  { name: "Dreamy Bloom", length: "Short", shape: "almond" },
  { name: "Sterling Spark", length: "Long", shape: "stiletto" },
  { name: "Mystic Pearl", length: "Short", shape: "almond" },
  { name: "Radiant Dusk", length: "Long", shape: "almond" },
  { name: "Elegant Quartz", length: "Medium", shape: "almond" },
  { name: "Subtle Quartz", length: "Medium", shape: "almond" },
  { name: "Brushed Flare", length: "Short", shape: "almond" },
  { name: "Glazed Eclipse", length: "Medium", shape: "square" },
  { name: "Velvet Petal", length: "Short", shape: "almond" },
  { name: "Vibrant Halo", length: "Short", shape: "almond" },
  { name: "Radiant Pearl", length: "Short", shape: "almond" },
  { name: "Fierce Halo", length: "Medium", shape: "almond" },
  { name: "Glossy Dawn", length: "Medium", shape: "square" },
  { name: "Vibrant Dusk", length: "Short", shape: "almond" },
  { name: "Regal Prism", length: "Long", shape: "almond" },
  { name: "Regal Flare", length: "Short", shape: "almond" },
  { name: "Luxe Charm", length: "Short", shape: "almond" },
  { name: "Gilded Prism", length: "Short", shape: "almond" },
  { name: "Radiant Halo", length: "Medium", shape: "almond" },
  { name: "Luxe Vibe", length: "Medium", shape: "stiletto" },
  { name: "Sunlit Starling", length: "Medium", shape: "almond" },
  { name: "Bold Eclipse", length: "Long", shape: "almond" },
  { name: "Glazed Pearl", length: "Medium", shape: "almond" },
  { name: "Iridescent Mirage", length: "Medium", shape: "almond" },
  { name: "Mystic Gem", length: "Short", shape: "almond" },
  { name: "Midnight Aura", length: "Medium", shape: "almond" },
  { name: "Sparkle Crystal", length: "Long", shape: "stiletto" },
  { name: "Sterling Blaze", length: "Medium", shape: "almond" }
];

async function run() {
  console.log("Starting product updates...");
  
  // First fix names if they contain "Matte" instead of "Velvet" in the database
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: allProducts } = await supabase.from('products').select('id, name').eq('category_id', cat.id);
  
  for (const item of updates) {
    let dbName = item.name;
    let match = allProducts.find(p => p.name.toLowerCase() === dbName.toLowerCase());
    
    if (!match && item.name.includes('Velvet')) {
        dbName = item.name.replace('Velvet', 'Matte');
        match = allProducts.find(p => p.name.toLowerCase() === dbName.toLowerCase());
    }
    
    if (!match) {
        console.error(`Could not find product matching: ${item.name}`);
        continue;
    }
    
    const price = priceMap[item.length];
    
    const payload = {
        name: item.name, // Ensure it gets updated to 'Velvet' if it was 'Matte'
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
