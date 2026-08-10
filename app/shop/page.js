"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const mainCategoryFilter = searchParams.get("category"); // "item" or "pattern"

  // State variables for category dropdown filter and sorting dropdown
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Keychain", value: "keychain" },
    { label: "Plushie", value: "plushie" },
    { label: "Hat", value: "hat" },
    { label: "Earwarmer", value: "earwarmer" },
    { label: "Scarf", value: "scarf" },
    { label: "Purse & Pouch", value: "purse & pouch" },
    { label: "Flowers", value: "flowes" }
  ];

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  // 1. Filter products based on main navigation category and selected sub-category dropdown
  const filteredProducts = products.filter((p) => {
    if (mainCategoryFilter && p.category !== mainCategoryFilter && p.type !== mainCategoryFilter) {
      // Adjust if your database schema uses different property names
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

  // 2. Sort filtered products based on selected sorting option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-az") return a.name.localeCompare(b.name);
    return 0; // default order
  });

  if (loading) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <p style={{ color: "var(--color-forest)", fontSize: "1.2rem" }}>Gathering cozy creations... 🧶</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "10px", textAlign: "center" }}>
        {mainCategoryFilter === "pattern" ? "Crochet Patterns 📄" : mainCategoryFilter === "item" ? "Handmade Items 🧶" : "Our Full Collection 🛍️"}
      </h1>
      <p style={{ color: "var(--color-forest)", opacity: 0.85, textAlign: "center", marginBottom: "30px" }}>
        Explore our handmade plushies, bags, and downloadable crochet guides.
      </p>

      {/* --- CLASSIC CONTROL TOOLBAR (Category Dropdown & Sort Dropdown) --- */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "space-between", 
        alignItems: "center", 
        gap: "15px", 
        marginBottom: "35px", 
        padding: "15px 20px", 
        background: "var(--color-cream)", 
        borderRadius: "12px",
        border: "1px solid var(--color-forest)"
      }}>
        {/* Category Filter Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="category-select" style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-forest)" }}>
            Category:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--color-forest)",
              background: "var(--color-bg)",
              color: "var(--color-forest)",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="sort-select" style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-forest)" }}>
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--color-forest)",
              background: "var(--color-bg)",
              color: "var(--color-forest)",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <option value="default">Featured / Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* --- PRODUCTS GRID --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" }}>
        {sortedProducts.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-forest)", padding: "40px", fontSize: "1.1rem" }}>
            No cozy creations found matching this filter. 🧶
          </p>
        ) : (
          sortedProducts.map((product) => (
            <div 
              key={product._id} 
              style={{ 
                background: "var(--color-bg)", 
                border: "2px solid var(--color-forest)", 
                borderRadius: "12px", 
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(56, 102, 65, 0.06)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: "100%", height: "220px", objectFit: "cover" }} 
              />
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", background: "var(--color-cream)", color: "var(--color-forest)", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", textTransform: "uppercase" }}>
                    {product.subCategory || product.category}
                  </span>
                  <h3 style={{ color: "var(--color-forest)", fontSize: "1.2rem", margin: "10px 0 5px 0" }}>{product.name}</h3>
                  <p style={{ color: "var(--color-forest)", opacity: 0.8, fontSize: "0.95rem", marginBottom: "15px" }}>
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <Link 
                  href={`/shop/${product._id}`}
                  style={{ 
                    background: "var(--color-forest)", 
                    color: "var(--color-bg)", 
                    textAlign: "center", 
                    padding: "10px", 
                    borderRadius: "6px", 
                    textDecoration: "none", 
                    fontWeight: "600",
                    display: "block"
                  }}
                >
                  View Details 👁️
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}