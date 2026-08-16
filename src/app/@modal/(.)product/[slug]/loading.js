import ProductModalWrapper from "@/components/ui/ProductModalWrapper";

export default function LoadingModal() {
  return (
    <ProductModalWrapper>
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
           <div style={{ width: '96px', height: '96px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
              <div style={{ width: '80%', height: '24px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }} />
              <div style={{ width: '40%', height: '20px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }} />
           </div>
        </div>
        
        {/* Thumbnails Skeleton */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
           {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '44px', height: '44px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }} />
           ))}
        </div>

        {/* Controls Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)' }}>
           {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '40px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
           ))}
        </div>

        {/* CSS for pulse animation */}
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    </ProductModalWrapper>
  );
}
