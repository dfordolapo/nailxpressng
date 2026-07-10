import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "@/styles/admin.module.css";

export const metadata = {
  title: "Admin Dashboard | Nail Express",
  description: "Seller administration panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}
