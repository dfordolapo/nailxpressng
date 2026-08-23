const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const i = line.indexOf('=');
      return [line.substring(0, i).trim(), line.substring(i + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Map of keywords in names to descriptive elements
const adjectiveDescriptions = {
  'Glazed': ['smooth glossy finish', 'lustrous glazed coating', 'high-shine glazed surface'],
  'Radiant': ['radiant luminous glow', 'soft radiant shimmer', 'warm radiant finish'],
  'Mystic': ['mysterious deep tones', 'enchanting mystic depth', 'captivating dark undertones'],
  'Glamour': ['glamorous rhinestone accents', 'luxurious glamour details', 'opulent embellishments'],
  'Sparkle': ['dazzling sparkle accents', 'shimmering glitter particles', 'eye-catching sparkle finish'],
  'Subtle': ['understated elegance', 'delicate minimalist design', 'soft muted tones'],
  'Fierce': ['bold statement design', 'striking contrast patterns', 'dramatic eye-catching style'],
  'Velvet': ['velvety matte texture', 'rich velvet-smooth finish', 'luxurious soft-touch surface'],
  'Vibrant': ['vivid colour palette', 'bright energetic tones', 'rich saturated hues'],
  'Soft': ['gentle pastel palette', 'delicate soft colour blend', 'light airy aesthetic'],
  'Matte': ['sleek matte finish', 'modern flat-tone surface', 'sophisticated non-glossy look'],
  'Elegant': ['refined sophisticated design', 'graceful timeless style', 'polished classic aesthetic'],
  'Bold': ['daring high-contrast look', 'powerful bold statement', 'unapologetic standout design'],
  'Dreamy': ['ethereal dreamy palette', 'whimsical pastel blend', 'soft romantic aesthetic'],
  'Classic': ['timeless classic design', 'enduring traditional style', 'effortlessly chic look'],
  'Chic': ['modern chic silhouette', 'trendy contemporary style', 'sleek fashion-forward design'],
  'Midnight': ['deep midnight tones', 'dark moody palette', 'rich nocturnal hues'],
  'Glossy': ['mirror-like glossy shine', 'brilliant high-gloss coating', 'sleek reflective surface'],
  'Luxe': ['premium luxe detailing', 'lavish high-end finish', 'indulgent luxury design'],
  'Regal': ['regal ornate detailing', 'majestic rich tones', 'royal-inspired elegance'],
  'Polished': ['flawless polished surface', 'pristine smooth finish', 'refined clean lines'],
  'Gilded': ['gilded metallic accents', 'warm gold-toned highlights', 'elegant gilded touches'],
  'Sterling': ['cool silver-toned accents', 'refined sterling highlights', 'metallic shimmer details'],
  'Iridescent': ['colour-shifting iridescent glow', 'holographic light-play finish', 'rainbow sheen accents'],
  'Luminous': ['luminous light-catching surface', 'glowing inner radiance', 'softly lit finish'],
  'Prismatic': ['prismatic rainbow reflections', 'multi-tonal light play', 'spectrum colour shifts'],
  'Crystalline': ['crystal-clear transparency', 'ice-like crystalline sparkle', 'diamond-bright clarity'],
  'Opal': ['opalescent colour-play', 'milky iridescent sheen', 'dreamy opal undertones'],
  'Moonlit': ['cool moonlit silver glow', 'celestial pale shimmer', 'serene nighttime aesthetic'],
  'Sunlit': ['warm sunlit golden tones', 'bright sun-kissed glow', 'cheerful radiant warmth'],
  'Brushed': ['brushed textured finish', 'artisan hand-brushed strokes', 'softly blended surface'],
  'Golden': ['rich golden metallic warmth', 'amber gold highlights', 'sun-drenched golden tones'],
};

const nounDescriptions = {
  'Rose': ['with romantic rose-pink undertones', 'featuring soft rosy blush tones', 'in a warm rose-inspired palette'],
  'Pearl': ['with pearlescent white accents', 'adorned with pearl-like luminosity', 'featuring iridescent pearl tones'],
  'Gem': ['with gemstone-inspired depth', 'featuring jewel-toned richness', 'adorned with gem-like brilliance'],
  'Charm': ['with charming decorative details', 'featuring delightful accent work', 'with playful ornamental touches'],
  'Quartz': ['with quartz-crystal clarity', 'in translucent rose quartz tones', 'featuring crystalline quartz accents'],
  'Dusk': ['in warm golden-hour hues', 'with dusky sunset undertones', 'in rich twilight-inspired tones'],
  'Bloom': ['with floral-inspired artistry', 'featuring blossoming design elements', 'in fresh garden-bloom colours'],
  'Vibe': ['with a free-spirited aesthetic', 'featuring effortless cool-girl energy', 'in a mood-setting palette'],
  'Dawn': ['in soft sunrise-inspired tones', 'with warm early-morning hues', 'featuring gentle daybreak colours'],
  'Aura': ['with an ethereal glowing effect', 'featuring a luminous halo finish', 'with a captivating aura glow'],
  'Onyx': ['in deep onyx black tones', 'with rich dark onyx depth', 'featuring sleek jet-black accents'],
  'Halo': ['with a soft glowing halo effect', 'featuring angelic light accents', 'with a delicate ring of shimmer'],
  'Petal': ['with delicate petal-soft details', 'featuring flower-petal textures', 'in a soft botanical palette'],
  'Crystal': ['with crystal-clear sparkle accents', 'featuring brilliant crystal embellishments', 'with prismatic crystal detailing'],
  'Eclipse': ['in dramatic light-and-dark contrast', 'with bold eclipse-inspired gradients', 'featuring striking shadow play'],
  'Glow': ['with a warm inner glow', 'featuring a lit-from-within radiance', 'with a soft ambient luminosity'],
  'Whisper': ['with barely-there delicate tones', 'in a hushed understated palette', 'featuring whisper-soft colour hints'],
  'Flare': ['with a bold radiant burst', 'featuring fiery accent tones', 'with dynamic energy and warmth'],
  'Shimmer': ['with an all-over shimmer effect', 'featuring fine micro-glitter particles', 'with a light-catching shimmer coat'],
  'Blaze': ['with fiery bold intensity', 'featuring blazing warm tones', 'in a bold flame-inspired palette'],
  'Mirage': ['with an illusion-like depth', 'featuring shifting mirage tones', 'with a mesmerising colour play'],
  'Ridge': ['with structured linear detailing', 'featuring clean geometric lines', 'with textured ridge accents'],
  'Tide': ['in flowing ocean-inspired tones', 'with wave-like fluid movement', 'featuring cool coastal colours'],
  'Prism': ['with prismatic multi-colour accents', 'featuring light-refracting details', 'in a spectrum-rich palette'],
  'Coral': ['in warm coral-pink tones', 'with vibrant coral accents', 'featuring sun-warmed coral hues'],
  'Mist': ['in soft misty pale tones', 'with a delicate fog-like quality', 'featuring hazy translucent layers'],
  'Fern': ['in fresh natural green tones', 'with earthy botanical accents', 'featuring organic fern-inspired hues'],
  'Iris': ['in rich purple iris tones', 'with vibrant violet accents', 'featuring regal iris-inspired hues'],
  'Cove': ['in serene coastal tones', 'with tranquil sea-inspired hues', 'featuring calm oceanic colours'],
  'Maple': ['in warm autumn maple tones', 'with rich amber-brown accents', 'featuring golden harvest hues'],
  'Starling': ['with iridescent starling-wing sheen', 'featuring dark glossy rainbow reflections', 'with colour-shifting dark tones'],
};

const shapeNames = {
  'almond': 'Almond',
  'square': 'Square',
  'coffin': 'Coffin',
  'stiletto': 'Stiletto',
  'oval': 'Oval',
  'squoval': 'Squoval',
};

function generateDescription(name, shape) {
  const words = name.split(' ');
  const adj = words[0];
  const noun = words[1] || words[0];
  const shapeName = shapeNames[shape] || 'Almond';

  const adjDescs = adjectiveDescriptions[adj] || ['beautifully crafted design'];
  const nounDescs = nounDescriptions[noun] || ['with unique hand-painted details'];

  const adjDesc = adjDescs[Math.floor(Math.random() * adjDescs.length)];
  const nounDesc = nounDescs[Math.floor(Math.random() * nounDescs.length)];

  return `${shapeName} shape with ${adjDesc} ${nounDesc}.`;
}

async function run() {
  const { data } = await supabase.from('products')
    .select('id, name, nail_shape, description')
    .like('description', '%Crafted with precision%');

  console.log(`Updating ${data.length} products...`);
  const usedDescs = new Set();
  let count = 0;

  for (const p of data) {
    let desc;
    let attempts = 0;
    do {
      desc = generateDescription(p.name, p.nail_shape);
      attempts++;
    } while (usedDescs.has(desc) && attempts < 20);

    usedDescs.add(desc);

    const { error } = await supabase.from('products')
      .update({ description: desc })
      .eq('id', p.id);

    if (error) {
      console.log(`Error updating ${p.name}: ${error.message}`);
    } else {
      console.log(`${p.name}: ${desc}`);
      count++;
    }
  }

  console.log(`\nDone! Updated ${count} descriptions.`);
}

run();
