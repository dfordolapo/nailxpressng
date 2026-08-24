const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  { name: "Vibrant Rose", desc: "Vibrant pink base with bold 3D silver chrome outlines and silver studs, featuring a large textured silver heart charm." },
  { name: "Fierce Vibe", desc: "Translucent pink jelly base layered with striking black airbrush aura centers, accented by bold metallic silver 3D chrome details and silver bead studs." },
  { name: "Bold Dawn", desc: "Minimalist soft pink nude base complemented by thick, bold, asymmetrical black line accents at the tips." },
  { name: "Chic Bloom", desc: "Ethereal translucent milky white base with intricate, wispy smokey black marble veining and subtle silver chrome accents." },
  { name: "Velvet Quartz", desc: "Soft milky nude base with deep burgundy tortoiseshell marble accents and striking thick textured gold chrome outlines." },
  { name: "Subtle Dawn", desc: "Elegant nude base featuring minimalistic textured gold chrome dripping waves along the tips." },
  { name: "Velvet Aura", desc: "Translucent black jelly base with white smokey marble veins, silver chrome abstract starburst details, and tiny silver pearls/studs." },
  { name: "Elegant Vibe", desc: "Deep crimson red gradient fading into a semi-translucent base, featuring soft pink blushes, delicate gold star decals, gold beads, and abstract gold chrome outlines." },
  { name: "Bold Pearl", desc: "Iridescent light pink base with shifting blue undertones, adorned with bold, abstract silver chrome tribal patterns." },
  { name: "Regal Ridge", desc: "Deep red glitter base with contrasting translucent milky white swirls outlining a floral-like pattern, framed by delicate gold wire details." },
  { name: "Regal Coral", desc: "Rich dark red jelly base encased in thick, textured silver chrome borders, leaving the centers hollow." },
  { name: "Moonlit Ridge", desc: "Metallic deep purple base with a chrome finish, accented by 3D water droplet effects and intricate silver cross charms." },
  { name: "Golden Blaze", desc: "Deep crimson red base, with alternating nails featuring large, bold black rose floral designs over a lighter red textured background." },
  { name: "Dreamy Aura", desc: "Deep burgundy magnetic cat-eye base with shifting velvet shimmer, detailed with abstract gold wire outlines." },
  { name: "Soft Dawn", desc: "Deep purple magnetic cat-eye base with thin silver chrome French tips and delicate clear rhinestones and silver bead clusters along the side edges." }
];

async function run() {
  console.log("Starting descriptions update...");
  for (const item of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ description: item.desc })
      .eq('name', item.name)
      .select();
      
    if (error) {
      console.error(`Error updating ${item.name}:`, error.message);
    } else {
      console.log(`Successfully updated ${item.name} (${data ? data.length : 0} row(s))`);
    }
  }
  console.log("Done updating descriptions!");
}

run();
