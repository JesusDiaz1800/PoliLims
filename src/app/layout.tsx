
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../lib/performance-monitor";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "PoliLims - Sistema de Gestión de Laboratorio",
  description: "Sistema integral de gestión de laboratorio para el control de calidad y ensayos",
  keywords: "LIMS, laboratorio, gestión, calidad, ensayos, PoliLims",
  authors: [{ name: "PoliLims Team" }],
  robots: "index, follow",
  openGraph: {
    title: "PoliLims - Sistema de Gestión de Laboratorio",
    description: "Sistema integral de gestión de laboratorio",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1C3664',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1C3664" />
        <meta name="color-scheme" content="dark light" />
        
        {/* Preconnect para optimización de rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} style={{ fontDisplay: 'swap' } as any}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
