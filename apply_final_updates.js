require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const priceMap = {
  "Short": 10000,
  "Medium": 12000,
  "Long": 15000,
  "Extra Long": 20000
};

// Target configurations provided by the user
const targetConfigs = [
  { name: "Bold Dawn", length: "Short", shape: "almond", description: "Milky white base with bold black organic swirling lines and small silver stud accents." },
  { name: "Velvet Quartz", length: "Short", shape: "almond", description: "Translucent white milky base with delicate silver wire swirls and white pearl embellishments." },
  { name: "Vibrant Rose", length: "Short", shape: "square", description: "Bright neon pink jelly base with iridescent shimmer and raised, clear 3D swirling textures." },
  { name: "Elegant Vibe", length: "Short", shape: "almond", description: "Deep magenta/wine red gradient ombré on a nude base, adorned with abstract metallic gold loops and tiny gold beads." },
  { name: "Bold Pearl", length: "Long", shape: "almond", description: "Iridescent light pink base with shifting blue undertones, adorned with bold, abstract silver chrome tribal patterns." },
  { name: "Golden Blaze", length: "Medium", shape: "almond", description: "Deep crimson red base, with alternating nails featuring large, bold black rose floral designs over a lighter red textured background." },
  { name: "Subtle Dawn", length: "Short", shape: "square", description: "Nude base with abstract metallic gold french tip outlines in a wavy, fluid pattern." },
  { name: "Dreamy Aura", length: "Short", shape: "almond", description: "Deep burgundy magnetic cat-eye base with shifting velvet shimmer, detailed with abstract gold wire outlines." },
  { name: "Moonlit Ridge", length: "Medium", shape: "square", description: "Metallic deep purple base with a chrome finish, accented by 3D water droplet effects and intricate silver cross charms." },
  { name: "Fierce Vibe", length: "Short", shape: "almond", description: "Deep black base with subtle silver magnetic shimmer and metallic silver abstract fluid line art." },
  { name: "Chic Bloom", length: "Medium", shape: "square", description: "Nude base featuring diagonal metallic silver wire lines in an abstract pattern." },
  { name: "Regal Coral", length: "Medium", shape: "almond", description: "Rich dark red jelly base encased in thick, textured silver chrome borders, leaving the centers hollow." },
  { name: "Soft Dawn", length: "Medium", shape: "almond", description: "Light pink/nude jelly base with abstract metallic gold swirls in a delicate wavy pattern." },
  { name: "Regal Ridge", length: "Short", shape: "almond", description: "Deep red glitter base with contrasting translucent milky white swirls outlining a floral-like pattern, framed by delicate gold wire details." },
  { name: "Velvet Aura", length: "Short", shape: "almond", description: "Translucent black jelly base with white smokey marble veins, silver chrome details, and tiny silver pearls/studs." }
];

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log("Fetching handmade products...");
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: products } = await supabase.from('products').select('*').eq('category_id', cat.id);

  // 1. Delete Midnight Onyx (keep Elegant Quartz)
  const midnightOnyx = products.find(p => p.name.toLowerCase() === 'midnight onyx');
  if (midnightOnyx) {
    console.log("Deleting duplicate product 'Midnight Onyx'...");
    await supabase.from('products').delete().eq('id', midnightOnyx.id);
  }

  // 2. Rename Matte -> Velvet and apply shapes/lengths/prices
  for (let product of products) {
    let newName = product.name;
    let needsUpdate = false;
    let updates = {};

    // Rename 'Matte' to 'Velvet'
    if (newName.includes("Matte")) {
      newName = newName.replace("Matte", "Velvet");
      updates.name = newName;
      needsUpdate = true;
      console.log(`Renaming ${product.name} -> ${newName}`);
    }

    // Check if it's in our target config list
    const config = targetConfigs.find(c => c.name.toLowerCase() === newName.toLowerCase());
    if (config) {
      updates.lengths = [config.length];
      updates.nail_shape = config.shape;
      updates.price = priceMap[config.length];
      updates.description = config.description;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const { error } = await supabase.from('products').update(updates).eq('id', product.id);
      if (error) {
        console.error(`Error updating ${newName}:`, error.message);
      } else {
        console.log(`Successfully updated ${newName} | Shape: ${updates.nail_shape || product.nail_shape} | Length: ${updates.lengths?.[0] || 'Unchanged'} | Price: ${updates.price || product.price}`);
      }
    }
  }

  console.log("All updates complete!");
}

run();
