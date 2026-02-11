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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-context";
import { ThemeToggle } from "./theme-toggle";
import { AkiliLogo } from "@/components/akili-logo";
import { UserNav } from "./user-nav"; // Import the new component
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

export function UnifiedHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navLinks = [
    { href: "/platform", label: t("nav.platform") },
    { href: "/news-research", label: t("nav.research") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];
  const [user, setUser] = useState<User | null>(null);
  const { auth } = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await auth.getUser();
      if (error) {
        if (error.message !== "Auth session missing!") {
          console.error("Error fetching user:", error.message);
        }
      } else {
        setUser(data.user);
      }
    };
    getUser();

    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
      setMobileMenuOpen(false);
    };
  }, []);

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors font-medium",
                  pathname.startsWith(link.href) &&
                    "text-akili-blue dark:text-akili-green font-semibold"
                )}
              >
                {link.label}
              </Link>
            ))}
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
            {/* Conditional Rendering: UserNav or Login Button */}
            {user ? (
              <UserNav user={user} />
            ) : (
              <Button
                asChild
                className="bg-akili-blue hover:bg-akili-blue/90 dark:bg-akili-green dark:hover:bg-akili-green/90"
              >
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
            )}
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
                  <AkiliLogo />
                  <span className="text-xl font-bold">
                    <span className="text-akili-blue dark:text-white">
                      Akili
                    </span>
                    <span className="text-akili-green">Energy</span>
                  </span>
                </Link>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-akili-blue dark:hover:text-akili-green transition-colors py-2",
                        pathname.startsWith(link.href) &&
                          "text-akili-blue dark:text-akili-green font-semibold"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
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
                  {/* Mobile Conditional Rendering */}
                  {user ? (
                    <div className="space-y-2">
                      <Button asChild className="w-full" variant="outline">
                        <Link
                          href="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </Button>
                      <form action={logout} className="w-full">
                        <Button
                          type="submit"
                          className="w-full"
                          variant="ghost"
                        >
                          Log out
                        </Button>
                      </form>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
