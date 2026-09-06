import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  // 🔒 Replace this with your actual admin email or Clerk ID for security!
  const ADMIN_EMAIL = "tahiasharsan@gmail.com"; 

  if (userEmail !== ADMIN_EMAIL) {
    return (
      <main style={{ padding: "80px 20px", textAlign: "center", color: "var(--color-forest)" }}>
        <h1>Хандах эрх хүрэхгүй байна 🚫</h1>
        <p>Та энэ хуудсыг үзэх эрхгүй байна.</p>
      </main>
    );
  }

  return <AdminDashboardClient />;
}