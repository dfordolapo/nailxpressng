const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const targetNames = [
    "Bold Dawn", "Velvet Quartz", "Vibrant Rose", "Elegant Vibe", 
    "Bold Pearl", "Golden Blaze", "Subtle Dawn", "Dreamy Aura", 
    "Moonlit Ridge", "Fierce Vibe", "Chic Bloom", "Regal Coral", 
    "Soft Dawn", "Regal Ridge", "Velvet Aura", "Matte Aura", "Matte Quartz"
  ];

  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: products } = await supabase.from('products').select('name, images').eq('category_id', cat.id);
  
  const found = products.filter(p => targetNames.some(tn => p.name.toLowerCase().includes(tn.toLowerCase()) || tn.toLowerCase().includes(p.name.toLowerCase())));
  
  console.log(JSON.stringify(found, null, 2));
}
run();
