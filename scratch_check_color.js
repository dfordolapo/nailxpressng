const url = "https://ukfwpourkksctwmdgrci.supabase.co/rest/v1/products?select=id,name,color&limit=1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZndwb3Vya2tzY3R3bWRncmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTA3NjEsImV4cCI6MjA5OTcyNjc2MX0.AHjuszOA09bqiMPyAmymVer5RXrjiLfbqHkttuDMIRM";

fetch(url, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`
  }
})
.then(res => res.json())
.then(data => {
  console.log(JSON.stringify(data, null, 2));
})
.catch(err => console.error(err));
