import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Fetching categories from Supabase...');
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }

  const categoryMap = {};
  categories.forEach(c => {
    categoryMap[c.slug] = c.id;
  });

  console.log('Categories found:', categoryMap);
  console.log(`Preparing to insert ${products.length} products...`);

  // Transform products
  const productsToInsert = products.map(p => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compare_at_price: p.compareAtPrice,
    category_id: categoryMap[p.category],
    nail_shape: p.nailShape,
    style: p.style,
    lengths: p.lengths,
    sizes: p.sizes,
    images: p.images,
    new_arrival: p.newArrival,
    bestseller: p.bestseller,
    stock_count: p.inStock ? 50 : 0
  }));

  const { data, error } = await supabase.from('products').insert(productsToInsert).select();

  if (error) {
    console.error('Error inserting products:', error);
  } else {
    console.log(`Successfully inserted ${data.length} products!`);
  }
}

seed();
