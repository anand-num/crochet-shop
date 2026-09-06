"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <h1 style={{ color: "var(--color-forest)", fontSize: "2.2rem", marginBottom: "15px" }}>Your Cart is Empty 🧶</h1>
        <p style={{ color: "var(--color-forest)", opacity: 0.8, marginBottom: "30px", fontSize: "1.1rem" }}>
          Looks like you haven't added any cozy creations to your cart yet!
        </p>
        <Link
          href="/shop"
          style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "1rem" }}
        >
          Explore the Shop 🛍️
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "30px", textAlign: "center" }}>
        Your Shopping Cart 🛒
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
        {cart.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--color-bg)",
              border: "2px solid var(--color-forest)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(56, 102, 65, 0.05)",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
              />
              <div>
                <h3 style={{ color: "var(--color-forest)", fontSize: "1.2rem", marginBottom: "5px" }}>{item.name}</h3>
                <h3 style={{ color: "var(--color-forest)", fontSize: "1.2rem", marginBottom: "5px" }}>{item.name}</h3>
                {item.category === "pattern" ? (
                  <span style={{ fontSize: "0.8rem", background: "var(--color-cream)", padding: "2px 6px", borderRadius: "4px", color: "var(--color-forest)", fontWeight: "600" }}>Digital Pattern 📄</span>
                ) : (
                  <span style={{ fontSize: "0.8rem", background: "rgba(56, 102, 65, 0.1)", padding: "2px 6px", borderRadius: "4px", color: "var(--color-forest)", fontWeight: "600" }}>Physical Item 🧶</span>
                )}
                <p style={{ color: "var(--color-forest)", fontWeight: "600", marginTop: "5px" }}>${item.price.toFixed(2)}</p>
                <p style={{ color: "var(--color-forest)", fontWeight: "600" }}>${item.price.toFixed(2)}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-forest)", borderRadius: "6px", overflow: "hidden" }}>
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  style={{ background: "transparent", border: "none", padding: "6px 12px", color: "var(--color-forest)", fontWeight: "bold" }}
                >
                  -
                </button>
                <span style={{ padding: "0 10px", color: "var(--color-forest)", fontWeight: "600" }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  style={{ background: "transparent", border: "none", padding: "6px 12px", color: "var(--color-forest)", fontWeight: "bold" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                style={{ background: "var(--color-terracotta)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "600" }}
              >
                Remove 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary Card */}
      <div style={{ background: "var(--color-cream)", border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "30px", textAlign: "right" }}>
        <h2 style={{ color: "var(--color-forest)", fontSize: "1.8rem", marginBottom: "15px" }}>
          Total: ${totalPrice.toFixed(2)}
        </h2>
        <button
          onClick={() => router.push("/checkout")}
          style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "14px 28px", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "700" }}
        >
          Proceed to Checkout 🔒
        </button>
      </div>
    </main>
  );
}