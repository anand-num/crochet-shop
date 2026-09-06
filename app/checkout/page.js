"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buynow";

  const { isSignedIn, user, isLoaded } = useUser();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isBuyNow) {
      const directItem = JSON.parse(localStorage.getItem("directCheckoutItem")) || [];
      setCart(directItem);
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    }
    
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user, isBuyNow]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || !user) return;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          totalAmount: totalPrice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (isBuyNow) {
          localStorage.removeItem("directCheckoutItem");
        } else {
          localStorage.removeItem("cart");
        }

        setIsSubmitted(true);
      } else {
        alert("Захиалга өгөхөд алдаа гарлаа: " + (data.error || "Тодорхойгүй алдаа"));
      }
    } catch (err) {
      console.error("Checkout submission error:", err);
      alert("Ямар нэг зүйл буруу боллоо. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isLoaded) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <p style={{ color: "var(--color-forest)", fontSize: "1.2rem" }}>Дулаан дэлгэрэнгүйг ачаалж байна... 🧶</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ background: "var(--color-bg)", border: "2px solid var(--color-forest)", borderRadius: "16px", padding: "40px", boxShadow: "0 6px 16px rgba(56, 102, 65, 0.08)" }}>
          <h1 style={{ color: "var(--color-forest)", fontSize: "2.1rem", marginBottom: "15px" }}>
            Нэвтрэх шаардлагатай 🧶
          </h1>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, fontSize: "1.1rem", marginBottom: "30px", lineHeight: "1.5" }}>
            Төлбөр тооцоогоо аюулгүй хийхийн тулд Crochet Corner бүртгэлдээ нэвтэрнэ үү.
          </p>
          <SignInButton mode="modal">
            <button style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "1.1rem", cursor: "pointer" }}>
              Төлбөр хийхийн тулд нэвтрэх 🔒
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  if (isSubmitted) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ background: "var(--color-bg)", border: "2px solid var(--color-forest)", borderRadius: "16px", padding: "40px", boxShadow: "0 6px 16px rgba(56, 102, 65, 0.08)" }}>
          <h1 style={{ color: "var(--color-forest)", fontSize: "2.3rem", marginBottom: "15px" }}>
            Захиалга амжилттай хийгдлээ! 🎉🧶
          </h1>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "30px" }}>
            Баярлалаа, <strong>{formData.name}</strong>! Бид таны дулаахан бүтээлийг хайр халамжтайгаар баглаж байна. Баталжуулах имэйл <strong>{formData.email}</strong> хаяг руу илгээгдлээ.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
            <Link 
              href="/purchases" 
              style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1rem" }}
            >
              Миний захиалгуудыг харах 📦
            </Link>
            <Link 
              href="/shop" 
              style={{ background: "transparent", color: "var(--color-forest)", border: "2px solid var(--color-forest)", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1rem" }}
            >
              Үргэлжлүүлэн дэлгүүр хэсэх 🛍️
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <h1 style={{ color: "var(--color-forest)", fontSize: "2rem", marginBottom: "15px" }}>Таны төлбөр хийх хэсэг хоосон байна!</h1>
        <p style={{ color: "var(--color-forest)", opacity: 0.8, marginBottom: "25px" }}>Төлбөр хийхээсээ өмнө зарим бүтээгдэхүүн нэмнэ үү.</p>
        <Link 
          href="/shop" 
          style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "10px 22px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}
        >
          Дэлгүүр рүү очих 🧶
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "30px", textAlign: "center" }}>
        {isBuyNow ? "Шууд төлбөр тооцоо ⚡" : "Аюулгүй төлбөр тооцоо 🔒"}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", alignItems: "start", flexWrap: "wrap" }}>
        
        <form 
          onSubmit={handleSubmit} 
          style={{ background: "var(--color-bg)", border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 12px rgba(56, 102, 65, 0.05)", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h2 style={{ color: "var(--color-forest)", fontSize: "1.4rem", marginBottom: "5px" }}>Хүргэлтийн мэдээлэл 📦</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Бүтэн нэр</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Жишээ: Дорж" 
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Имэйл хаяг</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange}
              placeholder="dorj@example.com" 
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Гудамж, байрны хаяг</label>
            <input 
              type="text" 
              name="address" 
              required 
              value={formData.address} 
              onChange={handleChange}
              placeholder="Энхтайваны өргөн чөлөө" 
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Хот / Аймаг</label>
              <input 
                type="text" 
                name="city" 
                required 
                value={formData.city} 
                onChange={handleChange}
                placeholder="Улаанбаатар" 
                style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Шуудангийн код</label>
              <input 
                type="text" 
                name="postalCode" 
                required 
                value={formData.postalCode} 
                onChange={handleChange}
                placeholder="14200" 
                style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "700", fontSize: "1.1rem", marginTop: "10px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Захиалгыг боловсруулж байна... 🧶" : `Захиалга баталгаажуулах (₮${totalPrice.toLocaleString()}) 🛍️`}
          </button>
        </form>

        <div style={{ background: "var(--color-cream)", border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "25px" }}>
          <h2 style={{ color: "var(--color-forest)", fontSize: "1.4rem", marginBottom: "20px" }}>Захиалгын тойм 📋</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
            {cart.map((item) => (
              <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(56, 102, 65, 0.2)", paddingBottom: "10px" }}>
                <div>
                  <h4 style={{ color: "var(--color-forest)", fontSize: "1rem", margin: 0 }}>{item.name}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-forest)", opacity: 0.8 }}>Тоо: {item.quantity}</span>
                </div>
                <span style={{ color: "var(--color-forest)", fontWeight: "600" }}>₮{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid var(--color-forest)", paddingTop: "15px", fontWeight: "bold", fontSize: "1.2rem", color: "var(--color-forest)" }}>
            <span>Нийт дүн:</span>
            <span>₮{totalPrice.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </main>
  );
}