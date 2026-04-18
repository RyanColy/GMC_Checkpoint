import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Library Management System",
  description: "OOP Design Patterns with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen flex bg-gray-50">
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
