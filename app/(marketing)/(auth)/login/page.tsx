import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleAuth } from "@/components/google-auth";
import Link from "next/link";
import LoginForm from "./login-form";
import { Suspense } from "react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirect = undefined } = (await searchParams) ?? {};
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-akili-blue">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your Akili Energy account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleAuth type="signin" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            href={`/signup${redirect ? `?redirect=${redirect.includes("/") ? encodeURIComponent(redirect) : redirect}` : ""}`}
            className="text-akili-blue hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
