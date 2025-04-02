// app/fonts.ts (or lib/fonts.ts)
import { Allerta_Stencil, Metal_Mania } from "next/font/google";
import localFont from "next/font/local";

// Google Fonts
export const allertaStencil = Allerta_Stencil({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-allerta-stencil",
});

export const metalMania = Metal_Mania({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-metal-mania",
});

// Note: Grenze Gotisch with variable weight syntax
// You'll need to import it with 'next/font/google' variable font method
// This is a simplified example - check Next.js docs for variable font specifics

// Local font (for Saira Stencil One)
export const sairaStencilOne = localFont({
  src: "../public/fonts/SairaStencilOne-Regular.ttf", // Adjust path as needed
  display: "swap",
  variable: "--font-saira-stencil-one",
});
