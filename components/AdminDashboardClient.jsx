"use client";
import { useState, useEffect } from "react";

const ALLOWED_SUB_CATEGORIES = [
  "keychain", 
  "plushie", 
  "hat", 
  "earwarmer", 
  "scarf", 
  "purse & pouch", 
  "flowes"
];

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("orders"); // "orders", "products", or "manage"
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Products Management State
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // Holds product being edited

  // Product Form State (Creation & Editing)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("item");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Populate form for editing
  const startEditing = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price);
    setCategory(prod.category);
    setSubCategory(prod.subCategory);
    setDescription(prod.description);
    setImageFile(null);
    setPdfFile(null);
    setActiveTab("products"); // Switch to form tab
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setSubCategory("");
    setDescription("");
    setImageFile(null);
    setPdfFile(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Энэ барааг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("Устгахад алдаа гарлаа: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    if (!subCategory) {
      setMessage("Алдаа: Дэд төрлийг сонгоно уу.");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);
      if (pdfFile && category === "pattern") formData.append("pdf", pdfFile);

      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage(editingProduct ? "Бүтээгдэхүүн амжилттай шинэчлэгдлээ! ✨" : "Бүтээгдэхүүн амжилттай нэмэгдлээ! ✨");
        fetchProducts();
        if (editingProduct) {
          cancelEdit();
        } else {
          setName("");
          setPrice("");
          setSubCategory("");
          setDescription("");
          setImageFile(null);
          setPdfFile(null);
        }
      } else {
        setMessage("Алдаа гарлаа: " + data.error);
      }
    } catch (err) {
      setMessage("Холболтын алдаа гарлаа.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--color-forest)", marginBottom: "20px", textAlign: "center" }}>
        Enoki.vibes Админ Хэсэг 🧶
      </h1>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        <button 
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "2px solid var(--color-forest)",
            background: activeTab === "orders" ? "var(--color-forest)" : "transparent",
            color: activeTab === "orders" ? "var(--color-bg)" : "var(--color-forest)",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Захиалга удирдах 📦
        </button>
        <button 
          onClick={() => { cancelEdit(); setActiveTab("products"); }}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "2px solid var(--color-forest)",
            background: activeTab === "products" ? "var(--color-forest)" : "transparent",
            color: activeTab === "products" ? "var(--color-bg)" : "var(--color-forest)",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {editingProduct ? "Бараа засварлах ✏️" : "Шинэ бараа нэмэх ➕"}
        </button>
        <button 
          onClick={() => setActiveTab("manage")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "2px solid var(--color-forest)",
            background: activeTab === "manage" ? "var(--color-forest)" : "transparent",
            color: activeTab === "manage" ? "var(--color-bg)" : "var(--color-forest)",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Бараа жагсаалт & Засвар 📋
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === "orders" && (
        <div>
          <h2 style={{ color: "var(--color-forest)", marginBottom: "20px" }}>Хэрэглэгчийн захиалгууд</h2>
          {loadingOrders ? (
            <p>Ачаалж байна...</p>
          ) : orders.length === 0 ? (
            <p>Одоогоор захиалга байхгүй байна.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {orders.map((order) => (
                <div key={order._id} style={{ border: "2px solid var(--color-forest)", padding: "20px", borderRadius: "10px", background: "var(--color-bg)" }}>
                  <p><strong>Захиалгын ID:</strong> {order._id}</p>
                  <p><strong>Нийт дүн:</strong> ₮{order.totalAmount?.toLocaleString()}</p>
                  
                  <div style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                    <label><strong>Төлөв өөрчлөх:</strong></label>
                    <select 
                      value={order.status || "making"} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}
                    >
                      <option value="making">Хийгдэж буй 🧶</option>
                      <option value="shipped">Хүргэлтэд гарсан 🚚</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE / EDIT PRODUCT FORM */}
      {activeTab === "products" && (
        <form onSubmit={handleFormSubmit} style={{ border: "2px solid var(--color-forest)", padding: "30px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "var(--color-forest)", margin: 0 }}>
              {editingProduct ? `Засварлаж байна: ${editingProduct.name}` : "Шинэ бүтээгдэхүүн эсвэл загвар нэмэх"}
            </h2>
            {editingProduct && (
              <button 
                type="button" 
                onClick={cancelEdit} 
                style={{ background: "transparent", border: "1px solid var(--color-forest)", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", color: "var(--color-forest)" }}
              >
                Болих ✕
              </button>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Нэр:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Үнэ (₮):</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Төрөл (Category):</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}
            >
              <option value="item">Бүтээгдэхүүн (Physical Item)</option>
              <option value="pattern">Цахим загвар (PDF Pattern)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Дэд төрөл (Sub-category):</label>
            <select 
              value={subCategory} 
              onChange={(e) => setSubCategory(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}
            >
              <option value="">-- Дэд төрөл сонгоно уу --</option>
              {ALLOWED_SUB_CATEGORIES.map((sub, index) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Тайлбар (Description):</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows={3}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)", fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>
              Бүтээгдэхүүний зураг (Image) {editingProduct ? "(Шинээр солих бол оруулна уу)" : ""}:
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
              required={!editingProduct} 
            />
          </div>

          {category === "pattern" && (
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>
                Загварын PDF файл {editingProduct ? "(Шинээр солих бол оруулна уу)" : ""}:
              </label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])} 
                required={!editingProduct && category === "pattern"} 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              background: "var(--color-forest)", 
              color: "var(--color-bg)", 
              padding: "12px", 
              borderRadius: "8px", 
              fontWeight: "bold", 
              cursor: "pointer",
              border: "none"
            }}
          >
            {uploading ? "Хуулж байна... ⏳" : editingProduct ? "Өөрчлөлтийг хадгалах ✨" : "Бүтээгдэхүүн нэмэх ✨"}
          </button>

          {message && <p style={{ fontWeight: "600", color: "var(--color-forest)" }}>{message}</p>}
        </form>
      )}

      {/* TAB 3: MANAGE PRODUCTS LIST */}
      {activeTab === "manage" && (
        <div>
          <h2 style={{ color: "var(--color-forest)", marginBottom: "20px" }}>Бүх бараанууд ({products.length})</h2>
          {products.length === 0 ? (
            <p>Одоогоор бараа байхгүй байна.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {products.map((prod) => (
                <div key={prod._id} style={{ border: "2px solid var(--color-forest)", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-bg)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {prod.imageUrl && <img src={prod.imageUrl} alt={prod.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />}
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", color: "var(--color-forest)" }}>{prod.name}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>₮{prod.price?.toLocaleString()} | {prod.category} ({prod.subCategory})</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => startEditing(prod)}
                      style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Засах ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod._id)}
                      style={{ background: "#d9534f", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Устгах 🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}