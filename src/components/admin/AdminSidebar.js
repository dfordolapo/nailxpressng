"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { LayoutDashboard, Package, LogOut, ChevronDown, Settings, Menu, X, Image as ImageIcon } from "lucide-react";
import styles from "@/styles/admin.module.css";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collection = searchParams.get("collection");
  const [isProductsOpen, setIsProductsOpen] = useState(pathname.startsWith("/admin/products"));
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.startsWith("/admin/settings"));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className={styles.mobileHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button className={styles.hamburgerBtn} onClick={() => setIsMobileOpen(true)}>
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <div style={{ fontWeight: 700, fontSize: "1.3rem", fontFamily: "'Cormorant Upright', Georgia, serif", color: "var(--color-primary)" }}>
            Nail Express Admin
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarLogo}>
          <Link href="/" className={styles.logoText}>
            Nail Express
          </Link>
          <button className={styles.closeSidebarBtn} onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <Link
              href="/admin"
              className={`${styles.navItem} ${pathname === "/admin" ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/orders"
              className={`${styles.navItem} ${pathname === "/admin/orders" ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Package size={18} />
              Orders
            </Link>
          </div>

          <div className={styles.navGroup}>
            <Link
              href="/admin/custom-orders"
              className={`${styles.navItem} ${pathname.startsWith("/admin/custom-orders") ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Package size={18} />
              Custom Orders
            </Link>
          </div>

          <div className={styles.navGroup}>
            <div 
              className={`${styles.navItem} ${pathname.startsWith("/admin/products") ? styles.active : ""}`} 
              style={{ cursor: "pointer" }}
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <Package size={18} />
              Products
              <ChevronDown 
                size={16} 
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
                  className={styles.navSubItem}
                  style={{ color: pathname === "/admin/products" && !collection ? "var(--color-primary)" : "", fontWeight: pathname === "/admin/products" && !collection ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  All Products
                </Link>
                <Link 
                  href="/admin/products?collection=handmade" 
                  className={styles.navSubItem}
                  style={{ color: collection === "handmade" ? "var(--color-primary)" : "", fontWeight: collection === "handmade" ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Handmade
                </Link>
                <Link 
                  href="/admin/products?collection=factory" 
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
              <Settings size={18} />
              Settings
              <ChevronDown 
                size={16} 
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
                  className={styles.navSubItem}
                  style={{ color: pathname === "/admin/settings/attributes" ? "var(--color-primary)" : "", fontWeight: pathname === "/admin/settings/attributes" ? 600 : 400 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Store Attributes
                </Link>
                <Link 
                  href="/admin/settings" 
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
          <LogOut size={18} />
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
