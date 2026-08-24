const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  { name: "Glamour Charm", length: "Medium", shape: "almond", price: 12000 },
  { name: "Velvet Bloom", length: "Short", shape: "almond", price: 10000 },
  { name: "Classic Vibe", length: "Medium", shape: "almond", price: 12000 },
  { name: "Luxe Halo", length: "Medium", shape: "almond", price: 12000 },
  { name: "Mystic Petal", length: "Short", shape: "almond", price: 10000 }
];

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: allProducts } = await supabase.from('products').select('id, name').eq('category_id', cat.id);
  
  for (const item of updates) {
    let dbName = item.name;
    let match = allProducts.find(p => p.name.toLowerCase() === dbName.toLowerCase());
    
    // fallbacks
    if (!match && item.name === 'Mystic Petal') {
       match = allProducts.find(p => p.name.toLowerCase() === 'mystic peral');
    }
    
    if (!match) {
        console.error(`Could not find product matching: ${item.name}`);
        continue;
    }
    
    const payload = {
        name: item.name, 
        lengths: [item.length],
        nail_shape: item.shape,
        price: item.price
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', match.id)
      .select();
      
    if (error) {
      console.error(`Error updating ${item.name}:`, error.message);
    } else {
      console.log(`Successfully updated ${item.name}`);
    }
  }
}

run();
