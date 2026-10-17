const DEFAULT_COLLECTIONS = [
  {
    id: "handmade",
    name: "Handmade",
    slug: "handmade",
    description: "Wearable art, made by hand with salon-grade strength.",
    tagline: "wearable art, made by hand",
    image: "/images/handmade-collection.png",
    is_published: true,
    display_order: 1,
    products_count: 7,
    created_at: new Date().toISOString()
  },
  {
    id: "factory",
    name: "Factory Made",
    slug: "factory",
    description: "Press-on precision, instant favorites ready to wear.",
    tagline: "press-on precision • ready to wear",
    image: "/images/factory-collection.png",
    is_published: true,
    display_order: 2,
    products_count: 7,
    created_at: new Date().toISOString()
  }
];

export function getLocalCollections() {
  if (typeof window !== 'undefined') {
    return DEFAULT_COLLECTIONS;
  }
  try {
    const fs = eval("require")('fs');
    const path = eval("require")('path');
    const STORE_PATH = path.join(process.cwd(), 'scratch', 'local_collections.json');
    if (!fs.existsSync(STORE_PATH)) {
      fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_COLLECTIONS, null, 2));
      return DEFAULT_COLLECTIONS;
    }
    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : DEFAULT_COLLECTIONS;
  } catch (err) {
    console.error('Error reading local collections store:', err);
    return DEFAULT_COLLECTIONS;
  }
}

export function saveLocalCollections(collections) {
  if (typeof window !== 'undefined') return false;
  try {
    const fs = eval("require")('fs');
    const path = eval("require")('path');
    const STORE_PATH = path.join(process.cwd(), 'scratch', 'local_collections.json');
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(collections, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving local collections store:', err);
    return false;
  }
}

export function addLocalCollection(collection) {
  const current = getLocalCollections();
  const exists = current.some(c => c.slug === collection.slug || c.id === collection.id);
  if (exists) {
    throw new Error(`A collection with slug "${collection.slug}" already exists.`);
  }
  const newCol = {
    id: collection.id || `col-${Date.now()}`,
    name: collection.name,
    slug: collection.slug,
    description: collection.description || null,
    tagline: collection.tagline || null,
    image: collection.image || null,
    is_published: collection.is_published !== false,
    display_order: collection.display_order ?? current.length + 1,
    products_count: 0,
    created_at: new Date().toISOString()
  };
  current.push(newCol);
  saveLocalCollections(current);
  return newCol;
}

export function updateLocalCollection(id, updates) {
  const current = getLocalCollections();
  const index = current.findIndex(c => c.id === id || c.slug === id);
  if (index === -1) {
    throw new Error('Collection not found');
  }
  const updated = {
    ...current[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  current[index] = updated;
  saveLocalCollections(current);
  return updated;
}

export function deleteLocalCollection(id) {
  const current = getLocalCollections();
  const target = current.find(c => c.id === id || c.slug === id);
  if (!target) return true;
  const filtered = current.filter(c => c.id !== id && c.slug !== id);
  saveLocalCollections(filtered);
  return true;
}
