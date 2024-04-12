"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="items-center space-x-2 ">
        <Icons.logo className="size-8" />
      </Link>
      <nav></nav>
    </div>
  );
}
