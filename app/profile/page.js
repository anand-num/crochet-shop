import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--color-forest)", fontSize: "2rem", marginBottom: "10px" }}>
        Welcome back, {user?.firstName || "Crafter"}! 🧶
      </h1>
      <p style={{ color: "var(--color-forest)", fontSize: "1.1rem", marginBottom: "30px" }}>
        Here are all your downloaded and purchased PDF patterns.
      </p>

      {/* Pattern list container */}
      <div style={{ background: "var(--color-cream, #fff)", padding: "20px", borderRadius: "12px", border: "2px solid var(--color-forest)" }}>
        <p style={{ color: "var(--color-forest)" }}>You have no downloaded patterns yet. Check out the shop to pick some up!</p>
      </div>
    </main>
  );
}