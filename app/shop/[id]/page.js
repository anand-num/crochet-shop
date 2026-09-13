"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const styles = {
  mainContainer: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "inherit",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  centerBox: {
    padding: "60px 20px",
    textAlign: "center",
    fontFamily: "inherit",
    background: "var(--color-bg)",
  },
  loadingText: {
    color: "var(--color-forest)",
    fontSize: "1.2rem",
  },
  notFoundTitle: {
    color: "var(--color-forest)",
    fontSize: "2rem",
    marginBottom: "15px",
  },
  backLink: {
    color: "var(--color-forest)",
    textDecoration: "none",
    fontWeight: "600",
    display: "inline-block",
    marginBottom: "25px",
  },
  notFoundLink: {
    color: "var(--color-forest)",
    fontWeight: "600",
    textDecoration: "underline",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    alignItems: "start",
    flexWrap: "wrap",
  },
  imageWrapper: {
    width: "100%",
    height: "350px",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid var(--color-forest)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  detailsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  badge: {
    fontSize: "0.75rem",
    background: "var(--color-sage)",
    color: "var(--color-text)",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "700",
    textTransform: "uppercase",
    width: "fit-content",
  },
  title: {
    color: "var(--color-forest)",
    fontSize: "2.2rem",
    margin: 0,
  },
  price: {
    color: "var(--color-forest)",
    fontSize: "1.4rem",
    fontWeight: "700",
  },
  description: {
    color: "var(--color-text)",
    opacity: 0.85,
    lineHeight: "1.6",
  },
  quantityContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "10px",
  },
  quantityLabel: {
    color: "var(--color-forest)",
    fontWeight: "600",
  },
  quantityBox: {
    display: "flex",
    alignItems: "center",
    border: "2px solid var(--color-forest)",
    borderRadius: "8px",
    overflow: "hidden",
    background: "var(--color-bg)",
  },
  quantityButton: {
    background: "transparent",
    border: "none",
    padding: "8px 16px",
    color: "var(--color-forest)",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  quantityNumber: {
    padding: "0 14px",
    color: "var(--color-text)",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
  patternNotice: {
    background: "var(--color-cream)",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px dashed var(--color-forest)",
    fontSize: "0.9rem",
    color: "var(--color-forest)",
  },
  buttonsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  addToCartButton: (added) => ({
    background: added ? "var(--color-sage)" : "var(--color-forest)",
    color: "var(--color-bg)",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  }),
  buyNowButton: {
    background: "transparent",
    color: "var(--color-forest)",
    border: "2px solid var(--color-forest)",
    padding: "14px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Animation states & references
  const [flyingImage, setFlyingImage] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.data.find((p) => p._id === id);
          setProduct(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load product", err);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      return newQty > 0 ? newQty : 1;
    });
  };

  const addToCart = (e) => {
    if (!product) return;

    // 1. Trigger the Fly-to-Cart Animation from product image position
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      
      // Target cart icon location (top right header area)
      const cartX = window.innerWidth - 60;
      const cartY = 30;

      const startX = rect.left;
      const startY = rect.top;

      const deltaX = cartX - startX;
      const deltaY = cartY - startY;

      setFlyingImage({
        top: `${startY}px`,
        left: `${startX}px`,
        "--fly-x-mid": `${deltaX * 0.5}px`,
        "--fly-y-mid": `${deltaY * 0.3 - 60}px`,
        "--fly-end-x": `${deltaX}px`,
        "--fly-end-y": `${deltaY}px`,
      });

      setTimeout(() => {
        setFlyingImage(null);
      }, 800);
    }

    // 2. Cart Logic
    const qtyToAdd = product.category === "pattern" ? 1 : quantity;

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      if (product.category !== "pattern") {
        existingCart[existingIndex].quantity += qtyToAdd;
      }
    } else {
      existingCart.push({ ...product, quantity: qtyToAdd });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const buyNow = () => {
    if (!product) return;

    const qtyToAdd = product.category === "pattern" ? 1 : quantity;

    const directCheckoutItem = [{ ...product, quantity: qtyToAdd }];
    localStorage.setItem("directCheckoutItem", JSON.stringify(directCheckoutItem));

    router.push("/checkout?mode=buynow");
  };

  if (loading) {
    return (
      <main style={styles.centerBox}>
        <p style={styles.loadingText}>Ачаалж байна...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={styles.centerBox}>
        <h1 style={styles.notFoundTitle}>Бүтээгдэхүүн олдсонгүй</h1>
        <Link href="/shop" style={styles.notFoundLink}>
          Дэлгүүр рүү буцах
        </Link>
      </main>
    );
  }

  const isPattern = product.category === "pattern";

  return (
    <main style={styles.mainContainer}>
      <Link href="/shop" style={styles.backLink}>
        ← Дэлгүүр рүү буцах
      </Link>

      <div style={styles.gridContainer}>
        {/* Added ref here to track the starting point for the animation */}
        <div style={styles.imageWrapper} ref={imageRef}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={styles.image} 
          />
        </div>

        <div style={styles.detailsColumn}>
          <span style={styles.badge}>
            {isPattern ? "Цахим загвар" : "Бэлэн бүтээгдэхүүн"}
          </span>

          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>₮{product.price.toLocaleString()}</p>
          <p style={styles.description}>{product.description}</p>

          {!isPattern ? (
            <div style={styles.quantityContainer}>
              <span style={styles.quantityLabel}>Тоо ширхэг:</span>
              <div style={styles.quantityBox}>
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  style={styles.quantityButton}
                >
                  -
                </button>
                <span style={styles.quantityNumber}>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.patternNotice}>
              Шууд татаж авах боломжтой цахим загвар (Худалдаж авсны дараа таны захиалгын хэсэгт PDF илгээгдэнэ)
            </div>
          )}

          <div style={styles.buttonsColumn}>
            <button 
              onClick={addToCart}
              style={styles.addToCartButton(added)}
            >
              {added ? "Сагсанд нэмэгдлээ!" : isPattern ? "Загвар сагслах" : `Сагсанд нэмэх (${quantity})`}
            </button>

            <button 
              onClick={buyNow}
              style={styles.buyNowButton}
            >
              {isPattern ? "Загварыг шууд худалдаж авах " : "Шууд худалдаж авах "}
            </button>
          </div>
        </div>
      </div>

      {flyingImage && (
        <img 
          src={product.imageUrl} 
          alt="Flying item" 
          className="flying-item" 
          style={flyingImage} 
        />
      )}
    </main>
  );
}