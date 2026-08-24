require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: category } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, images')
    .eq('category_id', category.id);
    
  console.log(JSON.stringify(products, null, 2));
}

main();
