import DashboardClient from './DashboardClient';
import { getProducts } from '@/lib/api';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | NailExpress',
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function AdminDashboardPage() {
  const [products, ordersRes, customOrdersRes] = await Promise.all([
    getProducts(),
    supabaseAdmin.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
    supabaseAdmin.from('custom_orders').select('*').order('created_at', { ascending: false })
  ]);
  
  return (
    <DashboardClient 
      initialProducts={products || []} 
      initialOrders={ordersRes.data || []}
      initialCustomOrders={customOrdersRes.data || []}
    />
  );
}

