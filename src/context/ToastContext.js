"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        pointerEvents: "none",
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const bgMap = {
    success: "var(--color-primary-800)",
    error: "var(--color-error)",
    info: "var(--color-text)",
  };

  return (
    <div
      onClick={() => onDismiss(toast.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: bgMap[toast.type] || bgMap.success,
        color: "white",
        padding: "12px 20px",
        borderRadius: "var(--radius-full)",
        fontSize: "0.875rem",
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        pointerEvents: "auto",
        cursor: "pointer",
        animation: "toastIn 250ms cubic-bezier(0.34,1.56,0.64,1) forwards",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {toast.type === "success" && (
        <span style={{ fontSize: "1rem" }}>✓</span>
      )}
      {toast.message}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
