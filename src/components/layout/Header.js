"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import CartDrawer from "@/components/cart/CartDrawer";
import DropCountdownBar from "@/components/layout/DropCountdownBar";
import styles from "@/styles/components/header.module.css";

const DEFAULT_COLLECTIONS = [
  { id: "handmade", name: "Handmade", slug: "handmade", is_published: true },
  { id: "factory", name: "Factory Made", slug: "factory", is_published: true },
];

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { openSearch } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasDropBar, setHasDropBar] = useState(false);

  // Collections state for dynamic hamburger menu & navigation
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(true);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  
  const isAdmin = pathname?.startsWith("/admin");

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setDesktopDropdownOpen(false);
  }

  useEffect(() => {
    async function fetchPublishedCollections() {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();
        if (data.collections && Array.isArray(data.collections) && data.collections.length > 0) {
          setCollections(data.collections);
        }
      } catch (err) {
        console.error("Failed to load header collections:", err);
      }
    }
    fetchPublishedCollections();
  }, [pathname]);

  useEffect(() => {
    if (isAdmin) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    if (mobileOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, cartOpen, isAdmin]);

  if (isAdmin) return null;

  const getCollectionHref = (slug) => {
    if (slug === "handmade") return "/handmade";
    if (slug === "factory") return "/factory";
    return `/collection/${slug}`;
  };

  const isCollectionsActive = 
    pathname?.startsWith("/handmade") || 
    pathname?.startsWith("/factory") || 
    pathname?.startsWith("/collection");

  return (
    <>
      <DropCountdownBar collections={collections} onActiveChange={setHasDropBar} />
      <header className={`${styles.header} ${hasDropBar ? styles.headerWithDropBar : ""} ${scrolled ? styles.scrolled : ""} ${mobileOpen ? styles.headerHidden : ""}`} id="site-header">
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} id="site-logo">
            <Image
              src="/images/splash-logo.png"
              alt="Nailexpress Logo"
              width={150}
              height={45}
              className={styles.logoImg}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} id="desktop-nav">
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>

            {/* Collections Dropdown for Desktop */}
            <div 
              className={styles.desktopDropdown}
              onMouseEnter={() => setDesktopDropdownOpen(true)}
              onMouseLeave={() => setDesktopDropdownOpen(false)}
            >
              <Link
                href="/collection-hub"
                className={`${styles.desktopDropdownTrigger} ${isCollectionsActive ? styles.active : ""}`}
              >
                <span>Collections</span>
                <ChevronDown size={14} strokeWidth={1.5} />
              </Link>

              {desktopDropdownOpen && (
                <div className={styles.desktopMenu}>
                  {collections.map((col) => {
                    const href = getCollectionHref(col.slug);
                    return (
                      <Link
                        key={col.id || col.slug}
                        href={href}
                        className={`${styles.desktopMenuItem} ${pathname === href ? styles.active : ""}`}
                        onClick={() => setDesktopDropdownOpen(false)}
                      >
                        <span>{col.name}</span>
                      </Link>
                    );
                  })}
                  <div className={styles.desktopMenuDivider} />
                  <Link
                    href="/collection-hub"
                    className={`${styles.desktopMenuItem} ${styles.desktopMenuAll}`}
                    onClick={() => setDesktopDropdownOpen(false)}
                  >
                    <span>View All Collections &rarr;</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/custom-order"
              className={`${styles.navLink} ${pathname === "/custom-order" ? styles.active : ""}`}
            >
              Custom Order
            </Link>
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

            {/* Mobile Menu Toggle (Hamburger) */}
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

      {/* Mobile Navigation Standalone Drawer (Hamburger Dropdown Menu) */}
      {mobileOpen && (
        <>
          <div className={`${styles.mobileOverlay} ${styles.open}`} onClick={() => setMobileOpen(false)} />
          <aside className={styles.mobileNav} id="mobile-nav">
            <div className={styles.mobileNavHeader}>
              <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                <Image
                  src="/images/splash-logo.png"
                  alt="Nailexpress Logo"
                  width={140}
                  height={40}
                  className={styles.logoImg}
                  priority
                />
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
              {/* Home Link */}
              <Link
                href="/"
                className={`${styles.mobileNavLink} ${pathname === "/" ? styles.active : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>

              {/* Collections Accordion / Dropdown */}
              <div>
                <button
                  type="button"
                  className={`${styles.mobileAccordionBtn} ${isCollectionsActive ? styles.active : ""}`}
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  aria-expanded={mobileCollectionsOpen}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>Collections</span>
                    {collections.length > 0 && (
                      <span className={styles.collectionCountBadge}>{collections.length}</span>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className={`${styles.mobileChevron} ${mobileCollectionsOpen ? styles.mobileChevronOpen : ""}`}
                  />
                </button>

                {mobileCollectionsOpen && (
                  <div className={styles.mobileSubList}>
                    {collections.map((col) => {
                      const href = getCollectionHref(col.slug);
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={col.id || col.slug}
                          href={href}
                          className={`${styles.mobileSubLink} ${isActive ? styles.active : ""}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span>{col.name}</span>
                          {isActive && (
                            <span style={{ 
                              width: "6px", 
                              height: "6px", 
                              borderRadius: "50%", 
                              background: "var(--color-primary)" 
                            }} />
                          )}
                        </Link>
                      );
                    })}
                    <Link
                      href="/collection-hub"
                      className={styles.mobileSubLinkAll}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>Explore All Collections</span>
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Custom Order */}
              <Link
                href="/custom-order"
                className={`${styles.mobileNavLink} ${pathname === "/custom-order" ? styles.active : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Custom Order
              </Link>

              {/* Wishlist */}
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

              {/* Cart Button */}
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

              {/* Search Button */}
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
