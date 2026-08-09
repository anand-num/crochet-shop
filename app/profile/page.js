"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function ProfilePage() {
  const { isSignedIn, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDbUser(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile", err);
        setLoading(false);
      });
  }, [isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <p style={{ color: "var(--color-forest)", fontSize: "1.2rem" }}>Loading your cozy profile... 🧶</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ background: "var(--color-bg)", border: "2px solid var(--color-forest)", borderRadius: "16px", padding: "40px" }}>
          <h1 style={{ color: "var(--color-forest)", fontSize: "2rem", marginBottom: "15px" }}>Sign In Required 🔒</h1>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, marginBottom: "25px" }}>Please sign in to view your profile and downloaded patterns.</p>
          <Link href="/shop" style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700" }}>
            Go to Shop 🛍️
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "10px", textAlign: "center" }}>
        My Crochet Profile 🧶
      </h1>
      <p style={{ color: "var(--color-forest)", opacity: 0.85, textAlign: "center", marginBottom: "40px" }}>
        Welcome back, <strong>{dbUser?.name || "Crafter"}</strong>! Access your digital PDF pattern library below.
      </p>

      <div style={{ background: "var(--color-cream)", border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 12px rgba(56, 102, 65, 0.05)" }}>
        <h2 style={{ color: "var(--color-forest)", fontSize: "1.5rem", marginBottom: "20px" }}>My Downloadable Patterns 📄</h2>

        {dbUser?.purchasedPatterns?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <p style={{ color: "var(--color-forest)", opacity: 0.8, marginBottom: "20px" }}>You haven't purchased any digital crochet patterns yet.</p>
            <Link 
              href="/shop?category=pattern" 
              style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}
            >
              Browse Patterns 📄
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {dbUser.purchasedPatterns.map((pattern, index) => (
              <div 
                key={index} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "#fff", 
                  border: "1px solid var(--color-forest)", 
                  borderRadius: "8px", 
                  padding: "15px 20px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <h4 style={{ color: "var(--color-forest)", fontSize: "1.1rem", margin: "0 0 5px 0" }}>{pattern.name}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-forest)", opacity: 0.7 }}>
                    Purchased on: {new Date(pattern.purchasedAt).toLocaleDateString()}
                  </span>
                </div>
                <a 
                  href={pattern.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    background: "var(--color-forest)", 
                    color: "var(--color-bg)", 
                    padding: "10px 18px", 
                    borderRadius: "6px", 
                    textDecoration: "none", 
                    fontWeight: "600",
                    fontSize: "0.95rem"
                  }}
                >
                  Download PDF 📥
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}