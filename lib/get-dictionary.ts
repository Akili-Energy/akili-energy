import "server-only";
import type { Locale } from "@/i18n-config";
import { cookies } from "next/headers";
import { LOCALE_KEY } from "./constants";
import { cacheTag } from "next/cache";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
};

export async function getLanguage() {
  const cookieStore = await cookies();
  return (cookieStore.get(LOCALE_KEY)?.value ?? "fr") as Locale;
}

export const getDictionary = async () => {
  'use cache: private';
  cacheTag(LOCALE_KEY);
  let locale = await getLanguage();
  return dictionaries[locale]?.() ?? dictionaries.fr();
};
