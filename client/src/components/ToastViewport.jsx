import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

const typeStyles = {
  success: {
    container: "border-emerald-300 bg-emerald-50 text-emerald-900",
    bar: "bg-emerald-500"
  },
  warning: {
    container: "border-amber-300 bg-amber-50 text-amber-900",
    bar: "bg-amber-500"
  },
  error: {
    container: "border-rose-300 bg-rose-50 text-rose-900",
    bar: "bg-rose-500"
  }
};

export function ToastViewport() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(92vw,420px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = typeStyles[toast.type] || typeStyles.success;

          return (
            <motion.article
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className={`pointer-events-auto overflow-hidden rounded-xl border shadow-lg ${style.container}`}
            >
              <div className="flex items-start justify-between gap-3 px-4 pt-3">
                <p className="text-sm font-semibold leading-5">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-md px-2 py-0.5 text-sm font-bold hover:bg-black/10"
                  aria-label="Close notification"
                >
                  x
                </button>
              </div>
              <div className="mt-3 h-1 w-full bg-black/10">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ ease: "linear", duration: toast.duration / 1000 }}
                  className={`h-full ${style.bar}`}
                />
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
