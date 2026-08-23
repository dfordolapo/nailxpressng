const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');
const { createClient } = require('@supabase/supabase-js');

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
const productsFile = path.join(__dirname, 'src/data/products.js');

async function run() {
  const files = fs.readdirSync(handmadeDir).filter(f => f.match(/\.heic$/i));
  console.log(`Found ${files.length} HEIC files to convert.`);

  for (const file of files) {
    const inputPath = path.join(handmadeDir, file);
    const outputPath = path.join(handmadeDir, file.replace(/\.heic$/i, '.jpg'));
    
    console.log(`Converting ${file}...`);
    try {
      const inputBuffer = fs.readFileSync(inputPath);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.8
      });
      fs.writeFileSync(outputPath, outputBuffer);
      fs.unlinkSync(inputPath);
      console.log(`Converted and deleted ${file}`);
    } catch (e) {
      console.error(`Failed to convert ${file}:`, e);
    }
  }

  // Update Supabase
  console.log('Updating Supabase...');
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products from supabase', error);
  } else {
    for (const p of products) {
      if (p.images && p.images.length > 0) {
        let changed = false;
        const newImages = p.images.map(img => {
          if (img.toLowerCase().endsWith('.heic')) {
            changed = true;
            return img.replace(/\.heic$/i, '.jpg');
          }
          return img;
        });
        if (changed) {
          await supabase.from('products').update({ images: newImages }).eq('id', p.id);
        }
      }
    }
    console.log('Supabase updated successfully!');
  }

  // Update products.js
  let content = fs.readFileSync(productsFile, 'utf8');
  content = content.replace(/\.HEIC/g, '.jpg').replace(/\.heic/g, '.jpg');
  fs.writeFileSync(productsFile, content);
  console.log('Updated src/data/products.js');
}

run();
