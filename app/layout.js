import "./globals.css";
import Link from "next/link";
import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Enoki.vibes 🧶",
  description: "Гараар урласан сүлжмэл тоглоом, цүнх болон загварууд",
};

export default async function RootLayout({ children }) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="mn">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        </head>
        <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: 0 }}>
          {/* Navigation Bar - Using CSS Grid for Dead-Center Menu */}
          <header style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "20px 40px",
            borderBottom: "2px solid var(--color-forest)",
            background: "var(--color-bg)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            transition: "background-color 0.3s ease, border-color 0.3s ease"
          }}>
            {/* 1. Left Section: Logo */}
            <div style={{ justifySelf: "start" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--color-forest)", fontWeight: "700" }}>
                  Enoki.vibes
                </h2>
              </Link>
            </div>

            {/* 2. Middle Section: Navigation Links (Dead Center) */}
            <nav style={{ display: "flex", alignItems: "center", gap: "25px", fontSize: "1.05rem", fontWeight: "600", justifySelf: "center" }}>
              <Link href="/" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Нүүр</Link>
              <Link href="/shop" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Бүх бараа</Link>
              <Link href="/shop?category=item" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Бүтээгдэхүүн</Link>
              <Link href="/shop?category=pattern" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Загварууд</Link>
              <Link href="/cart" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Сагс</Link>

              {/* My Purchases Feature: Only shows up when user is logged in */}
              {userId && (
                <Link href="/purchases" style={{ color: "var(--color-forest)", textDecoration: "none" }}>
                  Миний захиалгууд
                </Link>
              )}
            </nav>

            {/* 3. Right Section: Auth Actions */}
            <div style={{ display: "flex", alignItems: "center", justifySelf: "end" }}>
              {!userId ? (
                <SignInButton mode="modal">
                  <button style={{
                    background: "var(--color-forest)",
                    color: "var(--color-bg)",
                    border: "1px solid var(--color-forest)",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}>
                    Нэвтрэх
                  </button>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>
          </header>

          <div style={{ flex: 1, background: "var(--color-bg)" }}>
            {children}
          </div>
          <ThemeToggle />
        </body>
      </html>
    </ClerkProvider>
  );
}