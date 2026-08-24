import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getFeaturedProducts } from '@/lib/api';
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
        delivery: params?.delivery || order.delivery_time || '3-5 days'
      };
    }
  }

  // No valid order found (e.g. direct navigation) — show a clear state instead of fake data
  if (!orderData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤔</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>No Order Found</h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem", maxWidth: "400px" }}>
          We couldn't find an order to confirm. If you just placed one, check your email for the confirmation link, or head back to the shop.
        </p>
        <Link
          href="/shop"
          style={{ background: "var(--color-primary)", color: "white", padding: "12px 32px", borderRadius: "30px", textDecoration: "none", fontWeight: 600 }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  let recommendedProducts = [];
  if (orderData) {
    const featured = await getFeaturedProducts();
    if (featured && featured.length > 0) {
      recommendedProducts = featured.slice(0, 4);
    }
  }

  return <SuccessClient orderDetails={orderData} recommendedProducts={recommendedProducts} />;
}
