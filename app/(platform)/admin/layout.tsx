import type React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
          <Toaster />
        </main>
      </div>
    </div>
  );
}
