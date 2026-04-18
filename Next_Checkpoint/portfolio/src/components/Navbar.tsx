"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Empêche le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(5, 5, 15, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(30, 30, 58, 0.8)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #c084fc)" }}
          >
            R
          </span>
          <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
            Ryan<span className="text-indigo-400">.dev</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link focus-ring px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "active text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="ml-3">
            <Link
              href="/contact"
              className="focus-ring px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Hire me
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg transition-colors hover:bg-white/5"
        >
          <span
            className="block h-0.5 w-5 bg-slate-300 rounded transition-all duration-300"
            style={{ transform: open ? "translateY(8px) rotate(45deg)" : "translateY(0) rotate(0deg)" }}
          />
          <span
            className="block h-0.5 w-5 bg-slate-300 rounded transition-all duration-300"
            style={{ opacity: open ? 0 : 1, transform: "translateY(0)" }}
          />
          <span
            className="block h-0.5 w-5 bg-slate-300 rounded transition-all duration-300"
            style={{ transform: open ? "translateY(-8px) rotate(-45deg)" : "translateY(0) rotate(0deg)" }}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0px" }}
      >
        <div
          className="px-6 pb-6 pt-2 flex flex-col gap-1 border-t"
          style={{ borderColor: "rgba(30, 30, 58, 0.8)" }}
        >
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-900/40 text-white border border-indigo-700/50"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-white text-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Hire me
          </Link>
        </div>
      </div>
    </nav>
  );
}
