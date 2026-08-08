"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading your crochet shop... 🧶</div>;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Welcome to My Crochet Shop 🧵</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
        {products.map((product) => (
          <Link 
            key={product._id} 
            href={`/shop/${product._id}`} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.05)", background: "#fff", cursor: "pointer", transition: "transform 0.2s" }}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} 
              />
              <h2 style={{ fontSize: "1.25rem", margin: "15px 0 10px 0" }}>{product.name}</h2>
              <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>{product.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#2b6cb0" }}>${product.price.toFixed(2)}</span>
                <span style={{ color: "#48bb78", fontSize: "0.9rem", fontWeight: "600" }}>View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}