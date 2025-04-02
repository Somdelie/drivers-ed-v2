import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function calculateExpiryDate(date: Date): Date {
  const expiryDate = new Date(date);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set expiry 1 year from issue date
  return expiryDate;
}

export function isExpired(expiryDate: Date | null | undefined): boolean {
  if (!expiryDate) return false;
  return new Date() > new Date(expiryDate);
}

export function formatPercentage(value: string | number): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "0.0%" : `${numValue.toFixed(1)}%`;
}
