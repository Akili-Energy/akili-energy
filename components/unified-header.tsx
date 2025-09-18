"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-context";
import { ThemeToggle } from "./theme-toggle";
import { AkiliLogo } from "@/components/akili-logo";

export function UnifiedHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <AkiliLogo />
            <span className="text-xl font-bold">
              <span className="text-akili-blue dark:text-white">Akili</span>
              <span className="text-akili-green">Energy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/platform"
              className={cn(
                "text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors font-medium",
                pathname.startsWith("/platform") &&
                  "text-akili-blue dark:text-akili-green font-semibold"
              )}
            >
              {t("nav.platform")}
            </Link>
            <Link
              href="/news-research"
              className={cn(
                "text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors font-medium",
                pathname.startsWith("/news-research") &&
                  "text-akili-blue dark:text-akili-green font-semibold"
              )}
            >
              {t("nav.research")}
            </Link>
            <Link
              href="/blog"
              className={cn(
                "text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors font-medium",
                pathname.startsWith("/blog") &&
                  "text-akili-blue dark:text-akili-green font-semibold"
              )}
            >
              {t("nav.blog")}
            </Link>
            <Link
              href="/contact"
              className={cn(
                "text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors font-medium",
                pathname.startsWith("/contact") &&
                  "text-akili-blue dark:text-akili-green font-semibold"
              )}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Select
              value={language}
              onValueChange={(value: "en" | "fr") => setLanguage(value)}
            >
              <SelectTrigger className="w-20 border-0 bg-transparent">
                <Globe className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">FR</SelectItem>
                <SelectItem value="en">EN</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
            <Button
              asChild
              className="bg-akili-blue hover:bg-akili-blue/90 dark:bg-akili-green dark:hover:bg-akili-green/90"
            >
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Logo */}
                <Link
                  href="/"
                  className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 bg-akili-green rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">
                    <span className="text-akili-blue dark:text-white">
                      Akili
                    </span>
                    <span className="text-akili-green">Energy</span>
                  </span>
                </Link>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/platform"
                    className={cn(
                      "text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors py-2",
                      pathname.startsWith("/platform") &&
                        "text-akili-blue dark:text-akili-green font-semibold"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.platform")}
                  </Link>
                  <Link
                    href="/research"
                    className={cn(
                      "text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors py-2",
                      pathname.startsWith("/research") &&
                        "text-akili-blue dark:text-akili-green font-semibold"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.research")}
                  </Link>
                  <Link
                    href="/blog"
                    className={cn(
                      "text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors py-2",
                      pathname.startsWith("/blog") &&
                        "text-akili-blue dark:text-akili-green font-semibold"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.blog")}
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      "text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors py-2",
                      pathname.startsWith("/contact") &&
                        "text-akili-blue dark:text-akili-green font-semibold"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.contact")}
                  </Link>
                </nav>

                {/* Mobile Language & CTA */}
                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Select
                      value={language}
                      onValueChange={(value: "en" | "fr") => setLanguage(value)}
                    >
                      <SelectTrigger>
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <ThemeToggle />
                  </div>
                  <Button
                    asChild
                    className="w-full bg-akili-blue hover:bg-akili-blue/90 dark:bg-akili-green dark:hover:bg-akili-green/90"
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("nav.login")}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
