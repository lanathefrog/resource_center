import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookCard } from "../components/BookCard";
import { BookDetailsModal } from "../components/BookDetailsModal";
import { useAppContext } from "../context/AppContext";
import { useBooks } from "../hooks/useBooks";
import { useGenres } from "../hooks/useGenres";
import { useToast } from "../context/ToastContext";

export function HomePage() {
  const { api, user } = useAppContext();
  const { addToast } = useToast();
  const genres = useGenres(api);
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservationBookIds, setReservationBookIds] = useState([]);
  const { books, loading, error, reload } = useBooks(api, { search, genreId });
  const lastErrorRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    async function loadReservations() {
      if (!user || user.role === "admin") {
        setReservationBookIds([]);
        return;
      }

      try {
        const reservations = await api.listMyReservations();
        if (cancelled) {
          return;
        }
        setReservationBookIds(reservations.map((reservation) => reservation.book?.id || reservation.book?._id));
      } catch {
        if (!cancelled) {
          setReservationBookIds([]);
        }
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, [api, user]);

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      addToast({ type: "error", message: error });
    }

    if (!error) {
      lastErrorRef.current = "";
    }
  }, [addToast, error]);

  async function handleReserve(bookId) {
    try {
      await api.reserveBook(bookId);
      addToast({ type: "success", message: "Book reserved" });
      setReservationBookIds((prev) => Array.from(new Set([...prev, bookId])));
      setSelectedBook((prev) => {
        if (!prev) {
          return prev;
        }

        const selectedId = prev.id ?? prev._id;
        if (selectedId !== bookId) {
          return prev;
        }

        return { ...prev, active: false };
      });
      await reload();
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  }

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        <h1 className="font-heading text-4xl leading-tight">Library Catalog</h1>
        <p className="max-w-2xl text-slate-700">
          Search, filtering, and live catalog updates without page reloads.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-glow">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or description"
            className="rounded-xl border border-slate-200 p-3"
          />
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className="rounded-xl border border-slate-200 p-3 bg-white"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id ?? g._id} value={g.id ?? g._id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-slate-700">Loading...</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => {
          const bookId = book.id ?? book._id;

          return (
            <BookCard
              key={bookId}
              book={book}
              onOpen={setSelectedBook}
              canReserve={Boolean(user && user.role !== "admin")}
              isReservedByUser={reservationBookIds.includes(bookId)}
              onReserve={handleReserve}
            />
          );
        })}
      </div>

      <BookDetailsModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        canReserve={Boolean(user && user.role !== "admin")}
        isReservedByUser={Boolean(
          selectedBook && reservationBookIds.includes(selectedBook.id ?? selectedBook._id)
        )}
        onReserve={handleReserve}
      />

      {!loading && books.length === 0 && (
        <p className="text-slate-600">No books matched your filters.</p>
      )}
    </section>
  );
}
