const { createClient } = require('@supabase/supabase-js');

// Map of names to detailed descriptions
const customDescriptions = {
  "Sparkle Charm": "Dazzling champagne glitter base embellished with playful silver charms and delicate 3D ornamental touches.",
  "Regal Ridge": "Sophisticated deep burgundy matte base featuring clean, elevated geometric lines in brilliant gold.",
  "Regal Coral": "Vibrant sun-warmed coral pink base adorned with majestic ornate gold detailing and subtle rhinestones.",
  "Opal Prism": "Milky iridescent semi-translucent base featuring light-refracting holographic foil fragments and a high-gloss finish.",
  "Moonlit Ridge": "Cool-toned pale silver glow base with structured linear metallic detailing mimicking moonlit textures.",
  "Glossy Gem": "Sleek, highly reflective jet-black surface elevated by rich emerald jewel-toned accents and a flawless glossy finish.",
  "Bold Eclipse": "Striking half-and-half contrast design featuring a matte black and glossy white split with bold shadow-play accents.",
  "Radiant Rose": "Soft rosy blush ombré base seamlessly transitioning to milky white, finished with a warm radiant shimmer.",
  "Bold Pearl": "Unapologetic sheer white base featuring an array of 3D pearlescent white accents and tiny silver micro-beads.",
  "Regal Prism": "Royal-inspired deep violet jelly base featuring spectrum-rich holographic flakes and elegant gold framing.",
  "Glamour Petal": "Soft botanical pink base with glamorous cascading rhinestone accents and delicate hand-painted petal art.",
  "Dreamy Dusk": "Romantic gradient blending soft lavender and dusky sunset orange, finished with subtle gold foil flakes.",
  "Opal Mist": "Hazy, semi-sheer milky white base with dreamy blue opal undertones and a delicate, fog-like aura effect.",
  "Radiant Crystal": "Soft radiant champagne shimmer base heavily encrusted with prismatic crystal detailing and micro-diamonds.",
  "Radiant Dusk": "Warm golden-hour amber jelly base featuring a radiant metallic bronze finish and subtle sun-kissed glimmers.",
  "Vibrant Onyx": "Rich, saturated neon pink base starkly contrasted by sleek jet-black tribal-inspired accent lines.",
  "Fierce Eclipse": "Dramatic deep crimson base with bold, eclipse-inspired black airbrushed gradients and a velvet matte finish.",
  "Iridescent Vale": "Sheer jelly base with stunning rainbow sheen accents, holographic chrome powder, and unique hand-painted details.",
  "Regal Mist": "Translucent misty grey base elevated by regal ornate silver detailing and a hazy, soft-focus finish.",
  "Crystalline Mirage": "Ice-like crystalline sheer base featuring an illusion-like depth created with layered mylar flakes and clear 3D gel droplets.",
  "Glossy Petal": "Mirror-like glossy sheer pink base with delicate, incredibly detailed hand-painted cherry blossom petals.",
  "Subtle Onyx": "Soft, muted taupe base featuring sleek, minimalist jet-black abstract lines and a flawless matte finish.",
  "Golden Blaze": "Rich golden metallic chrome base featuring blazing warm amber tones and fiery abstract line art.",
  "Gilded Cove": "Serene ocean-blue marble base highlighted by warm, elegant gold-toned foil veins and a high-gloss topcoat.",
  "Midnight Vibe": "Rich nocturnal navy blue jelly base infused with deep purple galaxy-inspired swirls and scattered silver glitter.",
  "Vibrant Aura": "Bright, energetic neon green and yellow aura gradient with an ethereal glowing effect and a sleek glossy finish.",
  "Luxe Vibe": "Indulgent tortoiseshell design in a mood-setting rich brown and black palette, finished with subtle gold leaf.",
  "Regal Fern": "Majestic rich emerald green base with earthy botanical fern accents delicately hand-painted in metallic gold.",
  "Sterling Iris": "Vibrant violet jelly base featuring refined sterling silver chrome highlights and a smooth, liquid-metal finish.",
  "Dreamy Aura": "Soft, romantic pastel pink and baby blue aura airbrush design with an ethereal glowing effect and scattered star decals.",
  "Mystic Aura": "Captivating dark plum base featuring a luminous magenta halo finish and subtle iridescent micro-shimmer.",
  "Glamour Bloom": "Elegant nude base with glamorous rhinestone accents and intricate, full-nail floral-inspired artistry.",
  "Ocean Bloom": "Beautifully crafted turquoise gradient base featuring fresh, white 3D garden-bloom floral embellishments."
};

const priceMap = {
  "Short": 10000,
  "Medium": 12000,
  "Long": 15000,
  "Extra Long": 20000
};

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'handmade').single();
  const { data: products } = await supabase.from('products').select('*').eq('category_id', cat.id);
  
  console.log(`Found ${products.length} handmade products to update.`);
  let count = 0;

  for (const product of products) {
    const newDescription = customDescriptions[product.name] || product.description;
    
    // Determine the price based on the first length in the array
    let newPrice = product.price;
    if (product.lengths && product.lengths.length > 0) {
      const length = product.lengths[0];
      if (priceMap[length]) {
        newPrice = priceMap[length];
      }
    }

    const { error } = await supabase.from('products')
      .update({ 
        description: newDescription,
        price: newPrice
      })
      .eq('id', product.id);

    if (error) {
      console.error(`Error updating ${product.name}:`, error.message);
    } else {
      console.log(`Updated ${product.name} - Price: ${newPrice}, Lengths: [${product.lengths ? product.lengths.join(', ') : ''}]`);
      count++;
    }
  }

  console.log(`Successfully updated ${count} handmade products.`);
}

run();
