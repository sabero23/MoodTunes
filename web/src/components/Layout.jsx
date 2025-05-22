// src/components/Layout.jsx
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* pt-16 = espai perquè no quedi sota el header (h-16) */}
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}
