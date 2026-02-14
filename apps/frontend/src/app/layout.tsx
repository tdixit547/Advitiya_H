import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${firaCode.variable} antialiased`}
        style={{
          background: '#000000',
          color: '#00FF00',
          fontFamily: "'Fira Code', 'Courier New', monospace",
        }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
