import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Navigation Bar */}
      <nav style={{ style: "flex", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1>🧶 My Crochet Shop</h1>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>Welcome to my handmade crochet wonderland!</h2>
        <p>Browse cozy plushies, custom garments, and digital patterns.</p>
      </section>
    </main>
  );
}