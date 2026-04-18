"use client";

import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Plus, RotateCcw } from "lucide-react";

function Badge({ status }) {
  const styles = {
    overdue: "bg-red-50 text-red-700 ring-1 ring-red-200",
    active: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    returned: "bg-green-50 text-green-700 ring-1 ring-green-200",
  };
  const labels = { overdue: "Overdue", active: "Active", returned: "Returned" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function BorrowsPage() {
  const { users, books, transactions, borrowBook, returnBook } = useLibrary();
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("active");

  const availableBooks = books.filter((b) => b.isAvailable);
  const active = transactions.filter((t) => !t.returnDate);
  const history = transactions.filter((t) => t.returnDate);
  const displayed = tab === "active" ? active : history;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !bookId) return;
    borrowBook(userId, bookId, 14);
    setUserId("");
    setBookId("");
    setOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Borrows</h1>
          <p className="text-xs text-slate-500 mt-0.5">{active.length} active · {history.length} returned</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded-md transition-colors"
        >
          <Plus size={13} />
          New Borrow
        </button>
      </header>

      <main className="p-8 flex flex-col gap-5">
        {open && (
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">New Borrow — 14 days</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select a user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} · {u.getRole()}</option>
                ))}
              </select>
              <select
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              >
                <option value="">Select a book</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
              <button className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-md transition-colors">
                Confirm
              </button>
            </form>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-0 border-b border-slate-100 px-5">
            {["active", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors capitalize ${
                  tab === t
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {t === "active" ? `Active (${active.length})` : `History (${history.length})`}
              </button>
            ))}
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Book</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Borrowed</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Due</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                {tab === "active" && <th className="px-5 py-3" />}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                displayed.map((t) => {
                  const status = t.returnDate ? "returned" : t.isOverdue ? "overdue" : "active";
                  return (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900 max-w-[180px] truncate">{t.book.title}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{t.user.name}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{t.borrowDate.toLocaleDateString("en-GB")}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{t.dueDate.toLocaleDateString("en-GB")}</td>
                      <td className="px-5 py-3.5"><Badge status={status} /></td>
                      {tab === "active" && (
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => returnBook(t.id)}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors ml-auto"
                          >
                            <RotateCcw size={12} />
                            Return
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
