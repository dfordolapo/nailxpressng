const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: allProducts } = await supabase.from('products').select('id, name, images').eq('category_id', cat.id);
  
  const imageMap = {};
  
  allProducts.forEach(p => {
    if (p.images && p.images.length > 0) {
        const primaryImage = p.images[0];
        if (!imageMap[primaryImage]) {
            imageMap[primaryImage] = [];
        }
        imageMap[primaryImage].push(p.name);
    }
  });
  
  let foundDuplicates = false;
  
  for (const [image, names] of Object.entries(imageMap)) {
      if (names.length > 1) {
          foundDuplicates = true;
          console.log(`Shared Image: ${image}`);
          console.log(`Products: ${names.join(' AND ')}\n`);
      }
  }
  
  if (!foundDuplicates) {
      console.log("No duplicate images found across the handmade products!");
  }
}

run();
