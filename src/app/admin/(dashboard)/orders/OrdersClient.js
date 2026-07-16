"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import styles from "@/styles/admin.module.css";
import { MoreVertical, CheckCircle } from "lucide-react";

export default function OrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const markAsDone = async (id) => {
    setIsUpdating(true);
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' })
      });
      if (!res.ok) throw new Error("Failed to update order");
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: 'delivered' } : order
      ));
    } catch (err) {
      console.error(err);
      alert("Error marking order as done.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSubtitle}>Manage customer orders and track fulfillment.</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>📦</div>
                  <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>No orders yet</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>When customers place orders, they will appear here.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                    #{order.id.split('-')[0]}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.customer_first_name} {order.customer_last_name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>{order.customer_email}</div>
                  </td>
                  <td>
                    {order.order_items?.length || 0} items
                    <div style={{ fontSize: "0.75rem", color: "#666", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.order_items?.map(i => i.product_name).join(", ")}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{formatPrice(order.total_amount)}</td>
                  <td>
                    <span className={`${styles.badge} ${order.status === 'delivered' ? styles.inStock : (order.status === 'pending' ? styles.outOfStock : '')}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ color: "#666" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "right", position: "relative" }}>
                    <button 
                      onClick={() => handleMenuClick(order.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "4px" }}
                      disabled={isUpdating}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === order.id && (
                      <div className={styles.kebabMenu}>
                        <button 
                          className={styles.kebabItem} 
                          onClick={() => markAsDone(order.id)}
                          style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          <CheckCircle size={14} /> Mark as Delivered
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
