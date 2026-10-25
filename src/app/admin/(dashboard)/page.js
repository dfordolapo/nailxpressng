import DashboardClient from './DashboardClient';
import { getAdminProducts } from '@/lib/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { FALLBACK_ORDERS, FALLBACK_CUSTOM_ORDERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | NailExpress',
};

export default async function AdminDashboardPage() {
  const [products, ordersRes, customOrdersRes] = await Promise.all([
    getAdminProducts(),
    supabaseAdmin.from('orders').select('id, status, total_amount, created_at').order('created_at', { ascending: false }).limit(200),
    supabaseAdmin.from('custom_orders').select('id, status').order('created_at', { ascending: false }).limit(200)
  ]);

  const orders = ordersRes.data && ordersRes.data.length > 0 ? ordersRes.data : FALLBACK_ORDERS;
  const customOrders = customOrdersRes.data && customOrdersRes.data.length > 0 ? customOrdersRes.data : FALLBACK_CUSTOM_ORDERS;
  
  return (
    <DashboardClient 
      initialProducts={products || []} 
      initialOrders={orders}
      initialCustomOrders={customOrders}
    />
  );
}

