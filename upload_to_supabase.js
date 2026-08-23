const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const i = line.indexOf('=');
      return [line.substring(0, i).trim(), line.substring(i + 1).trim()];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const handmadeDir = path.join(__dirname, 'public/images/Handmade');
const files = fs.readdirSync(handmadeDir).filter(f => f.match(/\.(jpg|jpeg|png|heic|webp)$/i));

const adjectives = ['Elegant', 'Midnight', 'Velvet', 'Sparkle', 'Glamour', 'Mystic', 'Radiant', 'Luxe', 'Classic', 'Chic', 'Bold', 'Soft', 'Dreamy', 'Vibrant', 'Subtle', 'Fierce', 'Glazed', 'Matte', 'Glossy'];
const nouns = ['Bloom', 'Aura', 'Glow', 'Vibe', 'Charm', 'Gem', 'Crystal', 'Rose', 'Pearl', 'Onyx', 'Quartz', 'Petal', 'Dawn', 'Dusk', 'Eclipse', 'Halo'];
const shapes = ['almond', 'square', 'coffin', 'stiletto', 'oval', 'squoval'];
const colorsList = ['pink', 'black', 'white', 'red', 'nude', 'blue', 'green', 'gold', 'silver', 'purple'];

async function run() {
  const { data: category, error: catError } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  if (catError || !category) {
    console.error('Handmade category not found', catError);
    return;
  }

  const newProducts = [];
  let currentId = Date.now();
  for (const file of files) {
    const name = adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)];
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + currentId++;
    const price = 7500 + Math.floor(Math.random() * 8) * 1000;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colorsList[Math.floor(Math.random() * colorsList.length)];

    const product = {
      name: name,
      slug: slug,
      description: 'A stunning custom handmade set named ' + name + '. Crafted with precision and intricate artistry to give your nails a perfect, salon-quality finish.',
      price: price,
      compare_at_price: price + 2000,
      category_id: category.id,
      nail_shape: shape,
      style: 'custom',
      lengths: ['Short', 'Medium', 'Long'],
      sizes: ['S', 'M', 'L'],
      color: color,
      images: ['/images/Handmade/' + file],
      stock_count: 1,
      new_arrival: Math.random() > 0.7,
      bestseller: Math.random() > 0.8
    };
    newProducts.push(product);
  }

  const { data, error } = await supabase.from('products').insert(newProducts);
  if (error) {
    console.error('Error inserting products:', error);
  } else {
    console.log('Successfully added ' + newProducts.length + ' handmade products to Supabase!');
  }
}

run();
