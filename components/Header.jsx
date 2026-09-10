"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton } from "@clerk/nextjs";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    borderBottom: "2px solid var(--color-forest)",
    background: "var(--color-bg)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  logoContainer: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoTitle: {
    margin: 0,
    fontSize: "1.4rem",
    color: "var(--color-forest)",
    fontWeight: "700",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "1rem",
    fontWeight: "600",
  },
  navLink: {
    color: "var(--color-forest)",
    textDecoration: "none",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  signInButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    border: "1px solid var(--color-forest)",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  mobileMenuBtn: {
    background: "transparent",
    border: "2px solid var(--color-forest)",
    color: "var(--color-forest)",
    fontSize: "1.2rem",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 999,
    display: "flex",
    justifyContent: "flex-end",
  },
  drawer: {
    width: "280px",
    height: "100%",
    backgroundColor: "var(--color-bg)",
    borderLeft: "2px solid var(--color-forest)",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--color-forest)",
    paddingBottom: "15px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "1.3rem",
    color: "var(--color-forest)",
    cursor: "pointer",
    fontWeight: "bold",
  },
  drawerNav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
};

export default function Header({ userId }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header style={styles.header}>
      {/* 1. Logo & Name Section */}
      <div>
        <Link href="/" style={styles.logoContainer}>
          <Image 
            src="/enoki_logo.png" 
            alt="Enoki.vibes Logo" 
            width={35} 
            height={35} 
            style={{ objectFit: "contain" }}
            priority 
          />
          <h2 style={styles.logoTitle}>
            Enoki.vibes 
          </h2>
        </Link>
      </div>

      {/* 2. Desktop Navigation Links */}
      <nav className="desktop-nav" style={styles.desktopNav}>
        <Link href="/" style={styles.navLink}>Нүүр</Link>
        <Link href="/shop" style={styles.navLink}>Бүх бараа</Link>
        <Link href="/shop?category=item" style={styles.navLink}>Бүтээгдэхүүн</Link>
        <Link href="/shop?category=pattern" style={styles.navLink}>Загварууд</Link>
        <Link href="/cart" style={styles.navLink}>Сагс</Link>
        {userId && (
          <Link href="/purchases" style={styles.navLink}>
            Миний захиалгууд 
          </Link>
        )}
      </nav>

      {/* 3. Right Section: Auth & Hamburger Button */}
      <div style={styles.rightSection}>
        {!userId ? (
          <SignInButton mode="modal">
            <button style={styles.signInButton}>
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
          style={styles.mobileMenuBtn}
          aria-label="Menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Slide-out Drawer Panel (Right to Left) */}
      {isOpen && (
        <div 
          onClick={closeMenu}
          style={styles.overlay}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={styles.drawer}
          >
            {/* Drawer Header */}
            <div style={styles.drawerHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image 
                  src="/enoki_logo.png" 
                  alt="Enoki.vibes Logo" 
                  width={28} 
                  height={28} 
                  style={{ objectFit: "contain" }}
                />
                <h3 style={{ margin: 0, color: "var(--color-forest)" }}>Enoki.vibes</h3>
              </div>
              <button 
                onClick={closeMenu}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            {/* Drawer Links */}
            <nav style={styles.drawerNav}>
              <Link href="/" onClick={closeMenu} style={styles.navLink}>Нүүр</Link>
              <Link href="/shop" onClick={closeMenu} style={styles.navLink}>Бүх бараа</Link>
              <Link href="/shop?category=item" onClick={closeMenu} style={styles.navLink}>Бүтээгдэхүүн</Link>
              <Link href="/shop?category=pattern" onClick={closeMenu} style={styles.navLink}>Загварууд</Link>
              <Link href="/cart" onClick={closeMenu} style={styles.navLink}>Сагс</Link>
              {userId && (
                <Link href="/purchases" onClick={closeMenu} style={styles.navLink}>
                  Миний захиалгууд 
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}