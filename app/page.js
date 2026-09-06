"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Бүтээгдэхүүн татахад алдаа гарлаа:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ fontFamily: "inherit", color: "var(--color-text)", background: "var(--color-bg)" }}>
      
      {/* 1. Hero Section */}
      <section style={{ 
        textAlign: "center", 
        padding: "80px 20px", 
        background: "var(--color-cream)", 
        borderBottom: "2px solid var(--color-forest)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }}>
        <span style={{ fontSize: "0.9rem", background: "var(--color-sage)", color: "var(--color-forest)", padding: "6px 14px", borderRadius: "20px", fontWeight: "700" }}>
          ✨ Шинэ загварууд болон бэлэн бараанууд
        </span>
        <h1 style={{ fontSize: "3rem", color: "var(--color-forest)", maxWidth: "800px", margin: 0, fontWeight: "800", lineHeight: "1.2" }}>
          Гараар урласан дулаан мэдрэмж Крошет Буланд 🧶
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--color-forest)", opacity: 0.85, maxWidth: "600px", lineHeight: "1.6", margin: 0 }}>
          Өөрийн гараар бүтээх цахим загварууд болон хайр шингэсэн бэлэн сүлжмэл бүтээгдэхүүнүүдийг эндээс сонгоорой.
        </p>
        <div style={{ display: "flex", gap: "15px", marginTop: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/shop" style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "14px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1.1rem" }}>
            Дэлгүүр хэсэх 🛍️
          </Link>
          <Link href="/shop?category=pattern" style={{ background: "transparent", color: "var(--color-forest)", border: "2px solid var(--color-forest)", padding: "14px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1.1rem" }}>
            Загварууд үзэх 📄
          </Link>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section style={{ padding: "60px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ color: "var(--color-forest)", fontSize: "2rem", margin: 0 }}>Онцлох бүтээгдэхүүнүүд ⭐</h2>
          <Link href="/shop" style={{ color: "var(--color-forest)", fontWeight: "700", textDecoration: "underline" }}>
            Бүгдийг харах →
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--color-forest)", fontSize: "1.1rem", padding: "40px 0" }}>Бүтээгдэхүүнийг ачаалж байна... 🧶</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--color-forest)", opacity: 0.8, padding: "40px 0" }}>Одоогоор бүтээгдэхүүн нэмэгдээгүй байна.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
            {products.map((product) => (
              <div key={product._id} style={{ border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "15px", background: "var(--color-bg)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", marginBottom: "12px", background: "rgba(0,0,0,0.05)" }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "var(--color-sage)", color: "var(--color-text)", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                    {product.category === "pattern" ? "Цахим загвар 📄" : "Бэлэн бүтээгдэхүүн 🧶"}
                  </span>
                  <h3 style={{ color: "var(--color-forest)", fontSize: "1.2rem", margin: "10px 0 5px 0" }}>{product.name}</h3>
                  <p style={{ color: "var(--color-forest)", fontWeight: "700", fontSize: "1.1rem" }}>₮{product.price.toLocaleString()}</p>
                </div>
                <Link href={`/shop/${product._id}`} style={{ display: "block", textAlign: "center", background: "var(--color-forest)", color: "var(--color-bg)", padding: "10px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", marginTop: "15px" }}>
                  Дэлгэрэнгүй үзэх 👁️
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Contact Information Section */}
      <section style={{ background: "var(--color-cream)", padding: "60px 20px", borderTop: "2px solid var(--color-forest)", borderBottom: "2px solid var(--color-forest)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "var(--color-forest)", fontSize: "2rem", marginBottom: "15px" }}>Бидэнтэй холбогдох 🪡</h2>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, fontSize: "1.1rem", marginBottom: "30px" }}>
            Асууж тодруулах зүйл байвал эсвэл захиалга өгөхөд тусламж хэрэгтэй бол бидэнтэй холбогдоорой!
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "left" }}>
            <div style={{ background: "var(--color-bg)", padding: "20px", borderRadius: "10px", border: "1px solid var(--color-forest)" }}>
              <h4 style={{ color: "var(--color-forest)", margin: "0 0 8px 0" }}>📍 Хаяг</h4>
              <p style={{ color: "var(--color-forest)", margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>Улаанбаатар хот, Сүхбаатар дүүрэг</p>
            </div>
            <div style={{ background: "var(--color-bg)", padding: "20px", borderRadius: "10px", border: "1px solid var(--color-forest)" }}>
              <h4 style={{ color: "var(--color-forest)", margin: "0 0 8px 0" }}>📧 Имэйл</h4>
              <p style={{ color: "var(--color-forest)", margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>info@crochetcorner.mn</p>
            </div>
            <div style={{ background: "var(--color-bg)", padding: "20px", borderRadius: "10px", border: "1px solid var(--color-forest)" }}>
              <h4 style={{ color: "var(--color-forest)", margin: "0 0 8px 0" }}>📞 Утас</h4>
              <p style={{ color: "var(--color-forest)", margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>+976 9911-9911</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer style={{ padding: "40px 20px", textAlign: "center", background: "var(--color-bg)", color: "var(--color-forest)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>🧶 Нэхмэлийн булан</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "0.95rem" }}>
            Хайр шингээж, гараар урлав. Бүх эрх хуулиар хамгаалагдсан © 2026.
          </p>
          <div style={{ display: "flex", gap: "20px", fontSize: "0.95rem", fontWeight: "600", marginTop: "5px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Нүүр</Link>
            <Link href="/shop" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Дэлгүүр</Link>
            <Link href="/purchases" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Миний захиалгууд</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}