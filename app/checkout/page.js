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
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("item");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [inStock, setInStock] = useState(true);
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

  const startEditing = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price);
    setCategory(prod.category);
    setSubCategory(prod.subCategory);
    setDescription(prod.description);
    setInStock(prod.inStock ?? true);
    setImageFile(null);
    setPdfFile(null);
    setActiveTab("products");
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setSubCategory("");
    setDescription("");
    setImageFile(null);
    setPdfFile(null);
    setInStock(true);
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
      formData.append("inStock", inStock);
      if (imageFile) formData.append("image", imageFile);
      if (pdfFile) formData.append("pdf", pdfFile);

      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage(editingProduct ? "Бүтээгдэхүүн амжилттай шинэчлэгдлээ!" : "Бүтээгдэхүүн амжилттай нэмэгдлээ!");
        fetchProducts();
        cancelEdit();
      } else {
        setMessage("Алдаа гарлаа: " + (data.error || "Тодорхойгүй алдаа"));
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setMessage("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "20px", textAlign: "center" }}>
        Admin Dashboard 
      </h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            background: activeTab === "orders" ? "var(--color-forest)" : "transparent",
            color: activeTab === "orders" ? "var(--color-bg)" : "var(--color-forest)",
            border: "2px solid var(--color-forest)",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Захиалгууд ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            background: activeTab === "products" ? "var(--color-forest)" : "transparent",
            color: activeTab === "products" ? "var(--color-bg)" : "var(--color-forest)",
            border: "2px solid var(--color-forest)",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          {editingProduct ? "Бараа засах" : "Бараа нэмэх"}
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          style={{
            background: activeTab === "manage" ? "var(--color-forest)" : "transparent",
            color: activeTab === "manage" ? "var(--color-bg)" : "var(--color-forest)",
            border: "2px solid var(--color-forest)",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Бараа удирдах ({products.length})
        </button>
      </div>

      {message && (
        <div style={{ padding: "12px", background: "#e2e8f0", color: "var(--color-forest)", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontWeight: "600" }}>
          {message}
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <h2 style={{ color: "var(--color-forest)", marginBottom: "20px" }}>Хэрэглэгчийн захиалгууд</h2>
          {loadingOrders ? (
            <p>Уншиж байна...</p>
          ) : orders.length === 0 ? (
            <p>Захиалга байхгүй байна.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {orders.map(order => (
                <div key={order._id} style={{ border: "2px solid var(--color-forest)", borderRadius: "10px", padding: "20px", background: "var(--color-bg)" }}>
                  <p><strong>Захиалгын ID:</strong> {order._id}</p>
                  <p><strong>Утас:</strong> {order.phone}</p>
                  <p><strong>Хаяг:</strong> {order.address}</p>
                  <p><strong>Нийт дүн:</strong> ₮{order.totalAmount?.toLocaleString()}</p>
                  <p><strong>Төлөв:</strong> {order.status}</p>
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={() => handleStatusChange(order._id, "Хүргэгдсэн")} style={{ padding: "6px 12px", background: "var(--color-forest)", color: "var(--color-bg)", border: "none", borderRadius: "6px", cursor: "pointer" }}>Хүргэгдсэн болгох</button>
                    <button onClick={() => handleStatusChange(order._id, "Цуцлагдсан")} style={{ padding: "6px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Цуцлах</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "600px", margin: "0 auto", background: "var(--color-bg)", border: "2px solid var(--color-forest)", padding: "30px", borderRadius: "12px" }}>
          <h2 style={{ color: "var(--color-forest)", marginBottom: "10px" }}>{editingProduct ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontWeight: "600" }}>Нэр</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontWeight: "600" }}>Үнэ (₮)</label>
            <input type="number" required value={price} onChange={e => setPrice(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontWeight: "600" }}>Үндсэн төрөл</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}>
              <option value="item">Item (Бэлэн бүтээгдэхүүн)</option>
              <option value="pattern">Pattern (Загвар)</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontWeight: "600" }}>Дэд төрөл</label>
            <select required value={subCategory} onChange={e => setSubCategory(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }}>
              <option value="">Дэд төрөл сонгоно уу</option>
              {ALLOWED_SUB_CATEGORIES.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontWeight: "600" }}>Тайлбар</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--color-forest)" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} id="inStock" />
            <label htmlFor="inStock" style={{ fontWeight: "600" }}>Бэлэн байгаа эсэх (In Stock)</label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontWeight: "600" }}>Зураг хуулах</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          </div>

          {category === "pattern" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontWeight: "600" }}>PDF Загвар файл хуулах</label>
              <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit" disabled={uploading} style={{ flex: 1, padding: "12px", background: "var(--color-forest)", color: "var(--color-bg)", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              {uploading ? "Хадгалж байна..." : editingProduct ? "Өөрчлөлтийг хадгалах" : "Бүтээгдэхүүн нэмэх"}
            </button>
            {editingProduct && (
              <button type="button" onClick={cancelEdit} style={{ padding: "12px 20px", background: "transparent", color: "var(--color-forest)", border: "2px solid var(--color-forest)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                Цуцлах
              </button>
            )}
          </div>
        </form>
      )}

      {activeTab === "manage" && (
        <div>
          <h2 style={{ color: "var(--color-forest)", marginBottom: "20px" }}>Бүтээгдэхүүн удирдах</h2>
          {products.length === 0 ? (
            <p>Бүтээгдэхүүн одоогоор байхгүй байна.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {products.map(prod => (
                <div key={prod._id} style={{ border: "2px solid var(--color-forest)", borderRadius: "10px", padding: "20px", background: "var(--color-bg)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ color: "var(--color-forest)", marginBottom: "8px" }}>{prod.name}</h3>
                    <p style={{ marginBottom: "5px" }}>Үнэ: ₮{prod.price?.toLocaleString()}</p>
                    <p style={{ marginBottom: "5px" }}>Төрөл: {prod.category} / {prod.subCategory}</p>
                    <p style={{ marginBottom: "15px" }}>Төлөв: {prod.inStock ? "Бэлэн байгаа" : "Дууссан"}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => startEditing(prod)} style={{ flex: 1, padding: "8px", background: "var(--color-forest)", color: "var(--color-bg)", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Засах</button>
                    <button onClick={() => handleDeleteProduct(prod._id)} style={{ padding: "8px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Устгах</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}