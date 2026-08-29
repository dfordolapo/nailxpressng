"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { getProductsByIds } from "@/lib/api";
import { Heart, ArrowLeft, ShoppingBag, Share } from "lucide-react";
import pageStyles from "@/styles/pages/collection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";
import { products } from "@/data/products";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, toggleItem, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [stockMap, setStockMap] = useState({});

  useEffect(() => {
    let active = true;
    if (items.length > 0) {
      getProductsByIds(items.map(i => i.id)).then((liveProducts) => {
        if (!active) return;
        const map = {};
        liveProducts.forEach(p => { map[p.id] = p; });
        setStockMap(map);
      });
    } else {
      setStockMap({});
    }
    return () => { active = false; };
  }, [items]);

  const handleMoveToCart = (item) => {
    const live = stockMap[item.id];
    const size = live?.sizes?.[0] || "M";
    const length = live?.lengths?.[0] || "medium";
    const cartProductFormat = {
      ...item,
      image: live?.image || item.image,
      images: live?.images?.length ? live.images : [item.image]
    };
    addItem(cartProductFormat, 1, size, length);
    removeItem(item.id);
    showToast(`"${item.name}" moved to cart`);
  };

  const handleMoveAllToCart = () => {
    items.forEach(item => {
      const live = stockMap[item.id];
      const size = live?.sizes?.[0] || "M";
      const length = live?.lengths?.[0] || "medium";
      addItem({ ...item, images: live?.images?.length ? live.images : [item.image] }, 1, size, length);
    });
    clearWishlist();
    showToast("Wishlist items added to cart");
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "saved just now";
    const diffDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "saved today";
    if (diffDays === 1) return "saved yesterday";
    return `saved ${diffDays} days ago`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wishlist",
          text: "Check out my favorite press-on nails!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Wishlist link copied to clipboard!");
    }
  };

  if (items.length === 0) {
    return (
      <div className={pageStyles.wishlistPage} style={{ minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="container" style={{ textAlign: "center" }}>

          <div className="animate-heartbeat" style={{ color: "var(--color-primary-300)", marginBottom: "var(--space-4)", display: "inline-block" }}>
            <Heart size={64} strokeWidth={1} />
          </div>

          <h2 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>Your wishlist is empty, let's fix that</h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", maxWidth: "600px", margin: "0 auto var(--space-12) auto", textWrap: "balance" }}>
            Tap the heart icon on any set to save it for later.
          </p>
          <Link href="/shop" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}>
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={pageStyles.wishlistPage} id="wishlist-page">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
          <Link href="/" style={{ color: "var(--color-primary-light)", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={24} strokeWidth={1.5} />
          </Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>My Wishlist</h1>
          <button onClick={handleShare} style={{ color: "var(--color-primary-light)", display: "flex", alignItems: "center" }} aria-label="Share Wishlist">
            <Share size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--space-6)" }}>
          <button 
            onClick={handleMoveAllToCart}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-2)",
              background: "var(--color-primary)", color: "white",
              border: "none", borderRadius: "var(--radius-full)",
              padding: "var(--space-2) var(--space-4)", fontSize: "0.875rem",
              fontWeight: 500, cursor: "pointer"
            }}
          >
            <ShoppingBag size={16} /> Move all to cart
          </button>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <div style={{
                background: "linear-gradient(135deg, #fff0f5 0%, #fff 100%)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                display: "flex",
                gap: "var(--space-4)",
                padding: "var(--space-3)",
                position: "relative",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
              }}>
                <Link href={`/product/${item.slug}`} style={{ flexShrink: 0 }}>
                  <div style={{
                    width: "100px",
                    height: "100px",
                    background: "var(--color-bg-warm)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    {stockMap[item.id]?.image ? (
                      <Image src={stockMap[item.id].image} alt={item.name} fill sizes="100px" style={{ objectFit: "cover" }} />
                    ) : (
                      "💅"
                    )}
                  </div>
                </Link>
                
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "2px" }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                        {getTimeAgo(item.addedAt)}
                      </p>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ color: "var(--color-warning)", background: "transparent", border: "none" }}>
                      <Heart size={20} fill="var(--color-warning)" />
                    </button>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "4px" }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {formatPrice(item.price)}
                    </div>
                    {stockMap[item.id] && (
                      stockMap[item.id].inStock ? (
                        <span style={{ fontSize: "0.7rem", color: "var(--color-success)", fontWeight: 500, display: "flex", alignItems: "center", gap: "2px" }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-success)" }}></span> In stock ✓
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.7rem", color: "var(--color-warning)", fontWeight: 600, display: "flex", alignItems: "center", gap: "2px" }}>
                          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-warning)" }}></span> Out of stock
                        </span>
                      )
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleMoveToCart(item)}
                    style={{
                      marginTop: "auto",
                      width: "fit-content",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "nowrap",
                      gap: "var(--space-2)",
                      background: "var(--color-primary-50)",
                      border: "1px solid var(--color-primary-100)",
                      color: "var(--color-primary)",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 400,
                      whiteSpace: "nowrap"
                    }}
                  >
                    <ShoppingBag size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} /> 
                    <span style={{ position: "relative", top: "1px" }}>Move to cart</span>
                  </button>
                </div>
              </div>

              {/* Suggestions Row */}
              <div style={{ paddingLeft: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)", fontWeight: 500 }}>More from this collection</p>
                <div style={{ 
                  display: "flex", 
                  overflowX: "auto", 
                  gap: "var(--space-3)", 
                  paddingBottom: "var(--space-2)",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none" 
                }}
                className="hide-scrollbar"
                >
                  <style dangerouslySetInnerHTML={{__html: `
                    .hide-scrollbar::-webkit-scrollbar {
                      display: none;
                    }
                  `}} />
                  {products
                    .filter(p => p.category === item.category && p.id !== item.id)
                    .slice(0, 4)
                    .map(suggested => {
                      const isSuggestedWishlisted = isInWishlist(suggested.id);
                      return (
                        <Link 
                          key={suggested.id} 
                          href={`/product/${suggested.slug}`} 
                          style={{ flexShrink: 0, width: "100px", textDecoration: "none", color: "inherit" }}
                        >
                          <div style={{ 
                            width: "100px", 
                            height: "100px", 
                            borderRadius: "var(--radius-sm)", 
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden", 
                            background: "var(--color-bg-warm)", 
                            marginBottom: "4px",
                            fontSize: "1.5rem",
                            position: "relative"
                          }}>
                            💅
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleItem(suggested);
                              }}
                              aria-label={isSuggestedWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                              style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.9)",
                                backdropFilter: "blur(4px)",
                                border: "1px solid rgba(0, 0, 0, 0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                color: isSuggestedWishlisted ? "var(--color-warning)" : "var(--color-text-tertiary)",
                                zIndex: 2,
                                transition: "all 0.2s ease"
                              }}
                            >
                              <Heart
                                size={14}
                                fill={isSuggestedWishlisted ? "var(--color-warning)" : "none"}
                                stroke={isSuggestedWishlisted ? "var(--color-warning)" : "currentColor"}
                              />
                            </button>
                          </div>
                          <p style={{ fontSize: "0.75rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{suggested.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>{formatPrice(suggested.price)}</p>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
