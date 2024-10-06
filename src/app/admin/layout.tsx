import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AlertTriangle } from "lucide-react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "App admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Toaster
        position="bottom-center"
        richColors
        theme="light"
        icons={{ error: <AlertTriangle color="red" className="h-5 w-5" /> }}
      />
    </html>
  );
}
