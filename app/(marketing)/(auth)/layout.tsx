import OneTapComponent from "@/components/one-tap";
import { UnifiedHeader } from "@/components/unified-header";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <OneTapComponent />
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />

        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}
