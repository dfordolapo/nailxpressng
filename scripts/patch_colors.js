const url = "https://ukfwpourkksctwmdgrci.supabase.co/rest/v1/products";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZndwb3Vya2tzY3R3bWRncmNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE1MDc2MSwiZXhwIjoyMDk5NzI2NzYxfQ._LpoXALdQ_eWEtIMoCGuwjLLI--1l94LF28pEFVke1o";

async function updateColor(namePart, newColor) {
  const res = await fetch(`${url}?name=ilike.*${namePart}*`, { 
    headers: { apikey: key, Authorization: `Bearer ${key}` } 
  });
  const products = await res.json();
  
  if (products && products.length > 0) {
    const p = products[0];
    await fetch(`${url}?id=eq.${p.id}`, {
      method: 'PATCH',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: newColor })
    });
    console.log(`Updated ${p.name} to ${newColor}`);
  } else {
    console.log(`Could not find product matching ${namePart}`);
  }
}

async function run() {
  await updateColor("Ash Glaze", "Black");
  await updateColor("Midnight Frost", "Blue");
  await updateColor("Gothic Flora", "Nude, Brown, Black");
  await updateColor("Silver Lining", "Nude");
  await updateColor("Burgundy Muse", "Nude");
  await updateColor("Maroon Marble", "Brown"); // Guessed they meant Maroon Marble
  await updateColor("Marrom Marble", "Brown"); // Just in case it's actually Marrom
}

run();
