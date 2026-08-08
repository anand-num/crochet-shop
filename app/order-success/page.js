"use client";
import { useSearchParams } from "next/link"; // or standard search params handling
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    // Load last purchased items or clear cart items
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setOrderItems(savedCart);
    // Clear out the cart from storage after successful order
    localStorage.removeItem("cart");
  }, []);

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif", textAlign: "center" }}>
      <div style={{ background: "#f0fff4", border: "1px solid #c6f6d5", padding: "30px", borderRadius: "12px", marginBottom: "30px" }}>
        <h1 style={{ color: "#22543d", marginBottom: "10px" }}>Thank You For Your Order! 🎉</h1>
        <p style={{ color: "#276749", fontSize: "1.1rem" }}>Your payment was successful and your crochet patterns are ready.</p>
      </div>

      <h2 style={{ color: "#333", marginBottom: "20px", textAlign: "left" }}>Your Digital Downloads 📄</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
        {orderItems.map((item) => (
          <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "15px 20px", borderRadius: "8px", border: "1px solid #eaeaea", textAlign: "left" }}>
            <div>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{item.name}</h3>
              <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>Quantity: {item.quantity}</p>
            </div>
            <a 
              href={item.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ background: "#48bb78", color: "#fff", padding: "8px 16px", borderRadius: "5px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}
            >
              Download PDF 📥
            </a>
          </div>
        ))}
      </div>

      <Link 
        href="/shop" 
        style={{ background: "#2b6cb0", color: "#fff", padding: "12px 25px", borderRadius: "6px", textDecoration: "none", fontWeight: "600" }}
      >
        Continue Shopping 🧶
      </Link>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "50px" }}>Loading order details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}