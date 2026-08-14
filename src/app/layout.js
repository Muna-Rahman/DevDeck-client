import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BookmarkProvider } from "../context/BookmarkContext";
import FontInitializer from "@/components/FontInitializer";

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

// Runs before React hydrates so the correct theme class is on <html> for the
// very first paint — this is what actually prevents the light/dark flash and
// the "resets to dark on every navigation" bug.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('devdeck_theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAF9F6] dark:bg-[#07090E] transition-colors duration-300`}>
        <FontInitializer />
        <Providers>
          <BookmarkProvider>
            {children}
          </BookmarkProvider>
        </Providers>
      </body>
    </html>
  );
}