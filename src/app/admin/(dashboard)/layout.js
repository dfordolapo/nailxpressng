import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "@/styles/admin.module.css";

export const metadata = {
  title: "Admin Dashboard | Nailexpress Admin",
  description: "Seller administration panel",
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated_funmi") {
    redirect("/admin/login");
  }

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
