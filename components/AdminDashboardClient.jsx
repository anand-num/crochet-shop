"use client";

import { useState, useEffect } from "react";

const DEFAULT_SUB_CATEGORIES = [
  "keychain", 
  "plushie", 
  "hat", 
  "earwarmer", 
  "scarf", 
  "purse & pouch", 
  "flowers"
];

const styles = {
  mainContainer: {
    padding: "40px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    color: "var(--color-forest)",
    marginBottom: "20px",
    textAlign: "center",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  tabButton: (isActive) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    border: "2px solid var(--color-forest)",
    background: isActive ? "var(--color-forest)" : "transparent",
    color: isActive ? "var(--color-bg)" : "var(--color-forest)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
  }),
  sectionTitle: {
    color: "var(--color-forest)",
    marginBottom: "20px",
  },
  orderCard: {
    border: "2px solid var(--color-forest)",
    padding: "20px",
    borderRadius: "10px",
    background: "var(--color-bg)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  selectBox: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid var(--color-forest)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
  },
  formBox: {
    border: "2px solid var(--color-forest)",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    background: "var(--color-bg)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "5px",
    color: "var(--color-forest)",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--color-forest)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--color-forest)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    fontFamily: "inherit",
  },
  stockBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "var(--color-bg)",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid var(--color-forest)",
  },
  submitButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },
  productCardInStock: {
    border: "2px solid var(--color-forest)",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--color-bg)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  productCardOutStock: {
    border: "2px solid #d9534f",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--color-bg)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  editButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteButton: {
    background: "#d9534f",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("orders"); 
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 

  const [subCategories, setSubCategories] = useState(DEFAULT_SUB_CATEGORIES);
  const [isAddingNewSub, setIsAddingNewSub] = useState(false);

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
    fetchSubCategories();
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

  const fetchSubCategories = async () => {
    try {
      const res = await fetch("/api/admin/subcategories");
      const data = await res.json();
      if (data.success && data.subCategories) {
        const combined = Array.from(new Set([...DEFAULT_SUB_CATEGORIES, ...data.subCategories]));
        setSubCategories(combined);
      }
    } catch (err) {
      console.error("Failed to load sub-categories", err);
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
    setIsAddingNewSub(false);
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
    setIsAddingNewSub(false);
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
      formData.append("subCategory", subCategory.trim().toLowerCase());
      formData.append("description", description);
      formData.append("inStock", inStock);
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
        setMessage(editingProduct ? "Бүтээгдэхүүн амжилттай шинэчлэгдлээ!" : "Бүтээгдэхүүн амжилттай нэмэгдлээ!");
        fetchProducts();
        fetchSubCategories();
        if (editingProduct) {
          cancelEdit();
        } else {
          setName("");
          setPrice("");
          setSubCategory("");
          setDescription("");
          setImageFile(null);
          setPdfFile(null);
          setInStock(true);
          setIsAddingNewSub(false);
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

  const inStockProducts = products.filter(p => p.inStock !== false);
  const outOfStockProducts = products.filter(p => p.inStock === false);

  return (
    <main style={styles.mainContainer}>
      <h1 style={styles.title}>
        Enoki.vibes Админ Хэсэг 
      </h1>

      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab("orders")}
          style={styles.tabButton(activeTab === "orders")}
        >
          Захиалга удирдах 
        </button>
        <button 
          onClick={() => { cancelEdit(); setActiveTab("products"); }}
          style={styles.tabButton(activeTab === "products")}
        >
          {editingProduct ? "Бараа засварлах" : "Шинэ бараа нэмэх"}
        </button>
        <button 
          onClick={() => setActiveTab("manage")}
          style={styles.tabButton(activeTab === "manage")}
        >
          Бараа жагсаалт & Засвар 
        </button>
      </div>

      {activeTab === "orders" && (
        <div>
          <h2 style={styles.sectionTitle}>Хэрэглэгчийн захиалгууд</h2>
          {loadingOrders ? (
            <p>Ачаалж байна...</p>
          ) : orders.length === 0 ? (
            <p>Одоогоор захиалга байхгүй байна.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {orders.map((order) => (
                <div key={order._id} style={styles.orderCard}>
                  <p><strong>Захиалгын ID:</strong> {order._id}</p>
                  <p><strong>Нийт дүн:</strong> ₮{order.totalAmount?.toLocaleString()}</p>
                  
                  <div style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                    <label><strong>Төлөв өөрчлөх:</strong></label>
                    <select 
                      value={order.status || "making"} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={styles.selectBox}
                    >
                      <option value="making">Хийгдэж буй</option>
                      <option value="shipped">Хүргэлтэд гарсан</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <form onSubmit={handleFormSubmit} style={styles.formBox}>
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
            <label style={styles.label}>Нэр:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Үнэ (₮):</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Төрөл (Category):</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
            >
              <option value="item">Бүтээгдэхүүн (Physical Item)</option>
              <option value="pattern">Цахим загвар (PDF Pattern)</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Дэд төрөл (Sub-category):</label>
            {!isAddingNewSub ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <select 
                  value={subCategory} 
                  onChange={(e) => {
                    if (e.target.value === "NEW_CUSTOM") {
                      setIsAddingNewSub(true);
                      setSubCategory("");
                    } else {
                      setSubCategory(e.target.value);
                    }
                  }}
                  required
                  style={styles.input}
                >
                  <option value="">-- Дэд төрөл сонгоно уу --</option>
                  {subCategories.map((sub, index) => (
                    <option key={index} value={sub}>{sub}</option>
                  ))}
                  <option value="NEW_CUSTOM" style={{ fontWeight: "bold", color: "var(--color-forest)" }}>+ Шинэ дэд төрөл нэмэх...</option>
                </select>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="Шинэ дэд төрлийн нэр бичнэ үү..."
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  style={{ flex: 1, ...styles.input }}
                />
                <button 
                  type="button"
                  onClick={() => { setIsAddingNewSub(false); setSubCategory(""); }}
                  style={{ padding: "0 15px", background: "transparent", border: "1px solid var(--color-forest)", borderRadius: "6px", cursor: "pointer", color: "var(--color-forest)" }}
                >
                  Буцах
                </button>
              </div>
            )}
          </div>

          <div>
            <label style={styles.label}>Тайлбар (Description):</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows={3}
              style={styles.textarea}
            />
          </div>

          <div style={styles.stockBox}>
            <input 
              type="checkbox" 
              id="inStockCheckbox"
              checked={inStock} 
              onChange={(e) => setInStock(e.target.checked)} 
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <label htmlFor="inStockCheckbox" style={{ fontWeight: "600", cursor: "pointer", color: "var(--color-forest)" }}>
              {inStock ? "In stock" : "Out of stock"}
            </label>
          </div>

          <div>
            <label style={styles.label}>
              Бүтээгдэхүүний зураг (Image) {editingProduct ? "(Шинээр солих бол оруулна уу)" : ""}:
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
              required={!editingProduct} 
              style={{ color: "var(--color-text)" }}
            />
          </div>

          {category === "pattern" && (
            <div>
              <label style={styles.label}>
                Загварын PDF файл {editingProduct ? "(Шинээр солих бол оруулна уу)" : ""}:
              </label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])} 
                required={!editingProduct && category === "pattern"} 
                style={{ color: "var(--color-text)" }}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={uploading}
            style={styles.submitButton}
          >
            {uploading ? "Нийтэлж байна..." : editingProduct ? "Өөрчлөлтийг хадгалах" : "Бүтээгдэхүүн нэмэх"}
          </button>

          {message && <p style={{ fontWeight: "600", color: "var(--color-forest)" }}>{message}</p>}
        </form>
      )}

      {activeTab === "manage" && (
        <div>
          <h2 style={styles.sectionTitle}>Бүх бараанууд ({products.length})</h2>
          
          {products.length === 0 ? (
            <p>Одоогоор бараа байхгүй байна.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
              
              <div>
                <h3 style={{ color: "var(--color-forest)", marginBottom: "15px", borderBottom: "2px solid var(--color-forest)", paddingBottom: "5px" }}>
                  Бэлэн байгаа бараанууд ({inStockProducts.length})
                </h3>
                
                {inStockProducts.length === 0 ? (
                  <p style={{ fontStyle: "italic", color: "var(--color-text)", opacity: 0.7 }}>Бэлэн байгаа бараа алга байна.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {inStockProducts.map((prod) => (
                      <div key={prod._id} style={styles.productCardInStock}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          {prod.imageUrl && <img src={prod.imageUrl} alt={prod.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />}
                          <div>
                            <h4 style={{ margin: "0 0 5px 0", color: "var(--color-forest)" }}>{prod.name}</h4>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text)" }}>₮{prod.price?.toLocaleString()} | {prod.category} ({prod.subCategory})</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button 
                            onClick={() => startEditing(prod)}
                            style={styles.editButton}
                          >
                            Засах 
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)}
                            style={styles.deleteButton}
                          >
                            Устгах 
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ color: "#d9534f", marginBottom: "15px", borderBottom: "2px solid #d9534f", paddingBottom: "5px" }}>
                  Дууссан бараанууд ({outOfStockProducts.length})
                </h3>
                
                {outOfStockProducts.length === 0 ? (
                  <p style={{ fontStyle: "italic", color: "var(--color-text)", opacity: 0.7 }}>Дууссан бараа байхгүй байна.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {outOfStockProducts.map((prod) => (
                      <div key={prod._id} style={styles.productCardOutStock}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          {prod.imageUrl && <img src={prod.imageUrl} alt={prod.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px", opacity: 0.7 }} />}
                          <div>
                            <h4 style={{ margin: "0 0 5px 0", color: "#d9534f" }}>{prod.name}</h4>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text)" }}>₮{prod.price?.toLocaleString()} | {prod.category} ({prod.subCategory})</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button 
                            onClick={() => startEditing(prod)}
                            style={styles.editButton}
                          >
                            Засах 
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)}
                            style={styles.deleteButton}
                          >
                            Устгах 
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </main>
  );
}