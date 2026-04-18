"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLibrary } from "../context/LibraryContext";
import { LayoutDashboard, Users, BookOpen, BookMarked, Bell } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/borrows", label: "Borrows", icon: BookMarked },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export default function Navbar() {
  const pathname = usePathname();
  const { notifications } = useLibrary();

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-slate-900 flex flex-col border-r border-slate-800">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center">
            <BookOpen size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white text-sm font-semibold tracking-tight">LibraryOS</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const hasAlert = href === "/notifications" && notifications.length > 0;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1">{label}</span>
              {hasAlert && (
                <span className="text-[10px] font-semibold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">Admin</p>
            <p className="text-[10px] text-slate-500 truncate">admin@library.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
