import { UnifiedHeader } from "@/components/unified-header";
import { Suspense, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense>
        <UnifiedHeader/>
      </Suspense>

      {children}
    </div>
  );
}
