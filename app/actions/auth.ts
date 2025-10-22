"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import z from "zod";

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

function validate(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function login(_: unknown, formData: FormData) {
  const validation = validate(formData);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { email, password } = validation.data;

  const { auth } = await createClient();
  const { error } = await auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  return { success: "Logged in successfully" };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
