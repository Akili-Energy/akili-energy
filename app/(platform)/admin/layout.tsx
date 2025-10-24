"use client";

import type React from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Suspense>
          <AdminSidebar />
        </Suspense>
        <main className="flex-1 overflow-auto p-6">
          <div>{children}</div>
          <Toaster />
        </main>
      </div>
    </div>
  );
}
