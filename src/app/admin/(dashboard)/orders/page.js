import { createClient } from '@supabase/supabase-js';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders | Admin Dashboard',
};

// Initialize Supabase with service role key for admin pages
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function OrdersPage() {
  // Fetch all orders
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return <OrdersClient initialOrders={orders || []} />;
}
