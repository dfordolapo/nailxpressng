import { getFeaturedProducts } from "@/data/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="section section--warm" id="featured-products">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Trending Now</h2>
          <p className="section__subtitle">
            Our most-loved sets, handpicked for you
          </p>
        </div>
        <ProductGrid products={featured} />
      </div>
    </section>
  );
}
