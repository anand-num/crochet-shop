import "./globals.css";
import Link from "next/link";
import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Crochet Corner 🧶",
  description: "Handmade crochet plushies, bags, and patterns",
};

export default async function RootLayout({ children }) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        </head>
        <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: 0 }}>
          {/* Navigation Bar */}
          <header style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "20px 40px",
            borderBottom: "2px solid var(--color-forest)",
            background: "var(--color-bg)",
            position: "sticky",
            top: 0,
            zIndex: 100
          }}>
            {/* 1. Left Section: Logo */}
            <div style={{ justifySelf: "start" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--color-forest)", fontWeight: "700" }}>
                🧶 Crochet Corner
              </h2>
            </div>

            {/* 2. Middle Section: Navigation Links (Dead Center) */}
            <nav style={{ display: "flex", alignItems: "center", gap: "25px", fontSize: "1.05rem", fontWeight: "600", justifySelf: "center" }}>
              <Link href="/" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Home</Link>
              <Link href="/shop" style={{ color: "var(--color-forest)", textDecoration: "none" }}>All Shop</Link>
              <Link href="/shop?category=item" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Items</Link>
              <Link href="/shop?category=pattern" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Patterns</Link>
              <Link href="/cart" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Cart</Link>

              {/* My Patterns Feature: Only shows up when user is logged in */}
              {userId && (
                <Link href="/profile" style={{ color: "var(--color-forest)", textDecoration: "none" }}>
                  My Patterns
                </Link>
              )}
            </nav>

            {/* 3. Right Section: Auth Actions */}
            <div style={{ display: "flex", alignItems: "center", justifySelf: "end" }}>
              {!userId ? (
                <SignInButton mode="modal">
                  <button style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                    Sign In
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
        </body>
      </html>
    </ClerkProvider>
  );
}