"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category"); // "item" or "pattern"

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  // Filter products based on navigation category selection
  const filteredProducts = categoryFilter 
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  if (loading) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <p style={{ color: "var(--color-forest)", fontSize: "1.2rem" }}>Gathering cozy creations... 🧶</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "10px", textAlign: "center" }}>
        {categoryFilter === "pattern" ? "Crochet Patterns 📄" : categoryFilter === "item" ? "Handmade Items 🧶" : "Our Full Collection 🛍️"}
      </h1>
      <p style={{ color: "var(--color-forest)", opacity: 0.85, textAlign: "center", marginBottom: "40px" }}>
        Explore our handmade plushies, bags, and downloadable crochet guides.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" }}>
        {filteredProducts.map((product) => (
          <div 
            key={product._id} 
            style={{ 
              background: "var(--color-bg)", 
              border: "2px solid var(--color-forest)", 
              borderRadius: "12px", 
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(56, 102, 65, 0.06)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ width: "100%", height: "220px", objectFit: "cover" }} 
            />
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "0.75rem", background: "var(--color-cream)", color: "var(--color-forest)", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", textTransform: "uppercase" }}>
                  {product.category === "pattern" ? "Digital Pattern" : "Physical Item"}
                </span>
                <h3 style={{ color: "var(--color-forest)", fontSize: "1.2rem", margin: "10px 0 5px 0" }}>{product.name}</h3>
                <p style={{ color: "var(--color-forest)", opacity: 0.8, fontSize: "0.95rem", marginBottom: "15px" }}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <Link 
                href={`/shop/${product._id}`}
                style={{ 
                  background: "var(--color-forest)", 
                  color: "var(--color-bg)", 
                  textAlign: "center", 
                  padding: "10px", 
                  borderRadius: "6px", 
                  textDecoration: "none", 
                  fontWeight: "600",
                  display: "block"
                }}
              >
                View Details 👁️
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}