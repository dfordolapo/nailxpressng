import { supabaseAdmin } from '@/lib/supabaseAdmin';
import OrdersClient from './OrdersClient';
import { FALLBACK_ORDERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders | Admin Dashboard',
};

export default async function OrdersPage() {
  // Fetch all orders
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase orders fetch failed, using fallback for local dev');
  }

  const list = orders && orders.length > 0 ? orders : FALLBACK_ORDERS;

  return <OrdersClient initialOrders={list} />;
}
