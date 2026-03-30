import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookCard } from "../components/BookCard";
import { BookForm } from "../components/BookForm";
import { useAppContext } from "../context/AppContext";
import { useBooks } from "../hooks/useBooks";
import { useGenres } from "../hooks/useGenres";
import { useToast } from "../context/ToastContext";

export function AdminPage() {
  const { api } = useAppContext();
  const { addToast } = useToast();
  const genres = useGenres(api);
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const { books, loading, error, reload } = useBooks(api, { search, genreId });
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const lastErrorRef = useRef("");

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      addToast({ type: "error", message: error });
    }

    if (!error) {
      lastErrorRef.current = "";
    }
  }, [addToast, error]);

  async function handleSubmit(payload) {
    try {
      if (editingBook) {
        await api.updateBook(editingBook.id, payload);
        addToast({ type: "success", message: "Book updated" });
      } else {
        await api.createBook(payload);
        addToast({ type: "success", message: "Book created" });
      }
      setShowForm(false);
      setEditingBook(null);
      await reload();
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this book?")) {
      return;
    }

    try {
      await api.deleteBook(id);
      addToast({ type: "warning", message: "Book deleted" });
      await reload();
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  }

  async function handleToggle(id) {
    try {
      const updatedBook = await api.toggleBookActive(id);
      addToast({
        type: updatedBook.active ? "success" : "warning",
        message: updatedBook.active ? "Book activated" : "Book deactivated"
      });
      await reload();
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  }

  function handleEdit(book) {
    setEditingBook(book);
    setShowForm(true);
  }

  function openCreate() {
    setEditingBook(null);
    setShowForm(true);
  }

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-4xl">Admin Panel</h1>
          <p className="text-slate-700">CRUD operations, activation toggles, and instant catalog updates.</p>
        </div>
        <button type="button" className="rounded-xl bg-ink px-4 py-3 text-white font-semibold" onClick={openCreate}>
          Add book
        </button>
      </motion.div>

      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-glow">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="rounded-xl border border-slate-200 p-3" />
          <select value={genreId} onChange={(e) => setGenreId(e.target.value)} className="rounded-xl border border-slate-200 p-3 bg-white">
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id ?? g._id} value={g.id ?? g._id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/60 bg-white/95 p-4 shadow-glow">
          <h2 className="font-heading text-2xl mb-3">{editingBook ? "Edit Book" : "New Book"}</h2>
          <BookForm
            initialBook={editingBook}
            genres={genres}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
        </motion.div>
      )}

      {loading && <p>Loading...</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} admin onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
        ))}
      </div>
    </section>
  );
}
