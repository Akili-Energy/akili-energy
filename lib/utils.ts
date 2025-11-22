import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Upload } from "tus-js-client";
import { createClient } from "@/lib/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCountryFlag(countryCode: string) {
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    console.error(
      "Invalid country code format. Please use a two-letter uppercase code."
    );
    return "";
  }

  const OFFSET = 0x1f1e6 - 0x41;

  return String.fromCodePoint(
    countryCode.charCodeAt(0) + OFFSET,
    countryCode.charCodeAt(1) + OFFSET
  );
}

export function isValidUrl(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

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
}

export function parseLocation(
  location: string | null
): [number, number] | null {
  if (!location) return null;
  const match = location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match) {
    // Return as [lat, lng] for Leaflet
    return [parseFloat(match[2]), parseFloat(match[1])];
  }
  return null;
}

export function formatMonth(locale: string, month?: string) {
  if (!month) return "";
  return new Date(month).toLocaleString(locale, {
    year: "2-digit",
    month: "short",
  });
}

export async function uploadFile(
  bucketName: string,
  fileName: string,
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return new Promise<string | null>((resolve, reject) => {
    const upload = new Upload(file, {
      // Supabase TUS endpoint (with direct storage hostname)
      endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session?.access_token}`,
        "x-upsert": "true", // optionally set upsert to true to overwrite existing files
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
      metadata: {
        bucketName: bucketName,
        objectName: fileName,
        contentType: file.type,
        cacheControl: "3600",
        metadata: JSON.stringify({
          // custom metadata passed to the user_metadata column
          yourCustomMetadata: true,
        }),
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError: function (error) {
        console.log("Failed because: " + error);
        reject(error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = (bytesUploaded / bytesTotal) * 100;
        onProgress?.({ progress: percentage });
        console.log(bytesUploaded, bytesTotal, percentage.toFixed(2) + "%");
      },
      onSuccess: function () {
        console.log(
          "Download %s from %s",
          (upload.file as File).name,
          upload.url
        );
        resolve(upload.url);
      },
    });
    // Check if there are any previous uploads to continue.
    return upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      // Start the upload
      upload.start();

      if (abortSignal?.aborted) {
        upload.abort();
        throw new Error("Upload cancelled");
      }
    });
  });
}

export function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const drpPattern = /%%drp:/i;
  return uuidRegex.test(id) && !drpPattern.test(id);
}

export function extractValidUUID(
  params: Record<string, string | string[]> | undefined,
  key: string = "id"
): string | null {
  if (!params || !params[key]) return null;
  const value = Array.isArray(params[key]) ? params[key][0] : params[key];
  console.log("Extracted UUID:", value);
  return typeof value === "string" && isValidUUID(value) ? value : null;
}

export function validateDatabaseUUID(
  id: string | undefined | null,
  fieldName: string = "ID"
): string {
  if (!id) {
    throw new Error(`${fieldName} is required`);
  }

  if (id.includes("%%drp:")) {
    console.error(`DRP redaction pattern detected in ${fieldName}:`, id);
    throw new Error(`Invalid ${fieldName} format - redacted value detected`);
  }

  if (!isValidUUID(id)) {
    throw new Error(`Invalid ${fieldName} format: ${id}`);
  }

  return id;
}

export function removeDuplicatesByProperty(arr: Array<Record<string, any>>, prop: string) {
  return arr.filter(
    (obj, index, self) => index === self.findIndex((t) => t[prop] === obj[prop])
  );
}
