"use client";

import { LibraryProvider } from "../context/LibraryContext";

export default function Providers({ children }) {
  return <LibraryProvider>{children}</LibraryProvider>;
}
