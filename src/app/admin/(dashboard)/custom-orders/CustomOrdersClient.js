"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import styles from "@/styles/admin.module.css";
import { MoreVertical, CheckCircle, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function CustomOrdersClient({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching custom orders:", err);
    }
  };

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const markAsDone = async (id) => {
    setIsUpdating(true);
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: 'completed' } : order
      ));
    } catch (err) {
      console.error(err);
      alert("Error marking order as done.");
    } finally {
      setIsUpdating(false);
    }
  };

  const contactCustomer = (order) => {
    setOpenMenuId(null);
    if (order.customer_phone) {
      // Use WhatsApp
      const message = `Hi ${order.customer_name}, I'm reaching out regarding your custom nail order on Nailexpress!`;
      window.open(`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      // Use Email
      window.open(`mailto:${order.customer_email}?subject=Your Custom Order - Nailexpress`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        Loading custom orders...
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Custom Orders</h1>
          <p className={styles.pageSubtitle}>Manage and review personalized nail set requests.</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Design Details</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>💅</div>
                  <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>No custom orders yet</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>When customers request custom designs, they will appear here.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                    #{order.id.split('-')[0]}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>{order.customer_email}</div>
                    {order.customer_phone && <div style={{ fontSize: "0.75rem", color: "#666" }}>{order.customer_phone}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.shape} / {order.length} / {order.design}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Color: {order.color_preference || 'N/A'} | Notes: {order.notes || 'None'}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${order.status === 'completed' ? styles.inStock : (order.status === 'pending' ? styles.outOfStock : '')}`}>
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
                      <div className={styles.kebabMenu} style={{ right: 0, zIndex: 10 }}>
                        <button 
                          className={styles.kebabItem} 
                          onClick={() => { setViewOrder(order); setOpenMenuId(null); }}
                        >
                          View Details
                        </button>
                        <button 
                          className={styles.kebabItem} 
                          onClick={() => contactCustomer(order)}
                          style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          <MessageCircle size={14} /> Contact Customer
                        </button>
                        <button 
                          className={styles.kebabItem} 
                          onClick={() => markAsDone(order.id)}
                          style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          <CheckCircle size={14} /> Mark as Completed
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

      {/* View Order Modal */}
      {viewOrder && (
        <div className={styles.modalOverlay} onClick={() => setViewOrder(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "600px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)", borderBottom: "1px solid #eee", paddingBottom: "var(--space-3)" }}>
              <h3 className={styles.modalTitle} style={{ margin: 0 }}>Custom Order #{viewOrder.id.split('-')[0]}</h3>
              <button onClick={() => setViewOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#666" }}>✕</button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <div>
                <h4 style={{ fontSize: "0.875rem", color: "#666", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer Details</h4>
                <p style={{ fontWeight: 500, margin: "0 0 4px 0" }}>{viewOrder.customer_name}</p>
                <p style={{ margin: "0 0 4px 0", color: "#444" }}>{viewOrder.customer_email}</p>
                <p style={{ margin: "0", color: "#444" }}>{viewOrder.customer_phone || 'No phone provided'}</p>
              </div>
              <div>
                <h4 style={{ fontSize: "0.875rem", color: "#666", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</h4>
                <span className={`${styles.badge} ${viewOrder.status === 'completed' ? styles.inStock : styles.outOfStock}`}>
                  {viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1)}
                </span>
                <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "8px" }}>
                  Requested on {new Date(viewOrder.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.875rem", color: "#666", marginBottom: "var(--space-3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Design Request</h4>
              <div style={{ background: "#f9f9f9", borderRadius: "8px", padding: "var(--space-4)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#666" }}>Shape:</span>
                  <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{viewOrder.shape}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#666" }}>Length:</span>
                  <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{viewOrder.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#666" }}>Design Style:</span>
                  <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{viewOrder.design}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #eaeaea" }}>
                  <span style={{ color: "#666" }}>Color Pref:</span>
                  <span style={{ fontWeight: 500 }}>{viewOrder.color_preference || "Not specified"}</span>
                </div>
                <div>
                  <span style={{ color: "#666", display: "block", marginBottom: "8px" }}>Notes / Instructions:</span>
                  <p style={{ margin: 0, color: "#333", whiteSpace: "pre-wrap", background: "white", padding: "12px", border: "1px solid #eaeaea", borderRadius: "4px" }}>
                    {viewOrder.notes || "None provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.modalActions} style={{ marginTop: "var(--space-6)" }}>
              <button 
                className={`${styles.btnOutline}`} 
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => contactCustomer(viewOrder)}
              >
                Contact Customer
              </button>
              {viewOrder.status !== 'completed' && (
                <button 
                  className={styles.btnPrimary} 
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => { markAsDone(viewOrder.id); setViewOrder(null); }}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
