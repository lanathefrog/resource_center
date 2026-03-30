import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = "success", duration = DEFAULT_DURATION }) => {
      const id = crypto.randomUUID();
      const nextToast = { id, message, type, duration };

      setToasts((prev) => [...prev, nextToast]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast
    }),
    [toasts, addToast, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
