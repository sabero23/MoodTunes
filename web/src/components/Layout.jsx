// src/components/Layout.jsx
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}
