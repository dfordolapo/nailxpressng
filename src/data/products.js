export const products = [
  // ── HANDMADE NAILS ──────────────────────────────────────────────
  {
    id: 1,
    slug: "midnight-bloom",
    name: "Midnight Bloom",
    price: 15000,
    compareAtPrice: 18000,
    description: "Hand-painted floral art on a deep midnight base. Each set is uniquely crafted with delicate petal details and gold leaf accents.",
    shortDescription: "Hand-painted florals with gold leaf accents",
    images: ["/images/products/midnight-bloom-1.jpg", "/images/products/midnight-bloom-2.jpg", "/images/products/midnight-bloom-3.jpg"],
    category: "handmade",
    nailShape: "almond",
    style: "floral",
    colors: ["black", "gold", "pink"],
    lengths: ["short", "medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 124,
    tags: ["floral", "gold", "luxury", "handpainted"],
    createdAt: "2026-06-01",
  },
  {
    id: 2,
    slug: "rose-quartz-aura",
    name: "Rose Quartz Aura",
    price: 12500,
    compareAtPrice: null,
    description: "Inspired by healing crystals. Soft pink translucent base with embedded shimmer particles that catch light from every angle.",
    shortDescription: "Crystal-inspired pink shimmer set",
    images: ["/images/products/rose-quartz-1.jpg", "/images/products/rose-quartz-2.jpg"],
    category: "handmade",
    nailShape: "coffin",
    style: "minimalist",
    colors: ["pink", "rose gold"],
    lengths: ["medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.9,
    reviewCount: 87,
    tags: ["crystal", "shimmer", "pink", "elegant"],
    createdAt: "2026-06-15",
  },
  {
    id: 3,
    slug: "velvet-noir",
    name: "Velvet Noir",
    price: 14000,
    compareAtPrice: 16500,
    description: "Matte black velvet finish with hand-drawn geometric gold lines. Understated luxury for the bold and sophisticated.",
    shortDescription: "Matte black with geometric gold lines",
    images: ["/images/products/velvet-noir-1.jpg", "/images/products/velvet-noir-2.jpg"],
    category: "handmade",
    nailShape: "stiletto",
    style: "geometric",
    colors: ["black", "gold"],
    lengths: ["medium", "long", "extra long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.7,
    reviewCount: 203,
    tags: ["matte", "geometric", "luxury", "bold"],
    createdAt: "2026-05-20",
  },
  {
    id: 4,
    slug: "pearl-cascade",
    name: "Pearl Cascade",
    price: 16500,
    compareAtPrice: null,
    description: "Genuine micro-pearl embellishments on a creamy ivory base. Each nail features a cascading pearl arrangement for bridal perfection.",
    shortDescription: "Micro-pearl embellished bridal set",
    images: ["/images/products/pearl-cascade-1.jpg", "/images/products/pearl-cascade-2.jpg"],
    category: "handmade",
    nailShape: "oval",
    style: "bridal",
    colors: ["white", "ivory", "pearl"],
    lengths: ["short", "medium"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 5.0,
    reviewCount: 56,
    tags: ["bridal", "pearl", "elegant", "wedding"],
    createdAt: "2026-06-20",
  },
  {
    id: 5,
    slug: "sunset-ombre",
    name: "Sunset Ombré",
    price: 13500,
    compareAtPrice: null,
    description: "A stunning hand-blended gradient from warm coral to deep mauve, capturing golden hour in every gesture.",
    shortDescription: "Warm coral to mauve gradient",
    images: ["/images/products/sunset-ombre-1.jpg", "/images/products/sunset-ombre-2.jpg"],
    category: "handmade",
    nailShape: "almond",
    style: "ombre",
    colors: ["coral", "mauve", "orange"],
    lengths: ["short", "medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 42,
    tags: ["ombre", "gradient", "warm", "summer"],
    createdAt: "2026-06-25",
  },
  {
    id: 6,
    slug: "enchanted-garden",
    name: "Enchanted Garden",
    price: 17000,
    compareAtPrice: 20000,
    description: "Miniature hand-painted garden scenes with tiny butterflies, ladybugs, and flowers. Wearable art at its finest.",
    shortDescription: "Miniature painted garden scenes",
    images: ["/images/products/enchanted-garden-1.jpg", "/images/products/enchanted-garden-2.jpg"],
    category: "handmade",
    nailShape: "coffin",
    style: "art",
    colors: ["green", "pink", "yellow", "blue"],
    lengths: ["medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: false,
    rating: 4.9,
    reviewCount: 91,
    tags: ["art", "nature", "handpainted", "detailed"],
    createdAt: "2026-05-10",
  },

  // ── FACTORY-MADE NAILS ──────────────────────────────────────────
  {
    id: 7,
    slug: "classic-french-tip",
    name: "Classic French Tip",
    price: 5500,
    compareAtPrice: null,
    description: "Timeless French tip design with a clean white edge and natural pink base. Perfect for everyday elegance.",
    shortDescription: "Timeless white-tip french manicure",
    images: ["/images/products/french-tip-1.jpg", "/images/products/french-tip-2.jpg"],
    category: "factory",
    nailShape: "square",
    style: "french",
    colors: ["white", "pink"],
    lengths: ["short", "medium"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 412,
    tags: ["french", "classic", "everyday", "office"],
    createdAt: "2026-04-01",
  },
  {
    id: 8,
    slug: "cherry-glaze",
    name: "Cherry Glaze",
    price: 4800,
    compareAtPrice: 6000,
    description: "Glossy cherry red with a mirror-like finish. Bold, confident, and always in style.",
    shortDescription: "Glossy cherry red mirror finish",
    images: ["/images/products/cherry-glaze-1.jpg", "/images/products/cherry-glaze-2.jpg"],
    category: "factory",
    nailShape: "oval",
    style: "solid",
    colors: ["red"],
    lengths: ["short", "medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.4,
    reviewCount: 289,
    tags: ["red", "glossy", "bold", "classic"],
    createdAt: "2026-04-15",
  },
  {
    id: 9,
    slug: "nude-silk",
    name: "Nude Silk",
    price: 4500,
    compareAtPrice: null,
    description: "Sheer nude with a silky smooth finish. The most natural-looking press-ons for a polished, no-fuss look.",
    shortDescription: "Sheer nude silky smooth finish",
    images: ["/images/products/nude-silk-1.jpg", "/images/products/nude-silk-2.jpg"],
    category: "factory",
    nailShape: "oval",
    style: "nude",
    colors: ["nude", "beige"],
    lengths: ["short", "medium"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 356,
    tags: ["nude", "natural", "everyday", "minimal"],
    createdAt: "2026-03-20",
  },
  {
    id: 10,
    slug: "holographic-dream",
    name: "Holographic Dream",
    price: 6500,
    compareAtPrice: null,
    description: "Prismatic holographic finish that shifts colors with every movement. Turn heads wherever you go.",
    shortDescription: "Color-shifting prismatic holographic",
    images: ["/images/products/holo-dream-1.jpg", "/images/products/holo-dream-2.jpg"],
    category: "factory",
    nailShape: "coffin",
    style: "holographic",
    colors: ["holographic", "silver", "rainbow"],
    lengths: ["medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 167,
    tags: ["holographic", "prismatic", "party", "statement"],
    createdAt: "2026-06-10",
  },
  {
    id: 11,
    slug: "marble-luxe",
    name: "Marble Luxe",
    price: 5800,
    compareAtPrice: 7000,
    description: "White marble-effect with fine gold veining. Luxurious and sophisticated for any occasion.",
    shortDescription: "White marble with gold veining",
    images: ["/images/products/marble-luxe-1.jpg", "/images/products/marble-luxe-2.jpg"],
    category: "factory",
    nailShape: "almond",
    style: "marble",
    colors: ["white", "gold", "grey"],
    lengths: ["short", "medium", "long"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 98,
    tags: ["marble", "gold", "luxe", "sophisticated"],
    createdAt: "2026-06-18",
  },
  {
    id: 12,
    slug: "candy-pop",
    name: "Candy Pop",
    price: 4200,
    compareAtPrice: null,
    description: "Fun pastel multi-color set with a glossy finish. Each nail is a different candy-inspired pastel shade.",
    shortDescription: "Multi-color pastel candy shades",
    images: ["/images/products/candy-pop-1.jpg", "/images/products/candy-pop-2.jpg"],
    category: "factory",
    nailShape: "square",
    style: "pastel",
    colors: ["pink", "blue", "yellow", "lavender", "mint"],
    lengths: ["short", "medium"],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: false,
    bestseller: false,
    newArrival: false,
    rating: 4.3,
    reviewCount: 134,
    tags: ["pastel", "colorful", "fun", "summer"],
    createdAt: "2026-05-05",
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getBestsellers() {
  return products.filter((p) => p.bestseller);
}

export function getNewArrivals() {
  return products.filter((p) => p.newArrival);
}

export function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.style.toLowerCase().includes(q) ||
      p.colors.some((c) => c.includes(q))
  );
}

export function filterProducts(productList, filters) {
  let filtered = [...productList];

  if (filters.nailShape && filters.nailShape.length > 0) {
    filtered = filtered.filter((p) => filters.nailShape.includes(p.nailShape));
  }

  if (filters.style && filters.style.length > 0) {
    filtered = filtered.filter((p) => filters.style.includes(p.style));
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter((p) => p.price >= min && p.price <= max);
  }

  if (filters.length && filters.length.length > 0) {
    filtered = filtered.filter((p) =>
      p.lengths.some((l) => filters.length.includes(l))
    );
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }

  return filtered;
}

export function sortProducts(productList, sortBy) {
  const sorted = [...productList];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
}
