import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CoachEnControl",
  description: "Remote coaching platform for gym training and diet tracking.",
};

import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-[#101010] text-zinc-900 dark:text-white min-h-screen`}>
        <ThemeProvider>
          <LanguageProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
