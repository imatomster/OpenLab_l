import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenLab_l",
  description: "Decentralized Data Labeling Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-cover bg-center`}
        style={{
          backgroundImage: "url('https://i.imgur.com/3aaKuwq.png')",
        }}
      >
        <NavBar items={siteConfig.navBar} />
        {children}
      </body>
    </html>
  );
}
