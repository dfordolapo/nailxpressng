const url = "https://ukfwpourkksctwmdgrci.supabase.co/rest/v1/products";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZndwb3Vya2tzY3R3bWRncmNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE1MDc2MSwiZXhwIjoyMDk5NzI2NzYxfQ._LpoXALdQ_eWEtIMoCGuwjLLI--1l94LF28pEFVke1o";

async function run() {
  const res = await fetch(`${url}?select=id,name,nail_shape`, { 
    headers: { apikey: key, Authorization: `Bearer ${key}` } 
  });
  const products = await res.json();

  for (const p of products) {
    const name = p.name.toLowerCase();
    let color = null;
    let shape = null;

    // Infer color
    if (name.match(/rouge|cherry|crimson|maroon|burgundy|red/)) color = 'Red';
    else if (name.match(/blush|rose|pink|magenta|fuchsia/)) color = 'Pink';
    else if (name.match(/nude|latte|mocha|brown|tortoise|glaze/)) color = 'Brown';
    else if (name.match(/emerald|olive|forest|green/)) color = 'Green';
    else if (name.match(/ocean|navy|blue|sapphire/)) color = 'Blue';
    else if (name.match(/onyx|noir|black|midnight|gothic/)) color = 'Black';
    else if (name.match(/pearl|white|bridal|silver|clear|ash/)) color = 'White';
    else if (name.match(/amber|gold|yellow|sunny|daisy/)) color = 'Yellow';
    else if (name.match(/violet|lavender|purple|plum/)) color = 'Purple';
    
    // Infer shape if the name explicitly states it
    if (name.match(/almond/)) shape = 'Almond';
    else if (name.match(/stiletto/)) shape = 'Stiletto';
    else if (name.match(/coffin/)) shape = 'Coffin';
    else if (name.match(/square/)) shape = 'Square';
    else if (name.match(/oval/)) shape = 'Oval';

    const updates = {};
    if (color) updates.color = color;
    if (shape && p.nail_shape !== shape.toLowerCase()) updates.nail_shape = shape.toLowerCase();

    if (Object.keys(updates).length > 0) {
      await fetch(`${url}?id=eq.${p.id}`, {
        method: 'PATCH',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      console.log(`Updated ${p.name} -> ${JSON.stringify(updates)}`);
    }
  }
  console.log("Done updating products.");
}
run();
