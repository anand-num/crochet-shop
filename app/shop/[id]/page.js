"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        if (data.success) {
          // Find the specific product matching this ID from our list
          const foundProduct = data.data.find((p) => p._id === id);
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Grab existing cart items from localStorage (or start with an empty array)
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product is already in cart
    const existingIndex = existingCart.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show success feedback
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading product details... 🧶</div>;
  }

  if (!product) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Product not found! 😢</div>;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <Link href="/shop" style={{ color: "#2b6cb0", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
        ← Back to Shop
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", background: "#fff", padding: "30px", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: "100%", height: "350px", objectFit: "cover", borderRadius: "8px" }} 
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "15px", color: "#2d3748" }}>{product.name}</h1>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2b6cb0", marginBottom: "20px" }}>
              ${product.price.toFixed(2)}
            </p>
            <p style={{ color: "#4a5568", lineHeight: "1.6", marginBottom: "30px" }}>
              {product.description}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button 
              onClick={handleAddToCart}
              style={{ background: "#2b6cb0", color: "#fff", padding: "12px 20px", borderRadius: "6px", border: "none", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}
            >
              Add to Cart 🛒
            </button>

            <a 
              href={product.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textAlign: "center", background: "#48bb78", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}
            >
              View PDF Pattern 📄
            </a>

            {addedMessage && (
              <p style={{ color: "#38a169", fontWeight: "600", textAlign: "center", margin: "5px 0 0 0" }}>
                ✓ Added to your cart successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}