"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const styles = {
  mainContainer: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "inherit",
  },
  centerBox: {
    padding: "60px 20px",
    textAlign: "center",
  },
  heading: {
    color: "var(--color-forest)",
    fontSize: "2.5rem",
    marginBottom: "30px",
    textAlign: "center",
  },
  subHeading: {
    color: "var(--color-forest)",
    marginBottom: "15px",
  },
  text: {
    color: "var(--color-forest)",
    opacity: 0.8,
    marginBottom: "20px",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  orderCard: {
    background: "var(--color-bg)",
    border: "2px solid var(--color-forest)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(56, 102, 65, 0.05)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    borderBottom: "1px solid rgba(56, 102, 65, 0.2)",
    paddingBottom: "10px",
    flexWrap: "wrap",
    gap: "10px",
  },
  orderDate: {
    fontSize: "0.9rem",
    color: "var(--color-forest)",
    opacity: 0.8,
  },
  orderTotal: {
    fontWeight: "700",
    color: "var(--color-forest)",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    background: "rgba(56, 102, 65, 0.03)",
    padding: "12px",
    borderRadius: "8px",
  },
  itemInfoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  itemImage: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  itemName: {
    color: "var(--color-forest)",
    fontSize: "1.1rem",
    marginBottom: "4px",
  },
  itemDetailsText: {
    fontSize: "0.9rem",
    color: "var(--color-forest)",
    opacity: 0.8,
    marginBottom: "4px",
  },
  patternBadge: {
    fontSize: "0.75rem",
    background: "var(--color-cream)",
    color: "var(--color-forest)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "600",
    border: "1px solid var(--color-forest)",
  },
  statusText: {
    fontSize: "0.85rem",
    color: "var(--color-forest)",
    fontWeight: "700",
  },
  downloadButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  subtotalText: {
    fontWeight: "700",
    color: "var(--color-forest)",
  },
  primaryButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
};

const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case "shipped":
      return "Хүргэлтэд гарсан";
    case "making":
    default:
      return "Хийгдэж буй";
  }
};

export default function PurchasesPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/orders?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch purchases:", err);
          setLoading(false);
        });
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <main style={{ ...styles.centerBox, color: "var(--color-forest)" }}>
        <h2>Таны захиалгуудыг ачаалж байна...</h2>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={styles.centerBox}>
        <h2 style={{ ...styles.subHeading, marginBottom: "15px" }}>Нэвтэрнэ үү</h2>
        <p style={{ ...styles.text, marginBottom: "20px" }}>Та захиалгуудаа харахын тулд нэвтэрсэн байх шаардлагатай.</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main style={styles.centerBox}>
        <h1 style={{ color: "var(--color-forest)", fontSize: "2.2rem", marginBottom: "15px" }}>Одоогоор захиалга байхгүй байна.</h1>
        <p style={{ ...styles.text, marginBottom: "30px", fontSize: "1.1rem" }}>
          Та одоогоор ямар нэгэн бүтээгдэхүүн эсвэл загвар худалдаж аваагүй байна!
        </p>
        <Link href="/shop" style={styles.primaryButton}>
          Дэлгүүр хэсэх
        </Link>
      </main>
    );
  }

  return (
    <main style={styles.mainContainer}>
      <h1 style={styles.heading}>
        Миний захиалгууд
      </h1>

      <div style={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <span style={styles.orderDate}>
                Захиалсан огноо: {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span style={styles.orderTotal}>
                Нийт дүн: ₮{order.totalAmount.toLocaleString()}
              </span>
            </div>

            <div style={styles.itemsList}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <div style={styles.itemInfoGroup}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={styles.itemImage} 
                    />
                    <div>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <p style={styles.itemDetailsText}>
                        Тоо ширхэг: {item.quantity} | Үнэ: ₮{item.price.toLocaleString()}
                      </p>
                      
                      {item.category === "pattern" ? (
                        <span style={styles.patternBadge}>
                          Цахим загвар
                        </span>
                      ) : (
                        <span style={styles.statusText}>
                          Төлөв: {getStatusText(order.status)}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.category === "pattern" ? (
                    <a 
                      href={item.pdfUrl} 
                      download 
                      style={styles.downloadButton}
                    >
                      PDF татаж авах
                    </a>
                  ) : (
                    <span style={styles.subtotalText}>
                      Дэд дүн: ₮{(item.price * item.quantity).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}