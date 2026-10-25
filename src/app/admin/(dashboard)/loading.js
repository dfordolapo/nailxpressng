import styles from "@/styles/admin.module.css";

export default function AdminLoading() {
  return (
    <div style={{ padding: "8px 0", width: "100%", animation: "pulse 1.2s ease-in-out infinite" }}>
      {/* Page Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ width: "160px", height: "26px", background: "#f0ebeb", borderRadius: "6px" }} />
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "90px", height: "32px", background: "#f0ebeb", borderRadius: "6px" }} />
          <div style={{ width: "110px", height: "32px", background: "#f0ebeb", borderRadius: "6px" }} />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "18px" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: "72px", background: "#ffffff", border: "1px solid #f0ebeb", borderRadius: "10px", padding: "12px" }}>
            <div style={{ width: "45%", height: "10px", background: "#f5f0f0", borderRadius: "4px", marginBottom: "8px" }} />
            <div style={{ width: "70%", height: "20px", background: "#ede4e4", borderRadius: "4px" }} />
          </div>
        ))}
      </div>

      {/* Main Content / Table Skeleton */}
      <div style={{ background: "#ffffff", border: "1px solid #f0ebeb", borderRadius: "10px", padding: "16px", minHeight: "360px" }}>
        <div style={{ width: "100%", height: "36px", background: "#f7f4f4", borderRadius: "6px", marginBottom: "14px" }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f9f5f5" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#f2ecec", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "35%", height: "12px", background: "#f0e8e8", borderRadius: "4px", marginBottom: "6px" }} />
              <div style={{ width: "20%", height: "10px", background: "#f8f3f3", borderRadius: "4px" }} />
            </div>
            <div style={{ width: "65px", height: "18px", background: "#f0e8e8", borderRadius: "12px" }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
