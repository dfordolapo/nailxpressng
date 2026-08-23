const fs = require('fs');
const path = require('path');

const handmadeDir = path.join(__dirname, 'public/images/Handmade');
const productsFile = path.join(__dirname, 'src/data/products.js');

let productsContent = fs.readFileSync(productsFile, 'utf8');

const regex = /\n];\r?\n\r?\nexport function/;

if (!regex.test(productsContent)) {
  console.error("Could not find the end of products array");
  process.exit(1);
}

const files = fs.readdirSync(handmadeDir).filter(f => f.match(/\.(jpg|jpeg|png|heic|webp)$/i));

const adjectives = ["Elegant", "Midnight", "Velvet", "Sparkle", "Glamour", "Mystic", "Radiant", "Luxe", "Classic", "Chic", "Bold", "Soft", "Dreamy", "Vibrant", "Subtle", "Fierce", "Glazed", "Matte", "Glossy"];
const nouns = ["Bloom", "Aura", "Glow", "Vibe", "Charm", "Gem", "Crystal", "Rose", "Pearl", "Onyx", "Quartz", "Petal", "Dawn", "Dusk", "Eclipse", "Halo"];
const shapes = ["almond", "square", "coffin", "stiletto", "oval", "squoval"];
const colors = ["pink", "black", "white", "red", "nude", "blue", "green", "gold", "silver", "purple"];

let maxId = 53;
const idMatches = [...productsContent.matchAll(/"id":\s*(\d+)/g)];
if (idMatches.length > 0) {
  maxId = Math.max(...idMatches.map(m => parseInt(m[1])));
}

const newProducts = [];
let currentId = maxId + 1;

for (const file of files) {
  const name = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const price = 7500 + Math.floor(Math.random() * 8) * 1000;
  
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const c1 = colors[Math.floor(Math.random() * colors.length)];
  const c2 = colors[Math.floor(Math.random() * colors.length)];
  const prodColors = [...new Set([c1, c2])];

  const product = {
    id: currentId++,
    slug: slug + '-' + currentId,
    name: name,
    price: price,
    compareAtPrice: price + 2000,
    description: "A stunning custom handmade set named " + name + ". Crafted with precision and intricate artistry to give your nails a perfect, salon-quality finish.",
    shortDescription: "Beautiful handcrafted press-on nails",
    images: ["/images/Handmade/" + file],
    category: "handmade",
    nailShape: shape,
    style: "custom",
    colors: prodColors,
    lengths: ["Short", "Medium", "Long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    stockCount: 1,
    newArrival: Math.random() > 0.7,
    bestseller: Math.random() > 0.8
  };

  newProducts.push(product);
}

let newProductsStr = '';
for (const p of newProducts) {
  newProductsStr += ',\n  ' + JSON.stringify(p, null, 4).replace(/\n/g, '\n  ');
}

productsContent = productsContent.replace(regex, newProductsStr + '\n];\n\nexport function');
fs.writeFileSync(productsFile, productsContent);

console.log(`Successfully added ${newProducts.length} handmade products!`);
