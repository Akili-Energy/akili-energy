import OneTapComponent from "@/components/one-tap";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <OneTapComponent />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      <Toaster />
    </>
  );
}
