import DashboardClient from './DashboardClient';
import { getProducts } from '@/lib/api';

export const metadata = {
  title: 'Admin Dashboard | NailExpress',
};

export default async function AdminDashboardPage() {
  const products = await getProducts();
  
  return <DashboardClient initialProducts={products} />;
}
