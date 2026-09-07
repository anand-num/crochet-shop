"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ShopContent() {
  const searchParams = useSearchParams();
  const mainCategoryFilter = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.warn("API response is not an array:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory("all");
  }, [mainCategoryFilter]);

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((p) => {
    if (mainCategoryFilter) {
      if (!p.category || p.category.toLowerCase() !== mainCategoryFilter.toLowerCase()) {
        return false;
      }
    }
    
    if (selectedCategory !== "all") {
      const matchCategory = p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSubCategory = p.subCategory?.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchCategory && !matchSubCategory) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  if (loading) {
    return <div style={{ textAlign: "center", padding: "80px", fontSize: "1.2rem", color: "var(--color-forest)" }}>Дулаан бараануудыг ачаалж байна... 🧶</div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--color-forest)", marginBottom: "10px" }}>
          {mainCategoryFilter === "item" ? "Нэхмэл бүтээгдэхүүн" : mainCategoryFilter === "pattern" ? "Цахим загварууд" : "Нэхмэлийн дэлгүүр"}
        </h1>
        <p style={{ color: "var(--color-text)", opacity: 0.8, fontSize: "1.1rem" }}>
          Хайраа шингээж урласан сүлжмэл бүтээгдэхүүн болон загваруудаас сонгоорой.
        </p>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: "20px", 
        marginBottom: "30px",
        background: "var(--color-bg)",
        border: "1px solid var(--color-forest)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "background-color 0.3s ease, border-color 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontWeight: "600", color: "var(--color-forest)" }}>Шүүх:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: "8px", 
              border: "1px solid var(--color-forest)", 
              outline: "none", 
              fontWeight: "500", 
              background: "var(--color-bg)", 
              color: "var(--color-text)" 
            }}
          >
            <option value="all" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Бүх дэд ангилал</option>
            <option value="keychain" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Түлхүүрийн оосор</option>
            <option value="plushie" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Тоглоом</option>
            <option value="hat" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Малгай</option>
            <option value="earwarmer" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Чихэвч (Чихэвчтэй ороолт)</option>
            <option value="scarf" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Ороолт</option>
            <option value="purse & pouch" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Цүнх болон түрийвч</option>
            <option value="flowers" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Цэцэг</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontWeight: "600", color: "var(--color-forest)" }}>Эрэмбэлэх:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: "8px", 
              border: "1px solid var(--color-forest)", 
              outline: "none", 
              fontWeight: "500", 
              background: "var(--color-bg)", 
              color: "var(--color-text)" 
            }}
          >
            <option value="newest" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Хамгийн шинэ нь</option>
            <option value="price-asc" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Үнэ: Хямдаас өндөр рүү</option>
            <option value="price-desc" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Үнэн: Өндөрөөс хямд руу</option>
            <option value="name" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>Нэрээр: А-Я</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-text)", opacity: 0.7, fontSize: "1.1rem" }}>
          Таны шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй.
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
          gap: "30px" 
        }}>
          {sortedProducts.map((product) => (
            <div key={product._id} style={{ 
              background: "var(--color-bg)", 
              border: "1px solid var(--color-forest)",
              borderRadius: "12px", 
              overflow: "hidden", 
              boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "background-color 0.3s ease, border-color 0.3s ease"
            }}>
              <div style={{ width: "100%", height: "220px", background: "rgba(0,0,0,0.05)" }}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--color-forest)", fontWeight: "600", letterSpacing: "0.5px" }}>
                    {product.subCategory || product.category}
                  </span>
                  <h3 style={{ margin: "8px 0", fontSize: "1.2rem", color: "var(--color-forest)" }}>
                    {product.name}
                  </h3>
                  <p style={{ color: "var(--color-text)", opacity: 0.85, fontSize: "0.95rem", margin: "0 0 15px 0", lineHeight: "1.4" }}>
                    {product.description}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--color-forest)" }}>
                    ₮{product.price.toLocaleString()}
                  </span>
                  <Link href={`/shop/${product._id}`} style={{ 
                    background: "var(--color-forest)", 
                    color: "var(--color-bg)", 
                    padding: "8px 16px", 
                    borderRadius: "8px", 
                    textDecoration: "none", 
                    fontSize: "0.9rem", 
                    fontWeight: "600",
                    border: "1px solid var(--color-forest)"
                  }}>
                    Дэлгэрэнгүй
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px", color: "var(--color-forest)" }}>Дэлгүүрийг ачаалж байна... </div>}>
      <ShopContent />
    </Suspense>
  );
}