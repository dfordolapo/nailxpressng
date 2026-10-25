"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import styles from "@/styles/admin.module.css";
import ScrollableTabs from "@/components/admin/ScrollableTabs";
import { MoreVertical, CheckCircle, Truck, Sparkles, X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

export default function OrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [sendingRecoveryId, setSendingRecoveryId] = useState(null);
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState("");
  const [cancelOrder, setCancelOrder] = useState(null);

  // Prevent background scrolling when viewOrder or cancelOrder modal is open
  useLockBodyScroll(Boolean(viewOrder || cancelOrder));

  const sendRecoveryEmail = async (id) => {
    setSendingRecoveryId(id);
    try {
      const res = await fetch('/api/admin/abandoned-checkouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id })
      });
      const data = await res.json();
      if (data.success) {
        setRecoverySuccessMsg("✓ Recovery email sent to customer!");
        setTimeout(() => setRecoverySuccessMsg(""), 3500);
        setOrders(orders.map(o => o.id === id ? { ...o, cancellation_reason: 'abandoned_recovery_sent' } : o));
      } else {
        alert("Failed to send recovery email: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Error sending recovery email");
    } finally {
      setSendingRecoveryId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeStatusFilter === "all") return order.status !== "abandoned";
    return order.status === activeStatusFilter;
  });
  
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNextSteps, setCancelNextSteps] = useState("Any payments made will be fully refunded to your original payment method. Please allow a few business days for the refund to reflect in your account.");
  
  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const markAsProcessing = async (id) => {
    setIsUpdating(true);
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'processing' })
      });
      if (!res.ok) throw new Error("Failed to update order");
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: 'processing' } : order
      ));
    } catch (err) {
      console.error(err);
      alert("Error marking order as processing.");
    } finally {
      setIsUpdating(false);
    }
  };

  const markAsShipped = async (id) => {
    setIsUpdating(true);
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipped' })
      });
      if (!res.ok) throw new Error("Failed to update order");
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: 'shipped' } : order
      ));
    } catch (err) {
      console.error(err);
      alert("Error marking order as shipped.");
    } finally {
      setIsUpdating(false);
    }
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

  const submitCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${cancelOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'cancelled',
          reason: cancelReason,
          nextSteps: cancelNextSteps
        })
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      
      setOrders(orders.map(order => 
        order.id === cancelOrder.id ? { ...order, status: 'cancelled', cancellation_reason: cancelReason, cancellation_next_steps: cancelNextSteps } : order
      ));
      setCancelOrder(null);
      setCancelReason("");
    } catch (err) {
      console.error(err);
      alert("Error cancelling order.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSubtitle}>Manage orders, fulfillment & recovery.</p>
        </div>
      </div>

      {recoverySuccessMsg && (
        <div style={{ backgroundColor: "#edf7ed", color: "#1e4620", padding: "8px 12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #c8e6c9", fontSize: "0.8rem", fontWeight: 600 }}>
          {recoverySuccessMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <ScrollableTabs style={{ marginBottom: "12px" }}>
        {[
          { id: "all", label: "All Orders" },
          { id: "pending", label: "Pending" },
          { id: "processing", label: "Processing" },
          { id: "shipped", label: "Shipped" },
          { id: "delivered", label: "Delivered" },
          { id: "abandoned", label: `Abandoned (${orders.filter(o => o.status === 'abandoned').length})` },
          { id: "cancelled", label: "Cancelled" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusFilter(tab.id)}
            style={{
              padding: "5px 12px",
              borderRadius: "20px",
              border: "none",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              backgroundColor: activeStatusFilter === tab.id ? "var(--color-primary, #7a403d)" : "#f3ebea",
              color: activeStatusFilter === tab.id ? "#ffffff" : "#444",
              transition: "all 0.2s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </ScrollableTabs>

      {/* Desktop Table View */}
      <div className={styles.desktopTableOnly}>
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>📦</div>
                    <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>No orders found</h3>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>No orders match this filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                      #{order.id.split('-')[0]}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.customer_first_name} {order.customer_last_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>{order.customer_email}</div>
                    </td>
                    <td>
                      {order.order_items?.length === 1 ? "1 item" : `${order.order_items?.length || 0} items`}
                      <div style={{ fontSize: "0.75rem", color: "#666", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.order_items?.map(i => i.product_name).join(", ")}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{formatPrice(order.total_amount)}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        order.status === 'delivered' ? styles.inStock : 
                        order.status === 'shipped' ? styles.shipped : 
                        order.status === 'processing' ? styles.processing : 
                        order.status === 'cancelled' ? styles.outOfStock : styles.outOfStock
                      }`}>
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
                        aria-label="Order actions"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === order.id && (
                        <div className={styles.kebabMenu}>
                          <button 
                            className={styles.kebabItem} 
                            onClick={() => { setViewOrder(order); setOpenMenuId(null); }}
                          >
                            View Details
                          </button>
                          {order.status === 'abandoned' && (
                            <button 
                              className={styles.kebabItem} 
                              onClick={() => sendRecoveryEmail(order.id)}
                              disabled={sendingRecoveryId === order.id}
                              style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)" }}
                            >
                              <Sparkles size={14} /> {sendingRecoveryId === order.id ? "Sending..." : order.cancellation_reason === 'abandoned_recovery_sent' ? "Resend Recovery Email" : "Send Recovery Email"}
                            </button>
                          )}
                          {order.status !== 'processing' && order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'abandoned' && (
                            <button 
                              className={styles.kebabItem} 
                              onClick={() => markAsProcessing(order.id)}
                              style={{ display: "flex", alignItems: "center", gap: "6px", color: "#D97706" }}
                            >
                              <Sparkles size={14} /> Mark as Processing (Crafting)
                            </button>
                          )}
                          {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'abandoned' && (
                            <button 
                              className={styles.kebabItem} 
                              onClick={() => markAsShipped(order.id)}
                              style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2563EB" }}
                            >
                              <Truck size={14} /> Mark as Shipped
                            </button>
                          )}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'abandoned' && (
                            <>
                              <button 
                                className={styles.kebabItem} 
                                onClick={() => markAsDone(order.id)}
                                style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10B981" }}
                              >
                                <CheckCircle size={14} /> Mark as Delivered
                              </button>
                              <button 
                                className={styles.kebabItem} 
                                onClick={() => { setCancelOrder(order); setOpenMenuId(null); }}
                                style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-error)" }}
                              >
                                <span style={{ fontSize: "14px" }}>✕</span> Cancel Order
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Card View */}
      <div className={styles.mobileCardList}>
        {filteredOrders.length === 0 ? (
          <div className={styles.mobileCard} style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📦</div>
            <h3 style={{ fontSize: "1rem", color: "var(--color-primary-800)", marginBottom: "4px" }}>No orders found</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem" }}>No orders match this filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={styles.mobileCard}>
              <div className={styles.mobileCardHeader}>
                <div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-primary)" }}>
                    #{order.id.split('-')[0]}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", marginTop: "2px" }}>
                    {order.customer_first_name} {order.customer_last_name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                    {order.customer_email}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span className={`${styles.badge} ${
                    order.status === 'delivered' ? styles.inStock : 
                    order.status === 'shipped' ? styles.shipped : 
                    order.status === 'processing' ? styles.processing : 
                    order.status === 'cancelled' ? styles.outOfStock : styles.outOfStock
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#888" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.mobileCardBody}>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>Items Ordered</span>
                  <span className={styles.mobileCardValue} style={{ maxWidth: "60%" }}>
                    {order.order_items?.length === 1 ? "1 item" : `${order.order_items?.length || 0} items`}
                    <div style={{ fontSize: "0.72rem", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.order_items?.map(i => i.product_name).join(", ")}
                    </div>
                  </span>
                </div>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>Total Amount</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-primary)" }}>
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              <div className={styles.mobileCardFooter}>
                <button 
                  className={styles.btnSecondary}
                  style={{ flex: 1, padding: "7px 10px", fontSize: "0.8rem", justifyContent: "center" }}
                  onClick={() => setViewOrder(order)}
                >
                  View Details
                </button>
                {order.status === 'abandoned' && (
                  <button 
                    className={styles.btnPrimary}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "0.8rem", justifyContent: "center", gap: "4px" }}
                    onClick={() => sendRecoveryEmail(order.id)}
                    disabled={sendingRecoveryId === order.id}
                  >
                    <Sparkles size={13} /> {sendingRecoveryId === order.id ? "Sending..." : "Send Recovery"}
                  </button>
                )}
                {order.status !== 'processing' && order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'abandoned' && (
                  <button 
                    className={styles.btnPrimary}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "0.8rem", justifyContent: "center", background: "#D97706" }}
                    onClick={() => markAsProcessing(order.id)}
                  >
                    Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button 
                    className={styles.btnPrimary}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "0.8rem", justifyContent: "center", background: "#2563EB" }}
                    onClick={() => markAsShipped(order.id)}
                  >
                    Mark Shipped
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Order Modal */}
      {viewOrder && (
        <div className={styles.modalOverlay} onClick={() => setViewOrder(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "540px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 className={styles.modalTitle} style={{ margin: 0, fontSize: "1.05rem" }}>Order #{viewOrder.id.split('-')[0]}</h3>
                <span className={`${styles.badge} ${styles['badge' + viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1)]}`} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                  {viewOrder.status}
                </span>
              </div>
              <button 
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setViewOrder(null)} 
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className={styles.modalBody} style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", background: "#fcf8f8", border: "1px solid #f2e9ea", borderRadius: "10px", padding: "12px 14px" }}>
                <div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>Customer Details</span>
                  <p style={{ fontWeight: 600, margin: "0 0 2px 0", fontSize: "0.82rem", color: "#111" }}>{viewOrder.customer_first_name} {viewOrder.customer_last_name}</p>
                  <p style={{ margin: "0 0 2px 0", color: "#555", fontSize: "0.76rem", wordBreak: "break-all" }}>{viewOrder.customer_email}</p>
                  <p style={{ margin: "0", color: "#555", fontSize: "0.76rem" }}>{viewOrder.customer_phone}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>Shipping Address</span>
                  <p style={{ margin: "0 0 2px 0", color: "#333", fontSize: "0.76rem", lineHeight: 1.35 }}>{viewOrder.shipping_address}</p>
                  <p style={{ margin: "0 0 2px 0", color: "#555", fontSize: "0.76rem" }}>{viewOrder.shipping_city}, {viewOrder.shipping_state}</p>
                </div>
              </div>

              <div style={{ border: "1px solid #ebebeb", borderRadius: "10px", overflow: "hidden", background: "#fafafa" }}>
                <div style={{ padding: "8px 12px", background: "#f5f5f5", borderBottom: "1px solid #ebebeb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Items Ordered ({viewOrder.order_items?.length || 0})</span>
                </div>
                <div style={{ padding: "10px 12px", maxHeight: "28vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {viewOrder.order_items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "8px", borderBottom: idx !== viewOrder.order_items.length - 1 ? "1px solid #f0f0f0" : "none", gap: "10px" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontWeight: 600, margin: "0 0 2px 0", fontSize: "0.8rem", color: "#111", wordBreak: "break-word" }}>{item.product_name}</p>
                        <p style={{ fontSize: "0.72rem", color: "#666", margin: 0 }}>Size: {item.selected_size} • Length: {item.selected_length} • Qty: {item.quantity}</p>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "0.8rem", flexShrink: 0, color: "#111" }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fcf8f8", border: "1px solid #f2e9ea", borderRadius: "10px" }}>
                <span style={{ color: "#666", fontSize: "0.78rem", fontWeight: 500 }}>Total Paid (includes shipping):</span>
                <span style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--color-primary)" }}>{formatPrice(viewOrder.total_amount)}</span>
              </div>

              <div className={styles.modalActions} style={{ display: "flex", gap: "8px", flexDirection: "column", marginTop: "4px" }}>
                {viewOrder.status !== 'shipped' && viewOrder.status !== 'delivered' && viewOrder.status !== 'cancelled' && (
                  <button 
                    type="button"
                    className={styles.btnSecondary} 
                    style={{ width: "100%", justifyContent: "center", borderColor: "#2563EB", color: "#2563EB", display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", fontSize: "0.78rem", fontWeight: 600, borderRadius: "8px" }}
                    onClick={() => { markAsShipped(viewOrder.id); setViewOrder(null); }}
                    disabled={isUpdating}
                  >
                    <Truck size={15} /> Mark as Shipped (Dispatches Shipping Email)
                  </button>
                )}
                {viewOrder.status !== 'delivered' && viewOrder.status !== 'cancelled' && (
                  <button 
                    type="button"
                    className={styles.btnPrimary} 
                    style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", fontSize: "0.78rem", fontWeight: 600, borderRadius: "8px" }}
                    onClick={() => { markAsDone(viewOrder.id); setViewOrder(null); }}
                    disabled={isUpdating}
                  >
                    <CheckCircle size={15} /> Mark as Delivered (Dispatches Delivered Email)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelOrder && (
        <div className={styles.modalOverlay} onClick={() => setCancelOrder(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ margin: 0, fontSize: "1.15rem", color: "var(--color-error)" }}>
                Cancel Order #{cancelOrder.id.split('-')[0]}
              </h3>
              <button 
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setCancelOrder(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p style={{ color: "#555", fontSize: "0.85rem", margin: "0 0 12px 0" }}>
                Are you sure you want to cancel this order? An email will be sent to <strong>{cancelOrder.customer_email}</strong> to notify them.
              </p>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "4px" }}>
                  Reason for Cancellation <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <textarea 
                  className={styles.input}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Out of stock, Requested by customer..."
                  rows={3}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "8px", resize: "vertical", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "4px" }}>
                  Next Steps for Buyer
                </label>
                <textarea 
                  className={styles.input}
                  value={cancelNextSteps}
                  onChange={(e) => setCancelNextSteps(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "8px", resize: "vertical", fontSize: "0.85rem" }}
                />
              </div>

              <div className={styles.modalActions} style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button 
                  type="button"
                  className={styles.modalBtnCancel} 
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setCancelOrder(null)}
                >
                  Keep Order
                </button>
                <button 
                  type="button"
                  className={styles.btnPrimary} 
                  style={{ flex: 1, justifyContent: "center", background: "var(--color-error)" }}
                  onClick={submitCancelOrder}
                  disabled={isUpdating || !cancelReason.trim()}
                >
                  {isUpdating ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
