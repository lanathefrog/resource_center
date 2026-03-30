import { useEffect, useState } from "react";
import { apiBaseUrl } from "../api/http";

export function useBooks(api, { search, genreId }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBooks() {
    setLoading(true);
    setError("");

    try {
      const data = await api.listBooks({ search, genreId });
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [api, search, genreId]);

  useEffect(() => {
    const events = new EventSource(`${apiBaseUrl}/api/books/events/stream`, {
      withCredentials: true
    });

    events.addEventListener("books:changed", () => {
      fetchBooks();
    });

    return () => {
      events.close();
    };
  }, [api, search, genreId]);

  return {
    books,
    loading,
    error,
    reload: fetchBooks
  };
}
