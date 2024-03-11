"use client";
import * as React from "react";
import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useAleph } from '@/context/AlephContext'; // Adjust the import path as necessary
interface MainNavProps {
  items?: NavItem[];
}

export function NavBar({ items }: MainNavProps) {
  const { loadAccountsFromExtensions } = useAleph();

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {items?.length ? (
          <nav className="flex gap-6">
            {items?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium text-muted-foreground",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    {item.title}
                  </Link>
                )
            )}
            <button
              onClick={loadAccountsFromExtensions}
              className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted-background focus:outline-none focus:ring"
            >
              Connect Wallet
            </button>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
