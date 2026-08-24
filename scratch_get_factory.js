const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'factory').single();
  const { data: products } = await supabase.from('products').select('*').eq('category_id', cat.id).limit(5);
  
  console.log(JSON.stringify(products.map(p => ({
    name: p.name,
    description: p.description
  })), null, 2));
}
run();
