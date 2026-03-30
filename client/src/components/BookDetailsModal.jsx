import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export function BookDetailsModal({
  book,
  onClose,
  canReserve = false,
  isReservedByUser = false,
  onReserve
}) {
  useEffect(() => {
    if (!book) {
      return;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [book, onClose]);

  useEffect(() => {
    if (!book) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [book]);

  const bookId = book?.id ?? book?._id;

  return createPortal(
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4"
          onClick={onClose}
        >
          <motion.article
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-white/60 bg-white p-6 shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl text-ink">{book.title}</h2>
                <p className="mt-1 text-slate-600">
                  {book.author} • {book.publishedYear}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {book.genre?.name ?? book.genre}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  book.active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {book.active ? "Available" : "Unavailable"}
              </span>
            </div>

            <p className="mt-4 text-slate-700 leading-relaxed">
              {book.description || "No description for this book yet."}
            </p>

            {canReserve && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  disabled={!book.active || isReservedByUser}
                  onClick={() => onReserve?.(bookId)}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isReservedByUser ? "Reserved" : "Reserve this book"}
                </button>
              </div>
            )}
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
