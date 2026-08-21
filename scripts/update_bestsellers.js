const url = "https://ukfwpourkksctwmdgrci.supabase.co/rest/v1/products";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZndwb3Vya2tzY3R3bWRncmNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE1MDc2MSwiZXhwIjoyMDk5NzI2NzYxfQ._LpoXALdQ_eWEtIMoCGuwjLLI--1l94LF28pEFVke1o";

async function setBestseller(namePart, isBestseller) {
  const res = await fetch(`${url}?name=ilike.*${namePart}*`, { 
    headers: { apikey: key, Authorization: `Bearer ${key}` } 
  });
  const products = await res.json();
  
  if (products && products.length > 0) {
    const p = products[0];
    await fetch(`${url}?id=eq.${p.id}`, {
      method: 'PATCH',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ bestseller: isBestseller })
    });
    console.log(`Updated ${p.name} bestseller status to ${isBestseller}`);
  }
}

async function run() {
  await setBestseller("Cherry Bomb", false);
  await setBestseller("Gothic Flora", true);
}

run();
