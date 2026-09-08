import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Enoki.vibes",
  description: "Гараар урласан сүлжмэл тоглоом, цүнх болон загварууд",
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: "/enoki_logo.png",
  },
};

export default async function RootLayout({ children }) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="mn">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        </head>
        <body style={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100vh", 
          margin: 0, 
          fontFamily: "'Sour Gummy', cursive, sans-serif",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-forest)"
        }}>
          {/* Client-side Header with Slide-out Menu */}
          <Header userId={userId} />

          <div style={{ flex: 1, background: "var(--color-bg)" }}>
            {children}
          </div>
          
          <ThemeToggle />
        </body>
      </html>
    </ClerkProvider>
  );
}