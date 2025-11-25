"use client";

import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import type { accounts, CredentialResponse } from "google-one-tap";
import { useRouter, usePathname } from "next/navigation";
import { generateNonce } from "@/lib/utils";
import { useEffect, useState } from "react"; // Added useState
import { useLanguage } from "@/components/language-context";
import { useWindowSize } from "@/hooks/use-window-size";

// 1. Extend the Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: accounts;
    };
  }
}

const OneTapComponent = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathName = usePathname();
  const { width } = useWindowSize();
  const { language } = useLanguage();

  // 2. Add state to track if script is actually loaded
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const initializeGoogleOneTap = async () => {
    // Safety check
    if (typeof window === "undefined" || !window.google?.accounts?.id) {
      console.warn("Google script not ready yet");
      return;
    }

    console.log("Initializing Google One Tap");
    const [nonce, hashedNonce] = await generateNonce();

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session", error);
    }
    if (data.session) {
      router.push("/");
      return;
    }

    /* global google */
    // 3. Use window.google
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: CredentialResponse) => {
        try {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce,
          });

          if (error) throw error;
          router.push("/");
        } catch (error) {
          console.error("Error logging in with Google One Tap", error);
        }
      },
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
    });

    renderButton();
    window.google.accounts.id.prompt();
  };

  const renderButton = () => {
    // 4. Use window.google and strict checks
    const button = document.getElementById("signinDiv");
    if (!button || !window.google?.accounts?.id) return;

    window.google.accounts.id.renderButton(button, {
      theme: "outline",
      size: "large",
      text:
        pathName === "/signup"
          ? "signup_with"
          : pathName === "/login"
          ? "signin_with"
          : "continue_with",
      logo_alignment: "center",
      width: width < 480 ? Math.ceil(width - 80) : 400,
      locale: language,
    });
  };

  useEffect(() => {
    // 5. Only try to render the button if the script has reported it's loaded
    if (scriptLoaded && window.google?.accounts?.id) {
      renderButton();
    }
  }, [pathName, width, language, scriptLoaded]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      // 6. Set state when script finishes loading
      onLoad={() => {
        setScriptLoaded(true);
        initializeGoogleOneTap();
      }}
    />
  );
};

export default OneTapComponent;
