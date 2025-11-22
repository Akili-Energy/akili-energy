"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import z from "zod";
import { db } from "@/lib/db/drizzle";
import { userRole, users } from "@/lib/db/schema";
import { redirect } from "next/navigation";

const authSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
  redirect: z.string().optional(),
});

export type AuthResult = {
  success?: string;
  error?: string;
};

export async function login(
  _: unknown,
  formData: FormData
): Promise<AuthResult> {
  const validation = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect"),
  });
  if (!validation.success) {
    return { error: z.flattenError(validation.error).formErrors[0] };
  }

  const { email, password, redirect: redirectPath } = validation.data;

  const { auth } = await createClient();
  const {
    data: { user },
    error,
  } = await auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message };
  }

  if (!user?.confirmed_at) {
    redirect(
      `/email/verify${
        redirectPath
          ? `?${new URLSearchParams({ redirect: redirectPath }).toString()}`
          : ""
      }`
    );
    return { error: "Account not confirmed. Please verify your email." };
  }

  revalidatePath("/", "layout");

  return { success: "Logged in successfully" };
}

export async function signup(
  _: unknown,
  formData: FormData
): Promise<AuthResult> {
  const signupSchema = authSchema
    .extend({
      confirmPassword: z.string(),
      firstName: z
        .string()
        .min(2, { error: "First name must be at least 2 characters long." })
        .trim(),
      lastName: z
        .string()
        .min(2, { error: "Last name must be at least 2 characters long." })
        .trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const validation = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    redirect: formData.get("redirect"),
  });
  if (!validation.success) {
    return { error: z.flattenError(validation.error).formErrors[0] };
  }

  const {
    email,
    password,
    firstName,
    lastName,
    redirect: redirectPath,
  } = validation.data;

  const { auth } = await createClient();

  const {
    data: { user },
    error,
  } = await auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}` },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}${
        redirectPath
          ? `?${new URLSearchParams({ redirect: redirectPath }).toString()}`
          : ""
      }`,
    },
  });

  if (error) {
    console.error("Sign-up error:", error.message);
    return { error: error.message };
  }

  if (user && process.env.NODE_ENV === "development") {
    await db.insert(users).values({
      id: user.id,
      email: user.email ?? email,
      name: user.user_metadata.full_name ?? `${firstName} ${lastName}`,
      profilePictureUrl: user.user_metadata.avatar_url,
    });
  }

  revalidatePath("/", "layout");
  return {
    success:
      "Account created successfully! Please check your email to confirm your account.",
  };
}

export async function logout() {
  const { auth } = await createClient();
  const { error } = await auth.signOut();

  if (error) {
    console.error("Error logging out:", error);
    redirect("/error");
  }

  // Revalidate the entire layout to ensure the header updates everywhere
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resendVerificationEmail(
  _: unknown,
  formData: FormData
): Promise<AuthResult> {
  const { auth } = await createClient();

  const {
    data: { user },
    error: userError,
  } = await auth.getUser();
  if (userError) {
    console.error("Get user error:", userError.message);
    return { error: "User not found" };
  }

  const redirectPath = formData.get("redirect") as string | null;
  const { data, error: emailError } = await auth.resend({
    type: "signup",
    email: user?.email ?? "",
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}${
        redirectPath
          ? `?${new URLSearchParams({ redirect: redirectPath }).toString()}`
          : ""
      }`,
    },
  });
  if (emailError) {
    console.error("Resend email error:", emailError.message);
    return {
      error: "Could not resend verification email. Please try again later.",
    };
  }
  console.log("Resend verification email data:", data);
  return {
    success:
      "Verification e-mail has successfully been sent. Please check your inbox.",
  };
}

export async function getUserRole() {
  const { auth } = await createClient();
  const { data, error } = await auth.getClaims();
  if (error) {
    console.error("Get claims (user role) error:", error.message);
    return null;
  }
  if (data?.claims?.user_role)
    return data.claims.user_role as (typeof userRole.enumValues)[number];
  if (data) {
    const role = data.claims?.user_role;
    if (role) return role as (typeof userRole.enumValues)[number];
    return (await getCurrentUser())?.role;
  }
  return null;
}

export async function getCurrentUser() {
  const { auth } = await createClient();
  const {
    data: { user },
    error,
  } = await auth.getUser();
  if (error) {
    console.error("Get user error:", error.message);
    return null;
  }
  if (user) {
    return db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user?.id ?? ""),
    });
  }
  return null;
}
