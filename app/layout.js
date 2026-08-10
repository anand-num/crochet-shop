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
        <body>
          {/* Navigation Bar */}
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px",
            borderBottom: "2px solid var(--color-forest)",
            background: "var(--color-bg)",
            position: "sticky",
            top: 0,
            zIndex: 100
          }}>
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--color-forest)", fontWeight: "700" }}>
              🧶 Crochet Corner
            </h2>
            <nav style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "1.05rem", fontWeight: "600" }}>
              <Link href="/" style={{ color: "var(--color-forest)" }}>Home</Link>
              <Link href="/shop" style={{ color: "var(--color-forest)" }}>All Shop</Link>
              <Link href="/shop?category=item" style={{ color: "var(--color-forest)" }}>Items </Link>
              <Link href="/shop?category=pattern" style={{ color: "var(--color-forest)" }}>Patterns</Link>
              <Link href="/cart" style={{ color: "var(--color-forest)" }}>Cart</Link>

              {/* My Patterns Feature: Only shows up when user is logged in */}
              {userId && (
                <Link href="/profile" style={{ color: "var(--color-forest)" }}>
                  My Patterns
                </Link>
              )}

              {/* Cleaned up Auth Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "15px" }}>
                {!userId ? (
                  <SignInButton mode="modal">
                    <button style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "8px 18px", borderRadius: "8px", fontWeight: "600" }}>
                      Sign In
                    </button>
                  </SignInButton>
                ) : (
                  <UserButton />
                )}
              </div>
            </nav>
          </header>

          <div style={{ flex: 1, background: "var(--color-bg)" }}>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}