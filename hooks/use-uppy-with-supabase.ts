"use client";

import { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { createClient } from "@/lib/supabase/client";

/**
 * Custom hook for configuring Uppy with Supabase authentication and TUS resumable uploads
 * @param {Object} options - Configuration options for the Uppy instance.
 * @param {string} options.bucketName - The bucket name in Supabase where files are stored.
 * @returns {Object} uppy - Uppy instance with configured upload settings.
 */
export const useUppyWithSupabase = ({
  bucketName,
  folder,
  upsert = false,
  onUploadSuccess,
}: {
  bucketName: string;
  folder?: string;
  upsert?: boolean;
  onUploadSuccess?: (fileUrl: string) => void;
}) => {
  // Initialize Uppy instance only once
  const [uppy] = useState(() => new Uppy());
  // Initialize Supabase client
  const supabase = createClient();
  useEffect(() => {
    const initializeUppy = async () => {
      // Retrieve the current user's session for authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();
      uppy
        .use(Tus, {
          // Supabase TUS endpoint (with direct storage hostname)
          endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.storage.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delays for resumable uploads
          headers: {
            authorization: `Bearer ${session?.access_token}`, // User session access token
            apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // API key for Supabase
            "x-upsert": upsert ? "true" : "false", // Custom header to indicate upsert behavior
          },
          uploadDataDuringCreation: true, // Send metadata with file chunks
          removeFingerprintOnSuccess: true, // Remove fingerprint after successful upload
          chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
          allowedMetaFields: [
            "bucketName",
            "objectName",
            "contentType",
            "cacheControl",
            "metadata",
          ], // Metadata fields allowed for the upload
          onError: (error) => console.error("Upload error:", error), // Error handling for uploads
        })
        .on("file-added", (file) => {
          // Attach metadata to each file, including bucket name and content type
          file.meta = {
            ...file.meta,
            bucketName, // Bucket specified by the user of the hook
            objectName: folder ? `${folder}/${file.name}` : file.name, // Use file name as object name
            contentType: file.type, // Set content type based on file MIME type
            metadata: JSON.stringify({
              // custom metadata passed to the user_metadata column
              yourCustomMetadata: true,
            }),
          };
        })
        .on("file-removed", async (file) => {
          await supabase.storage
            .from(bucketName)
            .remove([
              (file.meta.objectName as string) ?? folder
                ? `${folder}/${file.name}`
                : (file.name as string),
            ]);
        }).on("upload-success", (file, response) => {
          console.log("Upload successful:", file, response);
          console.log(file);
          console.log(response);
        });
    };
    // Initialize Uppy with Supabase settings
    initializeUppy();
  }, [uppy, bucketName, folder]);
  // Return the configured Uppy instance
  return uppy;
};
