"use client";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();

  const to = searchParams.get("redirect");

  const [state, formAction, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      redirect(typeof to === "string" ? decodeURIComponent(to) : "/");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {typeof to === "string" && (
        <input
          type="hidden"
          id="redirect"
          name="redirect"
          value={decodeURIComponent(to)}
        />
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-akili-blue hover:bg-akili-blue/90"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      {!!state?.error && (
        <p className="text-sm text-red-500 text-center">{state.error}</p>
      )}
    </form>
  );
}
