const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envContent.split('\n').filter(line => line && !line.startsWith('#')).map(line => { const i = line.indexOf('='); return [line.substring(0, i).trim(), line.substring(i + 1).trim()]; }));
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // Fetch Ocean Bloom and Chic Halo
  const { data: products } = await supabase.from('products').select('*').in('name', ['Ocean Bloom', 'Chic Halo']);
  
  const ocean = products.find(p => p.name === 'Ocean Bloom');
  const chic = products.find(p => p.name === 'Chic Halo');

  if (ocean && chic) {
    // Swap their names and slugs
    const tempName = ocean.name;
    const tempSlug = ocean.slug;

    await supabase.from('products').update({ name: chic.name, slug: chic.slug }).eq('id', ocean.id);
    await supabase.from('products').update({ name: tempName, slug: tempSlug }).eq('id', chic.id);
    
    console.log("Successfully swapped names and slugs for Ocean Bloom and Chic Halo!");
  } else {
    console.error("Could not find both products to swap.");
  }
}

run();
