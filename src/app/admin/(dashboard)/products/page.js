import ProductsClient from './ProductsClient';
import { getAdminProducts, getAdminCollections } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products | Admin Dashboard',
};

export default async function AdminProductsPage() {
  const [products, collections] = await Promise.all([
    getAdminProducts(),
    getAdminCollections(),
  ]);
  
  return <ProductsClient initialProducts={products} initialCollections={collections} />;
}
