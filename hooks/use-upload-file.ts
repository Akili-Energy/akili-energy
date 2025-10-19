import * as React from "react";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

// Define the shape of the uploaded file data
export interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File) {
    try {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be under 5MB");
    }

    setIsUploading(true);
    setUploadingFile(file);

    // Simulate upload progress
    // const simulateProgress = async () => {
    //   let currentProgress = 0;
    //   while (currentProgress < 95) {
    //     // Stop at 95% to wait for the actual upload
    //     await new Promise((resolve) => setTimeout(resolve, 100));
    //     currentProgress += 5;
    //     setProgress(Math.min(currentProgress, 95));
    //   }
    // };

    // const progressPromise = simulateProgress();

      // const supabase = createClient();

      // const filePath = `content/${file.name}`; // Assumes a 'public' folder in your bucket

      // const { error: uploadError } = await supabase.storage
      //   .from("images") // IMPORTANT: Replace with your bucket name
      //   .upload(filePath, file);

      // await progressPromise; // Wait for the simulated progress to complete
      // setProgress(100);

      // if (uploadError) {
      //   throw new Error(uploadError.message);
      // }

      // const { data } = supabase.storage
      //   .from("images") // IMPORTANT: Replace with your bucket name
      //   .getPublicUrl(filePath);

      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress >= 90) {
          clearInterval(progressInterval);
        }
        setProgress(Math.min(currentProgress, 90));
      }, 100);

      // Convert file to base64
      const base64Url = await fileToBase64(file);

      clearInterval(progressInterval);
      setProgress(100);

      const newFile: UploadedFile = {
        // key: filePath,
        key: file.name,
        name: file.name,
        size: file.size,
        type: file.type,
        url: base64Url,
        // url: data.publicUrl,
      };

      setUploadedFile(newFile);
      onUploadComplete?.(newFile);

      return newFile;
    } catch (error) {
      setProgress(0);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      onUploadError?.(error);
      return undefined;
    } finally {
      // Short delay before resetting to show 100% completion
      setTimeout(() => {
        setProgress(0);
        setIsUploading(false);
        setUploadingFile(undefined);
      }, 500);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}
