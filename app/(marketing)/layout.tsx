import { UnifiedHeader } from "@/components/unified-header";
import { Suspense, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: ReactNode }) {
  const {auth} = await createClient();
  const {
    data: { user },
  } = await auth.getUser();
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense>
        <UnifiedHeader user={user} />
      </Suspense>

      {children}
    </div>
  );
}
