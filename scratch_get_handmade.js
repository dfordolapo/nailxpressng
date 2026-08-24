const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: products } = await supabase.from('products').select('*').eq('category_id', cat.id);
  
  console.log(JSON.stringify(products.map(p => ({
    id: p.id,
    name: p.name,
    lengths: p.lengths,
    price: p.price,
    description: p.description
  })), null, 2));
}
run();
