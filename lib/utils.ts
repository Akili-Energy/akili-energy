import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCountryFlag(countryCode: string) {
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    console.error("Invalid country code format. Please use a two-letter uppercase code.");
    return "";
  }

  const OFFSET = 0x1F1E6 - 0x41;

  return String.fromCodePoint(countryCode.charCodeAt(0) + OFFSET, countryCode.charCodeAt(1) + OFFSET);
}

export function isValidUrl(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export async function generateNonce(): Promise<string[]> {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [nonce, hashedNonce];
};