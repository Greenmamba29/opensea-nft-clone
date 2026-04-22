import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OpenSea",
  description: "The best place to discover, own, and trade onchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[var(--os-bg)] text-[var(--os-text)] overflow-x-hidden min-h-screen">
        <Sidebar />
        <div className="flex flex-col ml-[52px] min-h-screen">
          <Header />
          <main className="flex-1 pb-9">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
