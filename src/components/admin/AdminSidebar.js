"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Sparkles, 
  Package, 
  Star, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  BellRing,
  Layers
} from "lucide-react";
import styles from "@/styles/admin.module.css";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collection = searchParams.get("collection");
  const [isProductsOpen, setIsProductsOpen] = useState(pathname.startsWith("/admin/products"));
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.startsWith("/admin/settings"));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsMobileOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileOpen]);

  return (
    <>
      <div className={styles.mobileHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              className={styles.hamburgerBtn} 
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileOpen}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <div style={{ fontWeight: 700, fontSize: "1.25rem", fontFamily: "'Cormorant Upright', Georgia, serif", color: "var(--color-primary)", lineHeight: 1 }}>
                Nail Express <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-primary, sans-serif)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, color: "var(--color-text-secondary)", marginLeft: "4px" }}>Admin</span>
              </div>
            </Link>
          </div>
          <Link href="/" className={styles.visitStoreBtn} style={{ fontSize: "0.78rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 500, padding: "5px 10px", borderRadius: "6px", background: "var(--color-primary-100, #fdf2f4)" }}>
            View Store →
          </Link>
        </div>
      </div>

      {isMobileOpen && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={() => setIsMobileOpen(false)} 
          aria-hidden="true"
        />
      )}

      <aside 
        className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ""}`}
        aria-label="Admin Navigation"
      >
        <div className={styles.sidebarLogo}>
          <Link href="/" className={styles.logoText}>
            Nail Express
          </Link>
          <button 
            className={styles.closeSidebarBtn} 
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <Link
              href="/admin"
              prefetch={true}
              className={`${styles.navItem} ${pathname === "/admin" ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <LayoutDashboard size={18} strokeWidth={1.5} />
              Dashboard
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/orders"
              prefetch={true}
              className={`${styles.navItem} ${pathname === "/admin/orders" ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              Orders
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/custom-orders"
              prefetch={true}
              className={`${styles.navItem} ${pathname.startsWith("/admin/custom-orders") ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Sparkles size={18} strokeWidth={1.5} />
              Custom Orders
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/reviews"
              prefetch={true}
              className={`${styles.navItem} ${pathname.startsWith("/admin/reviews") ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Star size={18} strokeWidth={1.5} />
              Reviews
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/subscribers"
              prefetch={true}
              className={`${styles.navItem} ${pathname.startsWith("/admin/subscribers") ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <BellRing size={18} strokeWidth={1.5} />
              Restock Alerts
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/collections"
              prefetch={true}
              className={`${styles.navItem} ${pathname.startsWith("/admin/collections") ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Layers size={18} strokeWidth={1.5} />
              Collections
            </Link>
          </div>

          <div className={styles.navGroup}>
            <div 
              className={`${styles.navItem} ${pathname.startsWith("/admin/products") ? styles.active : ""}`} 
              style={{ cursor: "pointer" }}
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <Package size={18} strokeWidth={1.5} />
              Products
              <ChevronDown 
                size={16} 
                strokeWidth={1.5}
                style={{ 
                  marginLeft: "auto", 
                  transform: isProductsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }} 
              />
            </div>
            {isProductsOpen && (
              <div className={styles.navSub}>
                <Link 
                  href="/admin/products" 
                  prefetch={true}
                  className={styles.navSubItem}
                  style={{ color: pathname === "/admin/products" && !collection ? "var(--color-primary)" : "", fontWeight: pathname === "/admin/products" && !collection ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  All Products
                </Link>
                <Link 
                  href="/admin/products?collection=handmade" 
                  prefetch={true}
                  className={styles.navSubItem}
                  style={{ color: collection === "handmade" ? "var(--color-primary)" : "", fontWeight: collection === "handmade" ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Handmade
                </Link>
                <Link 
                  href="/admin/products?collection=factory" 
                  prefetch={true}
                  className={styles.navSubItem}
                  style={{ color: collection === "factory" ? "var(--color-primary)" : "", fontWeight: collection === "factory" ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Factory Made
                </Link>
              </div>
            )}
          </div>

          <div className={styles.navGroup}>
            <div 
              className={`${styles.navItem} ${pathname.startsWith("/admin/settings") ? styles.active : ""}`} 
              style={{ cursor: "pointer" }}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings size={18} strokeWidth={1.5} />
              Settings
              <ChevronDown 
                size={16} 
                strokeWidth={1.5}
                style={{ 
                  marginLeft: "auto", 
                  transform: isSettingsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }} 
              />
            </div>
            {isSettingsOpen && (
              <div className={styles.navSub}>
                <Link 
                  href="/admin/settings/attributes" 
                  prefetch={true}
                  className={styles.navSubItem}
                  style={{ color: pathname === "/admin/settings/attributes" ? "var(--color-primary)" : "", fontWeight: pathname === "/admin/settings/attributes" ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Store Attributes
                </Link>
                <Link 
                  href="/admin/settings" 
                  prefetch={true}
                  className={styles.navSubItem}
                  style={{ color: pathname === "/admin/settings" ? "var(--color-primary)" : "", fontWeight: pathname === "/admin/settings" ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Shipping Rates
                </Link>
              </div>
            )}
          </div>
        </nav>

        <button
          className={styles.logoutBtn}
          onClick={async () => {
            try {
              await fetch("/api/admin/logout", { method: "POST" });
            } catch (e) {
              console.error(e);
            }
            router.push("/admin/login");
            router.refresh();
          }}
        >
          <LogOut size={18} strokeWidth={1.5} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default function AdminSidebar() {
  return (
    <Suspense fallback={<div className={styles.sidebar} />}>
      <SidebarContent />
    </Suspense>
  );
}
