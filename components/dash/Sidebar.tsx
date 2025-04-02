"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Award, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Certificates",
      href: "/dashboard/certificates",
      icon: Award,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 flex items-center justify-between w-full px-3 py-2 bg-gray-900/90 md:hidden">
        <Link href="/dashboard">
          <Image src="/driver-ed-logo.png" alt="Logo" width={130} height={80} />
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-md shadow-md dark:bg-gray-800 z-60"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-opacity-50 bg-black/50 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - responsive */}
      <div
        className={cn(
          "fixed md:static max-h-screen inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard">
            <Image
              src="/driver-ed-logo.png"
              alt="Logo"
              width={130}
              height={80}
            />
          </Link>
        </div>

        <div className="flex-1 py-4 overflow-auto">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
