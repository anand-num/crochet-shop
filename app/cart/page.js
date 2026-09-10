"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const styles = {
  emptyMain: {
    padding: "60px 20px",
    textAlign: "center",
    fontFamily: "inherit",
  },
  emptyTitle: {
    color: "var(--color-forest)",
    fontSize: "2.2rem",
    marginBottom: "15px",
  },
  emptyText: {
    color: "var(--color-forest)",
    opacity: 0.8,
    marginBottom: "30px",
    fontSize: "1.1rem",
  },
  shopButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
  },
  main: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "inherit",
  },
  title: {
    color: "var(--color-forest)",
    fontSize: "2.5rem",
    marginBottom: "30px",
    textAlign: "center",
  },
  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "40px",
  },
  cartCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--color-bg)",
    border: "2px solid var(--color-forest)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(56, 102, 65, 0.05)",
    gap: "20px",
    flexWrap: "wrap",
  },
  itemInfoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  itemName: {
    color: "var(--color-forest)",
    fontSize: "1.2rem",
    marginBottom: "5px",
  },
  patternBadge: {
    fontSize: "0.8rem",
    background: "var(--color-cream)",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "var(--color-forest)",
    fontWeight: "600",
    border: "1px solid var(--color-forest)",
  },
  productBadge: {
    fontSize: "0.8rem",
    background: "rgba(56, 102, 65, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "var(--color-forest)",
    fontWeight: "600",
  },
  itemPrice: {
    color: "var(--color-forest)",
    fontWeight: "600",
    marginTop: "5px",
  },
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    border: "1px solid var(--color-forest)",
    borderRadius: "6px",
    overflow: "hidden",
  },
  quantityButton: {
    background: "transparent",
    border: "none",
    padding: "6px 12px",
    color: "var(--color-forest)",
    fontWeight: "bold",
    cursor: "pointer",
  },
  quantityText: {
    padding: "0 10px",
    color: "var(--color-forest)",
    fontWeight: "600",
  },
  removeButton: {
    background: "var(--color-terracotta)",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  summaryContainer: {
    background: "var(--color-cream)",
    border: "2px solid var(--color-forest)",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "right",
  },
  summaryTitle: {
    color: "var(--color-forest)",
    fontSize: "1.8rem",
    marginBottom: "15px",
  },
  checkoutButton: {
    background: "var(--color-forest)",
    color: "var(--color-bg)",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main style={styles.emptyMain}>
        <h1 style={styles.emptyTitle}>Таны сагс хоосон байна.</h1>
        <p style={styles.emptyText}>
          Та одоогоор сагсанд бүтээгдэхүүн нэмээгүй байна!
        </p>
        <Link href="/shop" style={styles.shopButton}>
          Дэлгүүр хэсэх
        </Link>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Таны сагс</h1>

      <div style={styles.cartList}>
        {cart.map((item) => (
          <div key={item._id} style={styles.cartCard}>
            <div style={styles.itemInfoContainer}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={styles.itemImage}
              />
              <div>
                <h3 style={styles.itemName}>{item.name}</h3>
                {item.category === "pattern" ? (
                  <span style={styles.patternBadge}>Цахим загвар</span>
                ) : (
                  <span style={styles.productBadge}>Бодит бүтээгдэхүүн</span>
                )}
                <p style={styles.itemPrice}>₮{item.price.toLocaleString()}</p>
              </div>
            </div>

            <div style={styles.actionsContainer}>
              <div style={styles.quantityControls}>
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  style={styles.quantityButton}
                >
                  -
                </button>
                <span style={styles.quantityText}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                style={styles.removeButton}
              >
                Устгах
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.summaryContainer}>
        <h2 style={styles.summaryTitle}>
          Нийт дүн: ₮{totalPrice.toLocaleString()}
        </h2>
        <button
          onClick={() => router.push("/checkout")}
          style={styles.checkoutButton}
        >
          Төлбөр тооцоо хийх
        </button>
      </div>
    </main>
  );
}