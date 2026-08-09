"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.data.find((p) => p._id === id);
          setProduct(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load product", err);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      return newQty > 0 ? newQty : 1;
    });
  };

  const addToCart = () => {
    if (!product) return;

    // Patterns are always quantity = 1
    const qtyToAdd = product.category === "pattern" ? 1 : quantity;

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      if (product.category !== "pattern") {
        existingCart[existingIndex].quantity += qtyToAdd;
      }
      // If it's a pattern and already in cart, keep it at 1
    } else {
      existingCart.push({ ...product, quantity: qtyToAdd });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const buyNow = () => {
    if (!product) return;

    const qtyToAdd = product.category === "pattern" ? 1 : quantity;

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      if (product.category !== "pattern") {
        existingCart[existingIndex].quantity += qtyToAdd;
      }
    } else {
      existingCart.push({ ...product, quantity: qtyToAdd });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <p style={{ color: "var(--color-forest)", fontSize: "1.2rem" }}>Loading cozy details... 🧶</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <h1 style={{ color: "var(--color-forest)", fontSize: "2rem", marginBottom: "15px" }}>Product Not Found</h1>
        <Link href="/shop" style={{ color: "var(--color-forest)", fontWeight: "600", textDecoration: "underline" }}>
          Back to Shop 🛍️
        </Link>
      </main>
    );
  }

  const isPattern = product.category === "pattern";

  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "inherit" }}>
      <Link 
        href="/shop" 
        style={{ color: "var(--color-forest)", textDecoration: "none", fontWeight: "600", display: "inline-block", marginBottom: "25px" }}
      >
        ← Back to Shop
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start", flexWrap: "wrap" }}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          style={{ width: "100%", height: "350px", objectFit: "cover", borderRadius: "12px", border: "2px solid var(--color-forest)" }} 
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <span style={{ fontSize: "0.75rem", background: "var(--color-cream)", color: "var(--color-forest)", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", textTransform: "uppercase", width: "fit-content" }}>
            {isPattern ? "Digital Pattern 📄" : "Physical Item 🧶"}
          </span>

          <h1 style={{ color: "var(--color-forest)", fontSize: "2.2rem", margin: 0 }}>{product.name}</h1>
          <p style={{ color: "var(--color-forest)", fontSize: "1.4rem", fontWeight: "700" }}>${product.price.toFixed(2)}</p>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, lineHeight: "1.6" }}>{product.description}</p>

          {/* Conditional Quantity Selector: ONLY show if it's a physical item */}
          {!isPattern ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "10px" }}>
              <span style={{ color: "var(--color-forest)", fontWeight: "600" }}>Quantity:</span>
              <div style={{ display: "flex", alignItems: "center", border: "2px solid var(--color-forest)", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  style={{ background: "transparent", border: "none", padding: "8px 16px", color: "var(--color-forest)", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }}
                >
                  -
                </button>
                <span style={{ padding: "0 14px", color: "var(--color-forest)", fontWeight: "700", fontSize: "1.1rem" }}>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  style={{ background: "transparent", border: "none", padding: "8px 16px", color: "var(--color-forest)", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: "var(--color-cream)", padding: "10px 14px", borderRadius: "8px", border: "1px dashed var(--color-forest)", fontSize: "0.9rem", color: "var(--color-forest)" }}>
              📄 Instant Digital Download (PDF sent to your profile inventory upon purchase)
            </div>
          )}

          {/* Action Buttons Container */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            <button 
              onClick={addToCart}
              style={{ 
                background: added ? "var(--color-sage)" : "var(--color-forest)", 
                color: "var(--color-bg)", 
                border: "none", 
                padding: "14px", 
                borderRadius: "8px", 
                fontWeight: "700", 
                fontSize: "1.1rem", 
                cursor: "pointer", 
                transition: "background 0.2s"
              }}
            >
              {added ? "Added to Cart! ✅" : isPattern ? "Add Pattern to Cart 🛒" : `Add to Cart (${quantity}) 🛒`}
            </button>

            <button 
              onClick={buyNow}
              style={{ 
                background: "var(--color-cream)", 
                color: "var(--color-forest)", 
                border: "2px solid var(--color-forest)", 
                padding: "14px", 
                borderRadius: "8px", 
                fontWeight: "700", 
                fontSize: "1.1rem", 
                cursor: "pointer",
                transition: "opacity 0.2s"
              }}
            >
              {isPattern ? "Buy Pattern Now ⚡" : "Buy It Now ⚡"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}