"use client";
import { useState, useEffect } from "react";

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "products"
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Product Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("item"); // "item" or "pattern"
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all orders on load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Update Order Status ("making" vs "shipped")
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

  // Handle Product/Pattern Submission
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      if (imageFile) formData.append("image", imageFile);
      if (pdfFile && category === "pattern") formData.append("pdf", pdfFile);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Бүтээгдэхүүн амжилттай нэмэгдлээ! ✨");
        setName("");
        setPrice("");
        setImageFile(null);
        setPdfFile(null);
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
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px" }}>
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
          onClick={() => setActiveTab("products")}
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
          Шинэ бараа нэмэх ➕
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
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
                  
                  {/* Status Switcher Dropdown */}
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

      {/* TAB 2: PRODUCT & PATTERN CREATOR FORM */}
      {activeTab === "products" && (
        <form onSubmit={handleCreateProduct} style={{ border: "2px solid var(--color-forest)", padding: "30px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ color: "var(--color-forest)", margin: 0 }}>Шинэ бүтээгдэхүүн эсвэл загвар нэмэх</h2>

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
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Төрөл:</label>
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
            <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Бүтээгдэхүүний зураг (Image):</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
              required 
            />
          </div>

          {category === "pattern" && (
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "5px" }}>Загварын PDF файл:</label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])} 
                required 
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
            {uploading ? "Хуулж байна... ⏳" : "Бүтээгдэхүүн нэмэх ✨"}
          </button>

          {message && <p style={{ fontWeight: "600", color: "var(--color-forest)" }}>{message}</p>}
        </form>
      )}
    </main>
  );
}