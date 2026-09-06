"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function PurchasesPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/orders?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch purchases:", err);
          setLoading(false);
        });
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", color: "var(--color-forest)" }}>
        <h2>Loading your cozy purchases... 🧶</h2>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ color: "var(--color-forest)", marginBottom: "15px" }}>Please Sign In</h2>
        <p style={{ color: "var(--color-forest)", opacity: 0.8, marginBottom: "20px" }}>You need to be signed in to view your purchases.</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ color: "var(--color-forest)", fontSize: "2.2rem", marginBottom: "15px" }}>No Purchases Yet 🧵</h1>
        <p style={{ color: "var(--color-forest)", opacity: 0.8, marginBottom: "30px", fontSize: "1.1rem" }}>
          You haven't bought any items or patterns yet!
        </p>
        <Link 
          href="/shop" 
          style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}
        >
          Explore the Shop 🛍️
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "30px", textAlign: "center" }}>
        My Purchases 📦
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {orders.map((order) => (
          <div 
            key={order._id}
            style={{ 
              background: "var(--color-bg)", 
              border: "2px solid var(--color-forest)", 
              borderRadius: "12px", 
              padding: "20px",
              boxShadow: "0 4px 10px rgba(56, 102, 65, 0.05)"
            }}
          >
            {/* Order Header info */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid rgba(56, 102, 65, 0.2)", paddingBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--color-forest)", opacity: 0.8 }}>
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span style={{ fontWeight: "700", color: "var(--color-forest)" }}>
                Total: ${order.totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Items inside the order */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    flexWrap: "wrap", 
                    gap: "15px",
                    background: "rgba(56, 102, 65, 0.03)",
                    padding: "12px",
                    borderRadius: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }} 
                    />
                    <div>
                      <h4 style={{ color: "var(--color-forest)", fontSize: "1.1rem", marginBottom: "4px" }}>{item.name}</h4>
                      <p style={{ fontSize: "0.9rem", color: "var(--color-forest)", opacity: 0.8, marginBottom: "4px" }}>
                        Qty: {item.quantity} | Price: ${item.price}
                      </p>
                      
                      {/* Badge & Status handling */}
                      {item.category === "pattern" ? (
                        <span style={{ fontSize: "0.75rem", background: "var(--color-cream)", color: "var(--color-forest)", padding: "2px 6px", borderRadius: "4px", fontWeight: "600", border: "1px solid var(--color-forest)" }}>
                          Digital Pattern 📄
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "var(--color-forest)", fontWeight: "700" }}>
                          Status: {order.status || "Making 🧶"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Download PDF if pattern, otherwise subtotal */}
                  {item.category === "pattern" ? (
                    <a 
                      href={item.pdfUrl} 
                      download 
                      style={{ 
                        background: "var(--color-forest)", 
                        color: "var(--color-bg)", 
                        padding: "8px 16px", 
                        borderRadius: "6px", 
                        textDecoration: "none", 
                        fontWeight: "600", 
                        fontSize: "0.9rem" 
                      }}
                    >
                      Download PDF 📥
                    </a>
                  ) : (
                    <span style={{ fontWeight: "700", color: "var(--color-forest)" }}>
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}