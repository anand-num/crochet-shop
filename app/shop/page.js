"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const styles = {
  loadingContainer: {
    textAlign: "center",
    padding: "80px",
    fontSize: "1.2rem",
    color: "var(--color-forest)",
  },
  mainContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  headerBox: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    color: "var(--color-forest)",
    marginBottom: "10px",
  },
  subtitle: {
    color: "var(--color-text)",
    opacity: 0.8,
    fontSize: "1.1rem",
  },
  filterBar: {
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
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    fontWeight: "600",
    color: "var(--color-forest)",
  },
  selectBox: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid var(--color-forest)",
    outline: "none",
    fontWeight: "500",
    background: "var(--color-bg)",
    color: "var(--color-text)",
  },
  optionStyle: {
    background: "var(--color-bg)",
    color: "var(--color-text)",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px",
    color: "var(--color-text)",
    opacity: 0.7,
    fontSize: "1.1rem",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
  },
  productCard: {
    background: "var(--color-bg)",
    border: "1px solid var(--color-forest)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  imageWrapper: {
    width: "100%",
    height: "220px",
    background: "rgba(0,0,0,0.05)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  categoryBadge: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    color: "var(--color-forest)",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  productTitle: {
    margin: "8px 0",
    fontSize: "1.2rem",
    color: "var(--color-forest)",
  },
  productDesc: {
    color: "var(--color-text)",
    opacity: 0.85,
    fontSize: "0.95rem",
    margin: "0 0 15px 0",
    lineHeight: "1.4",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },
  productPrice: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--color-forest)",
  },
  detailsButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px solid var(--color-forest)",
  },
};

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
    return <div style={styles.loadingContainer}>Дулаан бараануудыг ачаалж байна... </div>;
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.headerBox}>
        <h1 style={styles.title}>
          {mainCategoryFilter === "item" ? "Нэхмэл бүтээгдэхүүн" : mainCategoryFilter === "pattern" ? "Цахим загварууд" : "Нэхмэлийн дэлгүүр"}
        </h1>
        <p style={styles.subtitle}>
          Хайраа шингээж урласан сүлжмэл бүтээгдэхүүн болон загваруудаас сонгоорой.
        </p>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Шүүх:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.selectBox}
          >
            <option value="all" style={styles.optionStyle}>Бүх дэд ангилал</option>
            <option value="keychain" style={styles.optionStyle}>Түлхүүрийн оосор</option>
            <option value="plushie" style={styles.optionStyle}>Тоглоом</option>
            <option value="hat" style={styles.optionStyle}>Малгай</option>
            <option value="earwarmer" style={styles.optionStyle}>Чихэвч (Чихэвчтэй ороолт)</option>
            <option value="scarf" style={styles.optionStyle}>Ороолт</option>
            <option value="purse & pouch" style={styles.optionStyle}>Цүнх болон түрийвч</option>
            <option value="flowers" style={styles.optionStyle}>Цэцэг</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Эрэмбэлэх:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.selectBox}
          >
            <option value="newest" style={styles.optionStyle}>Хамгийн шинэ нь</option>
            <option value="price-asc" style={styles.optionStyle}>Үнэ: Хямдаас өндөр рүү</option>
            <option value="price-desc" style={styles.optionStyle}>Үнэн: Өндөрөөс хямд руу</option>
            <option value="name" style={styles.optionStyle}>Нэрээр: А-Я</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div style={styles.emptyState}>
          Таны шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй.
        </div>
      ) : (
        <div style={styles.gridContainer}>
          {sortedProducts.map((product) => (
            <div className="product-card" key={product._id} style={styles.productCard}>
              <div style={styles.imageWrapper}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  style={styles.image} 
                />
              </div>
              <div style={styles.cardContent}>
                <div>
                  <span style={styles.categoryBadge}>
                    {product.subCategory || product.category}
                  </span>
                  <h3 style={styles.productTitle}>
                    {product.name}
                  </h3>
                  <p style={styles.productDesc}>
                    {product.description}
                  </p>
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.productPrice}>
                    ₮{product.price.toLocaleString()}
                  </span>
                  <Link href={`/shop/${product._id}`} style={styles.detailsButton}>
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
    <Suspense fallback={<div style={styles.loadingContainer}>Дэлгүүрийг ачаалж байна... </div>}>
      <ShopContent />
    </Suspense>
  );
}