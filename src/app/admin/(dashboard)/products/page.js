import ProductsClient from './ProductsClient';
import { getProducts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products | Admin Dashboard',
};

export default async function AdminProductsPage() {
  const products = await getProducts();
  
  return <ProductsClient initialProducts={products} />;
}
