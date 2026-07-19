import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BookmarkProvider } from "../context/BookmarkContext"; // Import your Bookmark system state layer

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevDeck — Developer Workspace Organizer",
  description: "A personalized, web-based developer workspace dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0E14]`}>
        <Providers>
          {/* Nests the Bookmark context natively within the primary client global state providers */}
          <BookmarkProvider>
            {children}
          </BookmarkProvider>
        </Providers>
      </body>
    </html>
  );
}