import { createClient } from '@supabase/supabase-js';
import CustomOrdersClient from './CustomOrdersClient';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function AdminCustomOrdersPage() {
  const { data: customOrders, error } = await supabaseAdmin
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom orders:', error);
  }

  return <CustomOrdersClient initialOrders={customOrders || []} />;
}

