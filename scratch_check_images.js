const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: products } = await supabase.from('products').select('name, images').eq('category_id', cat.id);
  
  console.log(JSON.stringify(products, null, 2));
}

run();
