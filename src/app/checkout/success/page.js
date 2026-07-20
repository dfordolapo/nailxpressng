import React from 'react';
import { createClient } from '@supabase/supabase-js';
import SuccessClient from './SuccessClient';

export const dynamic = 'force-dynamic';

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.orderId;
  let orderData = null;

  if (orderId) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (order) {
      orderData = {
        orderNumber: `#NX-${order.id.split('-')[0].toUpperCase()}`,
        date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: order.order_items ? order.order_items.reduce((acc, item) => acc + item.quantity, 0).toString() : '1',
        total: `₦${order.total_amount.toLocaleString()}`,
        delivery: '3-5 days'
      };
    }
  }

  // fallback dummy data if direct navigation
  if (!orderData) {
    orderData = {
      orderNumber: '#NX-9482',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: '3',
      total: '₦45,500',
      delivery: '3-5 days'
    };
  }

  return <SuccessClient orderDetails={orderData} />;
}
