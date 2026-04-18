"use client";

import { useLibrary } from "../context/LibraryContext";
import { Users, BookOpen, BookMarked, AlertTriangle } from "lucide-react";

function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        <Icon size={15} className="text-slate-400" />
      </div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
    </div>
  );
}

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

export default function Dashboard() {
  const { users, books, transactions, notifications } = useLibrary();

  const activeBorrows = transactions.filter((t) => !t.returnDate);
  const overdueCount = transactions.filter((t) => t.isOverdue && !t.returnDate).length;
  const availableBooks = books.filter((b) => b.isAvailable).length;
  const recent = [...transactions].slice(-6).reverse();

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <h1 className="text-sm font-semibold text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Library system overview</p>
      </header>

      <main className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={users.length} icon={Users} trend={`${users.filter(u => u.getRole() === "Student").length} students · ${users.filter(u => u.getRole() === "Teacher").length} teachers`} />
          <StatCard label="Total Books" value={books.length} icon={BookOpen} trend={`${availableBooks} available · ${books.length - availableBooks} borrowed`} />
          <StatCard label="Active Borrows" value={activeBorrows.length} icon={BookMarked} trend="Currently checked out" />
          <StatCard label="Overdue" value={overdueCount} icon={AlertTriangle} trend={overdueCount > 0 ? "Requires attention" : "All on time"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Book</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">User</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Due</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t) => {
                  const status = t.returnDate ? "returned" : t.isOverdue ? "overdue" : "active";
                  return (
                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-slate-900 font-medium max-w-[160px] truncate">{t.book.title}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{t.user.name}</td>
                      <td className="px-5 py-3 text-xs text-slate-500">{t.dueDate.toLocaleDateString("en-GB")}</td>
                      <td className="px-5 py-3"><Badge status={status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Book Availability</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Available</span>
                  <span>{availableBooks} / {books.length}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: books.length ? `${(availableBooks / books.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400">No notifications.</p>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-600 mb-1">Recent alerts</p>
                    {notifications.slice(-4).reverse().map((msg, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                        <AlertTriangle size={11} className="text-red-500 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{msg}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
