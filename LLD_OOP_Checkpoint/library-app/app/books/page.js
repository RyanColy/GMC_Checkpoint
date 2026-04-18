"use client";

import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Book } from "../../lib/models/Book";
import { Plus, BookOpen } from "lucide-react";

const FALLBACK_COLORS = [
  "from-violet-600 to-indigo-700",
  "from-blue-600 to-cyan-700",
  "from-emerald-600 to-teal-700",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-600",
  "from-slate-600 to-slate-800",
  "from-fuchsia-500 to-purple-700",
  "from-teal-500 to-cyan-700",
];

function getFallbackColor(id) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_COLORS[n % FALLBACK_COLORS.length];
}

function BookCover({ title, bookId, coverUrl: initialCoverUrl }) {
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl || null);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => setCoverUrl(null);

  const initials = title
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-full aspect-[2/3] overflow-hidden">
      {coverUrl ? (
        <>
          {!loaded && (
            <div className={`absolute inset-0 bg-gradient-to-b ${getFallbackColor(bookId)} animate-pulse`} />
          )}
          <img
            src={coverUrl}
            alt={title}
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      ) : (
        <div className={`w-full h-full bg-gradient-to-b ${getFallbackColor(bookId)} flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500`}>
          <BookOpen size={28} className="text-white/50" strokeWidth={1.5} />
          <span className="text-white/70 text-2xl font-black tracking-wider">{initials}</span>
          <span className="text-white/40 text-[10px] text-center px-3 leading-tight">{author}</span>
        </div>
      )}
    </div>
  );
}

function BookCard({ book }) {
  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative overflow-hidden">
        <BookCover title={book.title} bookId={book.id} coverUrl={book.coverUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${
          book.isAvailable
            ? "bg-emerald-500/90 text-white"
            : "bg-black/50 text-white/80"
        }`}>
          {book.isAvailable ? "Available" : "Borrowed"}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-0.5 flex-1">
        <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
          {book.title}
        </p>
        <p className="text-xs text-slate-400 truncate">{book.author}</p>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const { books, addBook } = useLibrary();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) return;
    addBook(new Book(`b-${Date.now()}`, title, author, cover || null));
    setTitle("");
    setAuthor("");
    setCover("");
    setOpen(false);
  };

  const filtered = books.filter((b) => {
    if (filter === "available") return b.isAvailable;
    if (filter === "borrowed") return !b.isAvailable;
    return true;
  });

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Books</h1>
          <p className="text-xs text-slate-500 mt-0.5">{books.length} titles in catalog</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded-md transition-colors"
        >
          <Plus size={13} />
          Add Book
        </button>
      </header>

      <main className="p-8 flex flex-col gap-5">
        {open && (
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">New Title</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Cover URL (optional)"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              />
              <button className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-md transition-colors">
                Create
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 self-start">
          {[
            { key: "all", label: `All (${books.length})` },
            { key: "available", label: `Available (${books.filter((b) => b.isAvailable).length})` },
            { key: "borrowed", label: `Borrowed (${books.filter((b) => !b.isAvailable).length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === key ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400">No books match this filter.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
