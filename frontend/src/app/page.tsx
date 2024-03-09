import Image from "next/image";
import { NavBar } from "@/components/NavBar";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar items={siteConfig.navBar} />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        hero
      </div>
    </main>
  );
}
