import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";

const initialState = {
  title: "",
  author: "",
  genreName: "",
  publishedYear: "",
  description: "",
  active: true
};

export function BookForm({ initialBook, genres = [], onSubmit, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
  const [activeGenreIndex, setActiveGenreIndex] = useState(-1);
  const { addToast } = useToast();

  const genreSuggestions = useMemo(() => {
    const query = form.genreName.trim().toLowerCase();
    const names = Array.from(
      new Set(genres.map((g) => g.name).filter(Boolean))
    );

    if (!query) {
      return names.slice(0, 8);
    }

    return names
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [form.genreName, genres]);

  useEffect(() => {
    if (initialBook) {
      setForm({
        title: initialBook.title,
        author: initialBook.author,
        genreName: initialBook.genre?.name ?? initialBook.genre ?? "",
        publishedYear: String(initialBook.publishedYear),
        description: initialBook.description || "",
        active: Boolean(initialBook.active)
      });
    } else {
      setForm(initialState);
    }
  }, [initialBook]);

  function changeField(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "genreName") {
      setIsGenreMenuOpen(true);
      setActiveGenreIndex(-1);
    }
  }

  function selectGenre(name) {
    setForm((prev) => ({
      ...prev,
      genreName: name
    }));
    setIsGenreMenuOpen(false);
    setActiveGenreIndex(-1);
  }

  function handleGenreKeyDown(event) {
    if (!genreSuggestions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsGenreMenuOpen(true);
      setActiveGenreIndex((prev) => (prev + 1) % genreSuggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsGenreMenuOpen(true);
      setActiveGenreIndex((prev) =>
        prev <= 0 ? genreSuggestions.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "Enter" && isGenreMenuOpen && activeGenreIndex >= 0) {
      event.preventDefault();
      selectGenre(genreSuggestions[activeGenreIndex]);
      return;
    }

    if (event.key === "Escape") {
      setIsGenreMenuOpen(false);
      setActiveGenreIndex(-1);
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim() || !form.genreName.trim()) {
      addToast({ type: "warning", message: "Title, author, and genre are required" });
      return;
    }

    const year = Number(form.publishedYear);
    if (!Number.isInteger(year) || year < 1000 || year > 2100) {
      addToast({ type: "warning", message: "Year must be between 1000 and 2100" });
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      genreName: form.genreName.trim(),
      publishedYear: year,
      description: form.description.trim(),
      active: form.active
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="title"
          value={form.title}
          onChange={changeField}
          placeholder="Title"
          className="w-full rounded-xl border border-slate-200 p-3"
          required
        />
        <input
          name="author"
          value={form.author}
          onChange={changeField}
          placeholder="Author"
          className="w-full rounded-xl border border-slate-200 p-3"
          required
        />
        <div className="relative">
          <input
            name="genreName"
            value={form.genreName}
            onChange={changeField}
            onFocus={() => setIsGenreMenuOpen(true)}
            onBlur={() => {
              window.setTimeout(() => {
                setIsGenreMenuOpen(false);
                setActiveGenreIndex(-1);
              }, 120);
            }}
            onKeyDown={handleGenreKeyDown}
            placeholder="Genre (pick or type new)"
            autoComplete="off"
            className="w-full rounded-xl border border-slate-200 p-3"
            required
          />
          {isGenreMenuOpen && genreSuggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <ul className="max-h-52 overflow-y-auto py-1">
                {genreSuggestions.map((name, index) => (
                  <li key={name}>
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectGenre(name);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                        index === activeGenreIndex
                          ? "bg-brand-50 text-brand-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <input
          name="publishedYear"
          value={form.publishedYear}
          onChange={changeField}
          placeholder="Year"
          className="w-full rounded-xl border border-slate-200 p-3"
          required
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={changeField}
        placeholder="Description"
        className="w-full rounded-xl border border-slate-200 p-3 min-h-24"
      />

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" checked={form.active} onChange={changeField} />
        Active
      </label>

      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-white font-semibold">
          Save
        </button>
        <button
          type="button"
          className="rounded-lg bg-slate-200 px-4 py-2 text-slate-800 font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
