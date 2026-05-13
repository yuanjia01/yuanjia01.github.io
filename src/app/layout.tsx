import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Armando Picón | Mobile Developer & Content Creator",
  description: "Android Engineer, Technical Leader, Speaker, Designer, and Content Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
