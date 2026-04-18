import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ryan Coly — Full Stack Developer",
  description: "Portfolio of Ryan Coly, Full Stack Developer specializing in React, Next.js and Node.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-900">
          <span className="text-slate-500">Built with</span>{" "}
          <span className="text-indigo-500 font-medium">Next.js</span>{" "}
          <span className="text-slate-500">by Teddy Steve Ryan Coly — {new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}
