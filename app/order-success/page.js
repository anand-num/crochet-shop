"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setOrderItems(savedCart);
    localStorage.removeItem("cart");
  }, []);

  return (
    <main style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "inherit", textAlign: "center", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div style={{ background: "var(--color-cream)", border: "1px solid var(--color-forest)", padding: "30px", borderRadius: "12px", marginBottom: "30px" }}>
        <h1 style={{ color: "var(--color-forest)", marginBottom: "10px", fontSize: "2rem" }}>Захиалга өгсөнд баярлалаа!</h1>
        <p style={{ color: "var(--color-forest)", fontSize: "1.1rem", margin: 0 }}>Таны төлбөр амжилттай хийгдэж, сүлжмэлийн загварууд бэлэн боллоо.</p>
      </div>

      <h2 style={{ color: "var(--color-forest)", marginBottom: "20px", textAlign: "left" }}>Татаж авах цахим загварууд</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
        {orderItems.map((item) => (
          <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-bg)", padding: "15px 20px", borderRadius: "8px", border: "1px solid var(--color-forest)", textAlign: "left" }}>
            <div>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "var(--color-forest)" }}>{item.name}</h3>
              <p style={{ margin: 0, color: "var(--color-text)", opacity: 0.8, fontSize: "0.85rem" }}>Тоо ширхэг: {item.quantity}</p>
            </div>
            <a 
              href={item.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", border: "1px solid var(--color-forest)" }}
            >
              PDF татаж авах
            </a>
          </div>
        ))}
      </div>

      <Link 
        href="/shop" 
        style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "12px 25px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", display: "inline-block", border: "1px solid var(--color-forest)" }}
      >
        Үргэлжлүүлэн дэлгүүр хэсэх
      </Link>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "50px", color: "var(--color-forest)" }}>Дэлгэрэнгүй мэдээлэлийг ачаалж байна...</div>}>
      <SuccessContent />
    </Suspense>
  );
}