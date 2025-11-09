"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import z from "zod";
import { db } from "@/lib/db/drizzle";
import { userRole, users } from "@/lib/db/schema";
import { jwtDecode } from "jwt-decode";

const authSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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
  });
  if (!validation.success) {
    return { error: z.flattenError(validation.error).formErrors[0] };
  }

  const { email, password } = validation.data;

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
    return { error: "Account not confirmed" };
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
      firstName: z.string(),
      lastName: z.string(),
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
  });
  if (!validation.success) {
    return { error: z.flattenError(validation.error).formErrors[0] };
  }

  const { email, password, firstName, lastName } = validation.data;

  const { auth } = await createClient();

  const {
    data: { user },
    error,
  } = await auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}` },
      emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL,
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


export async function getUserRole() {
  const { auth } = await createClient();
  const {
    data: { session },
  } = await auth.getSession();
  console.log("Session:", session);
  if (session) {
    const jwt = jwtDecode(session.access_token);
    console.log("JWT:", jwt);
    const role = jwt.user_role;
    if (role) return role as (typeof userRole)[number];
    return (await getCurrentUser())?.role;
  }
  return null;
}

export async function getCurrentUser() {
  const { auth } = await createClient();
  const {
    data: { user },
  } = await auth.getUser();
  if (user) {
    return db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user?.id ?? ""),
    });
  }
  return null;
}
