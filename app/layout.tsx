import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Multiverso Academy — Preparación Inteligente de Oposiciones",
  description: "Academia online de nueva generación de Multiverso IA. Temarios condensados con metodología NotebookLM, estudio sin distracciones y test interactivos de oposiciones.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
        {/* Background Multiverso atmosphere */}
        <div className="nebula nebula-1" aria-hidden="true" />
        <div className="nebula nebula-2" aria-hidden="true" />
        <div className="bg-watermark" aria-hidden="true" />

        <Navbar />
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
