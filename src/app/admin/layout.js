export const metadata = {
  manifest: "/manifest-admin.json",
  appleWebApp: {
    capable: true,
    title: "Nailexpress Admin",
    statusBarStyle: "default",
  },
};

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}
