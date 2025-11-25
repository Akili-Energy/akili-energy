import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { LOCALE_KEY } from "../constants";
import { i18n } from "@/i18n-config";
import { cookies } from "next/headers";
import { UserRole } from "../types";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = Array.from(i18n.locales);

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (
    !supabaseResponse.cookies.get(LOCALE_KEY)?.value &&
    !(await cookies()).get(LOCALE_KEY)?.value
  ) {
    const locale = getLocale(request) || i18n.defaultLocale;
    supabaseResponse.cookies.set(LOCALE_KEY, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.VERCEL_ENV === "production",
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    if (user.confirmed_at) {
      const redirectTo = url.searchParams.get("redirect");
      url.pathname = redirectTo ? decodeURIComponent(redirectTo) : "/";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/email/verify";
      return NextResponse.redirect(url);
    }
  } else if (
    request.nextUrl.pathname.startsWith("/platform") ||
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    if (!user) {
      // no user, potentially respond by redirecting the user to the login page
      const { pathname } = url;
      url.pathname = "/login";
      url.searchParams.set("redirect", encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    } else if (!user.confirmed_at) {
      // user not confirmed, potentially respond by redirecting the user to the
      // email verification page
      const { pathname } = url;
      url.pathname = "/email/verify";
      url.searchParams.set("redirect", encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    } else if (request.nextUrl.pathname.startsWith("/admin")) {
      const { data, error } = await supabase.auth.getClaims();
      if (error) {
        console.error("Get claims (user role) error:", error.message);
      }
      const userRole = data?.claims?.user_role as UserRole | undefined;
      if (userRole !== "admin" && process.env.VERCEL_ENV !== "development") {
        console;
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  } else if (request.nextUrl.pathname.startsWith("/email/verify")) {
    if (!user) {
      // no user, potentially respond by redirecting the user to the login page
      url.pathname = "/login";
      return NextResponse.redirect(url);
    } else if (user.confirmed_at) {
      const redirectTo = url.searchParams.get("redirect");
      url.pathname = redirectTo ? decodeURIComponent(redirectTo) : "/";
      return NextResponse.redirect(url);
    }
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
