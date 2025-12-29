import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinTrack - Kelola Keuanganmu Lebih Cerdas",
  description: "Aplikasi pengelola keuangan pribadi dengan AI. Track pengeluaran dan pemasukan dengan mudah menggunakan bahasa natural.",
  keywords: ["finance tracker", "expense tracker", "money management", "AI", "budgeting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
