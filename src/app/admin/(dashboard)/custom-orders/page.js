import { supabaseAdmin } from '@/lib/supabaseAdmin';
import CustomOrdersClient from './CustomOrdersClient';
import { FALLBACK_CUSTOM_ORDERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export default async function AdminCustomOrdersPage() {
  const { data: customOrders, error } = await supabaseAdmin
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.warn('Supabase custom orders fetch failed, using fallback for local dev');
  }

  const list = customOrders && customOrders.length > 0 ? customOrders : FALLBACK_CUSTOM_ORDERS;

  return <CustomOrdersClient initialOrders={list} />;
}

