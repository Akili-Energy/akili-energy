"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  BarChart3,
  Briefcase,
  Calculator,
  Calendar,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { AkiliLogo } from "@/components/akili-logo";

const navigation = [
  { name: "Dashboard", href: "/platform", icon: BarChart3 },
  { name: "Deals", href: "/platform/deals", icon: Briefcase },
  { name: "Projects", href: "/platform/projects", icon: Building2 },
  { name: "Companies", href: "/platform/companies", icon: Users },
  { name: "Simulator", href: "/platform/simulator", icon: Calculator },
  { name: "Events", href: "/platform/events", icon: Calendar },
];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-800 shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
            <Link href="/" className="flex items-center space-x-3">
              <AkiliLogo />
              <span className="text-lg font-bold text-white">
                Akili<span className="text-akili-green">Energy</span>
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item, i) => {
              return (
                <Suspense key={i}>
                  <SideBarLink
                    key={item.href}
                    item={item}
                    onClick={() => setSidebarOpen(false)}
                  />
                </Suspense>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-800 shadow-xl">
          <div className="flex h-16 items-center px-4 border-b border-gray-700">
            <Link href="/" className="flex items-center space-x-3">
              <AkiliLogo />
              <span className="text-lg font-bold text-white">
                Akili<span className="text-akili-green">Energy</span>
              </span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item, i) => {
              return (
                <Suspense key={i}>
                  <SideBarLink key={item.href} item={item} />
                </Suspense>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        {/* <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
              <input
                className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent"
                placeholder="Search deals, projects, companies..."
                type="search"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div> */}

        {/* Page content */}
        <main className="py-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Loading...
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function SideBarLink({
  onClick,
  item,
}: {
  item: (typeof navigation)[number];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  return (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
        pathname === item.href
          ? "bg-akili-green text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      )}
      onClick={onClick}
    >
      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
      {item.name}
    </Link>
  );
}
