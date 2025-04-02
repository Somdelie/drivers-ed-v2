"use client";
// components/layout/Header.tsx
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
// import { ModeToggle } from "../ui/mode-toggle"; // You'll need to create this or use an existing dark mode toggle
import { Award } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect in client component
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  return (
    <header
      className={`sticky border-b hidden md:flex top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-sm shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          <span className="hidden text-xl font-bold sm:inline-block">
            DriversED
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
