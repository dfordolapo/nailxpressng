const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  
  const { data, error } = await supabase
      .from('products')
      .update({
        lengths: ["Medium"],
        nail_shape: "stiletto",
        price: 12000
      })
      .ilike('name', 'Gilded Cove')
      .eq('category_id', cat.id)
      .select();
      
  if (error) {
      console.error(error);
  } else if (data.length === 0) {
      console.log("Could not find Gilded Cove either.");
  } else {
      console.log("Successfully updated Gilded Cove.");
  }
}

run();
