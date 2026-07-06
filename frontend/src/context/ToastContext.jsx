import React, { createContext, useContext, useState, useCallback } from 'react';

/* ── Toast Context ──────────────────────────────────────────── */
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 2800) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

/* ── Toast UI ───────────────────────────────────────────────── */
const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 18px',
            boxShadow: 'var(--shadow-xl)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            minWidth: 240,
            maxWidth: 360,
            animation: 'slideUpToast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'all',
            cursor: 'pointer',
            borderLeft: `4px solid ${t.type === 'error' ? 'var(--color-danger)' : t.type === 'warning' ? 'var(--color-warning)' : t.type === 'info' ? 'var(--color-primary)' : 'var(--color-success)'}`,
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[t.type] || '✅'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}

      <style>{`
        @keyframes slideUpToast {
          from { opacity: 0; transform: translateY(16px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
