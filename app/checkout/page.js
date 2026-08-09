"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function CheckoutPage() {
  const router = useRouter();
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

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    
    // Auto-fill name and email if user is already signed in via Clerk
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    localStorage.removeItem("cart");
    setIsSubmitted(true);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Show loading state while Clerk checks authentication
  if (!isLoaded) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <p style={{ color: "var(--color-forest)", fontSize: "1.2rem" }}>Loading cozy details... 🧶</p>
      </main>
    );
  }

  // If user is NOT signed in, prompt them to sign in
  if (!isSignedIn) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ background: "var(--color-bg)", border: "2px solid var(--color-forest)", borderRadius: "16px", padding: "40px", boxShadow: "0 6px 16px rgba(56, 102, 65, 0.08)" }}>
          <h1 style={{ color: "var(--color-forest)", fontSize: "2.1rem", marginBottom: "15px" }}>
            Sign In Required 🧶
          </h1>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, fontSize: "1.1rem", marginBottom: "30px", lineHeight: "1.5" }}>
            Please sign in to your Crochet Corner account to proceed securely with your checkout.
          </p>
          <SignInButton mode="modal">
            <button style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "1.1rem" }}>
              Sign In to Checkout 🔒
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
            Order Placed Successfully! 🎉🧶
          </h1>
          <p style={{ color: "var(--color-forest)", opacity: 0.85, fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "30px" }}>
            Thank you, <strong>{formData.name}</strong>! We are packing your cozy creations with love and care. A confirmation email has been sent to <strong>{formData.email}</strong>.
          </p>
          <Link 
            href="/shop" 
            style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1rem" }}
          >
            Continue Shopping 🛍️
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main style={{ padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <h1 style={{ color: "var(--color-forest)", fontSize: "2rem", marginBottom: "15px" }}>Your cart is empty!</h1>
        <p style={{ color: "var(--color-forest)", opacity: 0.8, marginBottom: "25px" }}>Add some items to your cart before checking out.</p>
        <Link 
          href="/shop" 
          style={{ background: "var(--color-forest)", color: "var(--color-bg)", padding: "10px 22px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}
        >
          Go to Shop 🧶
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2.5rem", marginBottom: "30px", textAlign: "center" }}>
        Secure Checkout 🔒
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", alignItems: "start", flexWrap: "wrap" }}>
        
        {/* Shipping Form */}
        <form 
          onSubmit={handleSubmit} 
          style={{ background: "var(--color-bg)", border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 12px rgba(56, 102, 65, 0.05)", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h2 style={{ color: "var(--color-forest)", fontSize: "1.4rem", marginBottom: "5px" }}>Shipping Details 📦</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Jane Doe" 
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange}
              placeholder="jane@example.com" 
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Street Address</label>
            <input 
              type="text" 
              name="address" 
              required 
              value={formData.address} 
              onChange={handleChange}
              placeholder="123 Cozy Lane" 
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>City</label>
              <input 
                type="text" 
                name="city" 
                required 
                value={formData.city} 
                onChange={handleChange}
                placeholder="Springfield" 
                style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: "var(--color-forest)", fontWeight: "600", fontSize: "0.95rem" }}>Postal Code</label>
              <input 
                type="text" 
                name="postalCode" 
                required 
                value={formData.postalCode} 
                onChange={handleChange}
                placeholder="12345" 
                style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--color-forest)", background: "#ffffff", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ background: "var(--color-forest)", color: "var(--color-bg)", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "700", fontSize: "1.1rem", marginTop: "10px" }}
          >
            Place Order (${totalPrice.toFixed(2)}) 🧶
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div style={{ background: "var(--color-cream)", border: "2px solid var(--color-forest)", borderRadius: "12px", padding: "25px" }}>
          <h2 style={{ color: "var(--color-forest)", fontSize: "1.4rem", marginBottom: "20px" }}>Order Summary 📋</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
            {cart.map((item) => (
              <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(56, 102, 65, 0.2)", paddingBottom: "10px" }}>
                <div>
                  <h4 style={{ color: "var(--color-forest)", fontSize: "1rem", margin: 0 }}>{item.name}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-forest)", opacity: 0.8 }}>Qty: {item.quantity}</span>
                </div>
                <span style={{ color: "var(--color-forest)", fontWeight: "600" }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid var(--color-forest)", paddingTop: "15px", fontWeight: "bold", fontSize: "1.2rem", color: "var(--color-forest)" }}>
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </main>
  );
}