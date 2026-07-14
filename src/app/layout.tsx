import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dziekanat: Gra o Zaliczenie",
  description: "Przegladarkowa gra RPG/management o przetrwaniu wspolczesnej uczelni.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <div className="min-h-screen">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
