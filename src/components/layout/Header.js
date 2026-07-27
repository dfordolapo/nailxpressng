"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import CartDrawer from "@/components/cart/CartDrawer";
import styles from "@/styles/components/header.module.css";

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, cartOpen]);

  return (
    <>
      {!isHome && <div className={styles.headerSpacer} aria-hidden="true" />}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${mobileOpen ? styles.headerHidden : ""}`} id="site-header">
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} id="site-logo">
            Nail<span className={styles.logoAccent}>express</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} id="desktop-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={openSearch}
              aria-label="Search"
              id="search-btn"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            <Link
              href="/wishlist"
              className={`${styles.actionBtn} ${styles.desktopOnly}`}
              aria-label="Wishlist"
              id="wishlist-btn"
            >
              <Heart size={22} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </Link>

            <button
              className={styles.actionBtn}
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              id="cart-btn"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className={styles.badge}>{itemCount}</span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.menuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-btn"
            >
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Standalone Drawer */}
      {mobileOpen && (
        <>
          <div className={`${styles.mobileOverlay} ${styles.open}`} onClick={() => setMobileOpen(false)} />
          <aside className={styles.mobileNav} id="mobile-nav">
            <div className={styles.mobileNavHeader}>
              <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                Nail<span className={styles.logoAccent}>express</span>
              </Link>
              <button
                className={styles.mobileCloseBtn}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className={styles.mobileNavBody}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                className={`${styles.mobileNavLink} ${pathname === "/wishlist" ? styles.active : ""}`}
                onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Heart size={18} strokeWidth={1.5} />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && <span className={styles.badgeInline}>{wishlistCount}</span>}
              </Link>

              <button
                className={styles.mobileNavLink}
                onClick={() => {
                  setMobileOpen(false);
                  setCartOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--color-border-light)",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  <span>Cart</span>
                </div>
                {itemCount > 0 && <span className={styles.badgeInline}>{itemCount}</span>}
              </button>

              <button
                className={styles.mobileSearchBtn}
                onClick={() => {
                  setMobileOpen(false);
                  openSearch();
                }}
              >
                <Search size={18} strokeWidth={1.5} />
                <span>Search Products</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Cart Drawer */}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
