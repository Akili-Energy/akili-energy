import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmailVerificationForm from "./email-verification-form";
import { Suspense } from "react";

export default function VerifyEmail() {

  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-12 md:px-10 md:py-20">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
            <CardFooter>
              <Suspense><EmailVerificationForm /></Suspense>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
