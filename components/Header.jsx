"use client";
import { useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Header({ userId }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 25px",
      borderBottom: "2px solid var(--color-forest)",
      background: "var(--color-bg)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* 1. Logo Section */}
      <div>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h2 style={{ margin: 0, fontSize: "1.4rem", color: "var(--color-forest)", fontWeight: "700" }}>
            Enoki.vibes 🧶
          </h2>
        </Link>
      </div>

      {/* 2. Desktop Navigation Links */}
      <nav className="desktop-nav" style={{ alignItems: "center", gap: "20px", fontSize: "1rem", fontWeight: "600" }}>
        <Link href="/" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Нүүр</Link>
        <Link href="/shop" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Бүх бараа</Link>
        <Link href="/shop?category=item" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Бүтээгдэхүүн</Link>
        <Link href="/shop?category=pattern" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Загварууд</Link>
        <Link href="/cart" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Сагс 🛒</Link>
        {userId && (
          <Link href="/purchases" style={{ color: "var(--color-forest)", textDecoration: "none" }}>
            Миний захиалгууд 📦
          </Link>
        )}
      </nav>

      {/* 3. Right Section: Auth & Hamburger Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {!userId ? (
          <SignInButton mode="modal">
            <button style={{
              background: "var(--color-forest)",
              color: "var(--color-bg)",
              border: "1px solid var(--color-forest)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit"
            }}>
              Нэвтрэх
            </button>
          </SignInButton>
        ) : (
          <UserButton />
        )}

        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "transparent",
            border: "2px solid var(--color-forest)",
            color: "var(--color-forest)",
            fontSize: "1.2rem",
            padding: "6px 10px",
            borderRadius: "8px",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Slide-out Drawer Panel (Right to Left) */}
      {isOpen && (
        <div 
          onClick={closeMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 999,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "280px",
              height: "100%",
              backgroundColor: "var(--color-bg)",
              borderLeft: "2px solid var(--color-forest)",
              padding: "30px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
              animation: "slideInRight 0.3s ease-out",
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-forest)", paddingBottom: "15px" }}>
              <h3 style={{ margin: 0, color: "var(--color-forest)" }}>Цэс 🧶</h3>
              <button 
                onClick={closeMenu}
                style={{ background: "transparent", border: "none", fontSize: "1.3rem", color: "var(--color-forest)", cursor: "pointer", fontWeight: "bold" }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Links */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "1.1rem", fontWeight: "600" }}>
              <Link href="/" onClick={closeMenu} style={{ color: "var(--color-forest)", textDecoration: "none" }}>Нүүр</Link>
              <Link href="/shop" onClick={closeMenu} style={{ color: "var(--color-forest)", textDecoration: "none" }}>Бүх бараа</Link>
              <Link href="/shop?category=item" onClick={closeMenu} style={{ color: "var(--color-forest)", textDecoration: "none" }}>Бүтээгдэхүүн</Link>
              <Link href="/shop?category=pattern" onClick={closeMenu} style={{ color: "var(--color-forest)", textDecoration: "none" }}>Загварууд</Link>
              <Link href="/cart" onClick={closeMenu} style={{ color: "var(--color-forest)", textDecoration: "none" }}>Сагс 🛒</Link>
              {userId && (
                <Link href="/purchases" onClick={closeMenu} style={{ color: "var(--color-forest)", textDecoration: "none" }}>
                  Миний захиалгууд 📦
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}