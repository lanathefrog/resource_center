import { motion } from "framer-motion";

export function BookCard({
  book,
  admin = false,
  canReserve = false,
  isReservedByUser = false,
  onOpen,
  onReserve,
  onEdit,
  onDelete,
  onToggle
}) {
  const bookId = book.id ?? book._id;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-white/60 bg-white/90 p-5 shadow-glow ${
        onOpen ? "cursor-pointer transition-transform hover:-translate-y-0.5" : ""
      }`}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={() => onOpen?.(book)}
      onKeyDown={(event) => {
        if (!onOpen) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(book);
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg text-ink">{book.title}</h3>
          <p className="text-sm text-slate-600">
            {book.author} • {book.publishedYear}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            book.active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {book.active ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-700">{book.description || "No description"}</p>
      <p className="mt-3 inline-block rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
        {book.genre?.name ?? book.genre}
      </p>

      {admin && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(book);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(bookId);
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white"
            onClick={(event) => {
              event.stopPropagation();
              onToggle(bookId);
            }}
          >
            {book.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}

      {!admin && canReserve && (
        <div className="mt-4">
          <button
            type="button"
            disabled={!book.active || isReservedByUser}
            onClick={(event) => {
              event.stopPropagation();
              onReserve?.(bookId);
            }}
            className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isReservedByUser ? "Reserved" : "Reserve"}
          </button>
        </div>
      )}
    </motion.article>
  );
}
