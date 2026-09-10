"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const styles = {
  main: {
    fontFamily: "inherit",
    color: "var(--color-text)",
    background: "var(--color-bg)",
  },
  heroSection: {
    textAlign: "center",
    padding: "80px 20px",
    background: "var(--color-cream)",
    borderBottom: "2px solid var(--color-forest)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  heroBadge: {
    fontSize: "0.9rem",
    background: "var(--color-sage)",
    color: "var(--color-forest)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: "3rem",
    color: "var(--color-forest)",
    maxWidth: "800px",
    margin: 0,
    fontWeight: "800",
    lineHeight: "1.2",
  },
  heroDescription: {
    fontSize: "1.2rem",
    color: "var(--color-forest)",
    opacity: 0.85,
    maxWidth: "600px",
    lineHeight: "1.6",
    margin: 0,
  },
  heroButtons: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
  outlineButton: {
    background: "transparent",
    color: "var(--color-forest)",
    border: "2px solid var(--color-forest)",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
  sectionContainer: {
    padding: "60px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "10px",
  },
  sectionTitle: {
    color: "var(--color-forest)",
    fontSize: "2rem",
    margin: 0,
  },
  viewAllLink: {
    color: "var(--color-forest)",
    fontWeight: "700",
    textDecoration: "underline",
  },
  messageText: {
    textAlign: "center",
    color: "var(--color-forest)",
    fontSize: "1.1rem",
    padding: "40px 0",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "25px",
  },
  productCard: {
    border: "1px solid var(--color-forest)",
    borderRadius: "12px",
    padding: "15px",
    background: "var(--color-bg)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "100%",
    height: "200px",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "12px",
    background: "rgba(0,0,0,0.05)",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productBadge: {
    fontSize: "0.75rem",
    background: "var(--color-sage)",
    color: "var(--color-text)",
    padding: "2px 8px",
    borderRadius: "4px",
    fontWeight: "700",
  },
  productTitle: {
    color: "var(--color-forest)",
    fontSize: "1.2rem",
    margin: "10px 0 5px 0",
  },
  productPrice: {
    color: "var(--color-forest)",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
  detailButton: {
    display: "block",
    textAlign: "center",
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "10px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    marginTop: "15px",
  },
  contactSection: {
    background: "var(--color-cream)",
    padding: "60px 20px",
    border: "1px solid var(--color-forest)",
  },
  contactContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    textAlign: "left",
  },
  contactCard: {
    background: "var(--color-bg)",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid var(--color-forest)",
  },
  footer: {
    padding: "40px 20px",
    textAlign: "center",
    background: "var(--color-bg)",
    color: "var(--color-forest)",
  },
  footerInner: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  footerLinks: {
    display: "flex",
    gap: "20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginTop: "5px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

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
    <main style={styles.main}>
      {/* 1. Hero Section */}
      <section style={styles.heroSection}>
        <span style={styles.heroBadge}>
          Шинэ загварууд болон бэлэн бараанууд
        </span>
        <h1 style={styles.heroTitle}>
          Гараар урласан нэхмэл бүтээгдэхүүн болон цахим загваруудыг эндээс олж аваарай.
        </h1>
        <p style={styles.heroDescription}>
          Өөрийн гараар бүтээх цахим загварууд болон хайр шингэсэн бэлэн сүлжмэл бүтээгдэхүүнүүдийг эндээс сонгоорой.
        </p>
        <div style={styles.heroButtons}>
          <Link href="/shop" style={styles.primaryButton}>
            Дэлгүүр хэсэх 
          </Link>
          <Link href="/shop?category=pattern" style={styles.outlineButton}>
            Загварууд үзэх 
          </Link>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Онцлох бүтээгдэхүүнүүд</h2>
          <Link href="/shop" style={styles.viewAllLink}>
            Бүгдийг харах →
          </Link>
        </div>

        {loading ? (
          <p style={styles.messageText}>Бүтээгдэхүүнийг ачаалж байна...</p>
        ) : products.length === 0 ? (
          <p style={{ ...styles.messageText, opacity: 0.8 }}>Одоогоор бүтээгдэхүүн нэмэгдээгүй байна.</p>
        ) : (
          <div style={styles.productGrid}>
            {products.map((product) => (
              <div className="product-card" key={product._id} style={styles.productCard}>
                <div>
                  <div style={styles.imageWrapper}>
                    <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
                  </div>
                  <span style={styles.productBadge}>
                    {product.category === "pattern" ? "Цахим загвар" : "Бэлэн бүтээгдэхүүн"}
                  </span>
                  <h3 style={styles.productTitle}>{product.name}</h3>
                  <p style={styles.productPrice}>₮{product.price.toLocaleString()}</p>
                </div>
                <Link href={`/shop/${product._id}`} style={styles.detailButton}>
                  Дэлгэрэнгүй
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Contact Information Section */}
      <section style={styles.contactSection}>
        <div style={styles.contactContent}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: "15px" }}>Бидэнтэй холбогдох</h2>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, fontSize: "1.1rem", marginBottom: "30px" }}>
            Асууж тодруулах зүйл байвал эсвэл захиалга өгөхөд тусламж хэрэгтэй бол бидэнтэй холбогдоорой!
          </p>
          <div style={styles.contactGrid}>
            <div style={styles.contactCard}>
              <h4 style={{ color: "var(--color-forest)", margin: "0 0 8px 0" }}>Хаяг</h4>
              <p style={{ color: "var(--color-forest)", margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>Улаанбаатар хот, Сүхбаатар дүүрэг</p>
            </div>
            <div style={styles.contactCard}>
              <h4 style={{ color: "var(--color-forest)", margin: "0 0 8px 0" }}>Имэйл</h4>
              <p style={{ color: "var(--color-forest)", margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>info@crochetcorner.mn</p>
            </div>
            <div style={styles.contactCard}>
              <h4 style={{ color: "var(--color-forest)", margin: "0 0 8px 0" }}>Утас</h4>
              <p style={{ color: "var(--color-forest)", margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>+976 9911-9911</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Нэхмэлийн булан</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "0.95rem" }}>
            Хайр шингээж, гараар урлав. Бүх эрх хуулиар хамгаалагдсан © 2026.
          </p>
          <div style={styles.footerLinks}>
            <Link href="/" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Нүүр</Link>
            <Link href="/shop" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Дэлгүүр</Link>
            <Link href="/purchases" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Миний захиалгууд</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}