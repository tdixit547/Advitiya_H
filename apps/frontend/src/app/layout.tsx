import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import KeepAlive from "@/components/KeepAlive";
import CursorGlow from "@/components/animations/CursorGlow";
import ParticleField from "@/components/animations/ParticleField";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Smart Link Hub | Advitiya 2026",
  description: "One link to rule them all. Show the right links to the right people at the right time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} antialiased`}
        style={{
          background: '#000000',
          color: '#E6E6E6',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        <CursorGlow />
        <ParticleField count={40} />
        <KeepAlive />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
