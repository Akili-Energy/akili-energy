"use client";

import { resendVerificationEmail } from "@/app/actions/auth";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationForm() {
  const searchParams = useSearchParams();
  const to = searchParams.get("redirect");

  const [state, formAction, isPending] = useActionState(
    resendVerificationEmail,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      {typeof to === "string" && (
        <input type="hidden" name="redirect" value={decodeURIComponent(to)} />
      )}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Resend Verification
      </Button>
    </form>
  );
}
