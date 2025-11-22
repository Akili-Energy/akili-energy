"use client";

// import type { CredentialResponse } from "google-one-tap";
// import { createClient } from "@/lib/supabase/client";

interface GoogleAuthProps {
  type: "signin" | "signup";
}

// async function handleSignInWithGoogle(response: CredentialResponse) {
//   const supabase = createClient();
//   const { data, error } = await supabase.auth.signInWithIdToken({
//     provider: "google",
//     token: response.credential,
//     // nonce: "<NONCE>",
//   });
// }

export function GoogleAuth({ type }: GoogleAuthProps) {

  return (
    <div
      id="signinDiv"
      className="w-full flex items-center justify-center space-x-2"
    />
    // <>
    //   <div
    //     id="g_id_onload"
    //     data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    //     data-context={type}
    //     data-ux_mode="popup"
    //     data-callback="handleSignInWithGoogle"
    //     data-auto_select="true"
    //     data-itp_support="true"
    //     data-use_fedcm_for_prompt="true"
    //   ></div>

    //   <div
    //     className="w-full flex items-center justify-center space-x-2 g_id_signin"
    //     data-type="standard"
    //     data-shape="rectangular"
    //     data-theme="outline"
    //     data-text={`${type}_with`}
    //     data-size="large"
    //     data-logo_alignment="center"
    //     data-width="400"
    //   ></div>
    // </>
  );
}
