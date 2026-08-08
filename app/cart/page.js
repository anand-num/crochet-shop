"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage when the page mounts
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    setLoading(false);
  }, []);

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect to success page
        window.location.href = "/order-success";
      } else {
        alert("Checkout failed: " + data.error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
    }
  };
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading your cart... 🛒</div>;
  }

  if (cart.length === 0) {
    return (
      <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif", textAlign: "center" }}>
        <h1 style={{ color: "#333", marginBottom: "20px" }}>Your Shopping Cart 🛒</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>Your cart is currently empty. Head over to the shop to find some cute patterns!</p>
        <Link 
          href="/shop" 
          style={{ background: "#2b6cb0", color: "#fff", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}
        >
          Browse Shop 🧶
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333", marginBottom: "25px" }}>Your Shopping Cart 🛒</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
        {cart.map((item) => (
          <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "15px 20px", borderRadius: "8px", border: "1px solid #eaeaea", boxShadow: "0 2px 5px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{item.name}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Price: ${item.price.toFixed(2)} | Qty: {item.quantity}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontWeight: "bold", color: "#2b6cb0" }}>${(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => handleRemoveItem(item._id)}
                style={{ background: "#e53e3e", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary Box */}
      <div style={{ background: "#f7fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>Total: ${totalPrice.toFixed(2)}</h2>
          <p style={{ margin: 0, color: "#718096", fontSize: "0.85rem" }}>Taxes and digital pattern delivery included.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={handleClearCart}
            style={{ background: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }}
          >
            Clear Cart
          </button>
          <button 
            onClick={handleCheckout}
            style={{ background: "#48bb78", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }}
          >
            Proceed to Checkout 🚀
          </button>
        </div>
      </div>
    </main>
  );
}