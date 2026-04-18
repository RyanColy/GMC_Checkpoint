"use client";

import { useLibrary } from "../../context/LibraryContext";
import { AlertTriangle, RefreshCw, X, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, checkOverdue, removeNotification, clearNotifications, transactions } = useLibrary();
  const overdueActive = transactions.filter((t) => t.isOverdue && !t.returnDate);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">{notifications.length} total alerts</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-md transition-colors"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          )}
          <button
            onClick={checkOverdue}
            className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-md transition-colors"
          >
            <RefreshCw size={12} />
            Check Overdue
          </button>
        </div>
      </header>

      <main className="p-8 flex flex-col gap-5">
        {overdueActive.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 flex items-center gap-3">
            <AlertTriangle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">
              {overdueActive.length} book{overdueActive.length > 1 ? "s" : ""} currently overdue and not yet returned.
            </p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">All Alerts</h2>
            <span className="text-xs text-slate-400">{notifications.length} entries</span>
          </div>

          {notifications.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-slate-400">No alerts yet. Click "Check Overdue" to scan for late returns.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...notifications].reverse().map((msg, i) => {
                const realIndex = notifications.length - 1 - i;
                return (
                  <div key={i} className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <AlertTriangle size={10} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{msg}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(realIndex)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-all"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
