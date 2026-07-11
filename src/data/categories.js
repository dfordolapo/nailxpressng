export const categories = [
  {
    id: "handmade",
    name: "Handmade",
    slug: "handmade",
    description: "Made by hand, made for you with meticulous attention to detail.",
    image: "/images/handmade-collection.png",
    tagline: "wearable art, made by hand",
  },
  {
    id: "factory",
    name: "Factory Made",
    slug: "factory",
    description: "Instant favorites for everyday glam, last-minute plans and everything in between.",
    image: "/images/factory-collection.png",
    tagline: "ready to wear",
  },
];

export const nailShapes = [
  { id: "almond", name: "Almond", icon: "💅" },
  { id: "coffin", name: "Coffin", icon: "💅" },
  { id: "stiletto", name: "Stiletto", icon: "💅" },
  { id: "oval", name: "Oval", icon: "💅" },
  { id: "square", name: "Square", icon: "💅" },
  { id: "round", name: "Round", icon: "💅" },
  { id: "ballerina", name: "Ballerina", icon: "💅" },
];

export const nailLengths = [
  { id: "short", name: "Short", description: "Subtle and practical" },
  { id: "medium", name: "Medium", description: "Classic and versatile" },
  { id: "long", name: "Long", description: "Bold and glamorous" },
  { id: "extra long", name: "Extra Long", description: "Maximum drama" },
];

export const styles = [
  { id: "floral", name: "Floral" },
  { id: "minimalist", name: "Minimalist" },
  { id: "geometric", name: "Geometric" },
  { id: "bridal", name: "Bridal" },
  { id: "ombre", name: "Ombré" },
  { id: "art", name: "Nail Art" },
  { id: "french", name: "French" },
  { id: "solid", name: "Solid Color" },
  { id: "nude", name: "Nude" },
  { id: "holographic", name: "Holographic" },
  { id: "marble", name: "Marble" },
  { id: "pastel", name: "Pastel" },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}
