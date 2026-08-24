const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  
  const { data: allProducts, error } = await supabase
      .from('products')
      .select('id, name, lengths, nail_shape, price')
      .eq('category_id', cat.id);
      
  if (error) {
      console.error(error);
      return;
  }
  
  const incompleteProducts = allProducts.filter(p => {
    return !p.lengths || p.lengths.length === 0 || !p.nail_shape || !p.price || p.price === 0;
  });
  
  console.log(`Total Handmade Products: ${allProducts.length}`);
  console.log(`Incomplete Products: ${incompleteProducts.length}`);
  
  if (incompleteProducts.length > 0) {
      console.log("\nThe following products are missing length, shape, or price:");
      incompleteProducts.forEach(p => {
          console.log(`- ${p.name}`);
      });
  } else {
      console.log("\nAll handmade products are fully updated!");
  }
}

run();
