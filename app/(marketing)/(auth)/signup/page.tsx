
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GoogleAuth } from "@/components/google-auth"
import Link from "next/link"
import { Suspense } from "react"
import SignUpForm from "./_components/sign-up-form"

export default function SignupPage() {
  return (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-akili-blue">Create account</CardTitle>
            <CardDescription className="text-center">Join Akili Energy and get started today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GoogleAuth type="signup" />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Suspense><SignUpForm /></Suspense>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-akili-blue hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>);
}
