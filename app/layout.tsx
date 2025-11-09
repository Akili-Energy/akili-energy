import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "material-symbols";
import "./globals.scss";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-context";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akili Energy - Intelligence for African Energy Transitions",
  description: "Strategic intelligence platform for the African energy sector",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <LanguageProvider>{children}</LanguageProvider>
          </Suspense>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
