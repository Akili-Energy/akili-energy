"use client";

import { useState, useActionState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImageUpload from "@/components/admin/image-upload";
import {
  ContentActionState,
  getContentBySlug,
  saveContent,
} from "@/app/actions/content"; // Fetch action
import { contentCategory, contentStatus } from "@/lib/db/schema";
import TagsInput from "@/components/admin/tags-input";
import { Editorial } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUppyWithSupabase } from "@/hooks/use-uppy-with-supabase";
import Dashboard from "@uppy/dashboard";
import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

const initialState: ContentActionState = {
  success: false,
  message: "",
};

export default function CreateEditResearchPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = use(params);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveContent,
    initialState
  );

  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  // State to hold the report data
  const [report, setReport] = useState<Editorial | null>(null);
  const [isLoading, setLoading] = useState(true);

  // States for controlled components
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState<string>();

  // Fetch initial report data on component mount
  useEffect(() => {
    const fetchReport = async (reportSlug: string) => {
      setLoading(true);
      const fetchedReport = await getContentBySlug(
        reportSlug,
        "research",
        true
      );
      if (fetchedReport) {
        setReport(fetchedReport);
        setTags(fetchedReport.tags.map((tag) => tag.name) || []);
        setImageUrl(fetchedReport.imageUrl || "");
        const reportUrl = fetchedReport.researchReport?.reportUrl ?? "";
        setFileUrl(reportUrl);
        setFileName(reportUrl.split("/").pop());
      } else {
        toast.error("Research report not found.");
        router.push("/admin/research");
      }
      setLoading(false);
    };

    console.log("Segments:", segments);
    if (segments.length === 1 && segments[0] === "create") {
      setMode("create");
      setLoading(false);
    } else if (segments.length === 2 && segments[1] === "edit") {
      setMode("edit");
      const contentSlug = segments[0];
      setSlug(contentSlug);
      fetchReport(contentSlug);
    } else {
      router.push("/admin/research");
    }
  }, [segments, router]);

  // Handle form submission success/error
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Optional: refetch data or optimistically update state
      router.push(
        state.status === "published"
          ? `/research/${state.slug}`
          : "/admin/research"
      );
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  // Initialize Uppy instance with the 'sample' bucket specified for uploads
  const uppy = useUppyWithSupabase({
    bucketName: "documents",
    folder: "research",
    upsert: true,
  });
  useEffect(() => {
    if (!isLoading || (report && mode === "edit")) {
      // Set up Uppy Dashboard to display as an inline component within a specified target
      uppy.use(Dashboard, {
        inline: true, // Ensures the dashboard is rendered inline
        limit: 1,
        height: 200,
        target: "#drag-drop-area", // HTML element where the dashboard renders
        showProgressDetails: true, // Show progress details for file uploads
        proudlyDisplayPoweredByUppy: false,
        showRemoveButtonAfterComplete: true,
      });
    }
  }, [report, isLoading, mode]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!report && mode === "edit") return null; // Or a "Not Found" component

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/research">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {mode} Research Report
            </h1>
            <p className="text-gray-600 mt-2 truncate">
              {mode === "create"
                ? "Add a new research report"
                : `Updating: ${report?.title}`}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="type" value="research" />
                {/* Hidden field to pass the original slug for the WHERE clause */}
                {mode === "edit" && (
                  <input type="hidden" name="originalSlug" value={slug ?? ""} />
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    maxLength={100}
                    defaultValue={report?.title}
                    onChange={({ target: { value } }) => {
                      if (mode === "create") {
                        setSlug(generateSlug(value));
                      }
                    }}
                  />
                  {state.errors?.title && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.title[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    required
                    maxLength={254}
                    defaultValue={report?.slug}
                    value={mode === "create" ? slug ?? undefined : undefined}
                    onChange={({ target: { value } }) => {
                      const newSlug = generateSlug(value);
                      value = newSlug;
                      setSlug(newSlug);
                    }}
                    disabled={mode === "edit"}
                  />
                  {state.errors?.slug && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.slug[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      name="category"
                      required
                      defaultValue={report?.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentCategory.enumValues.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="capitalize"
                          >
                            {cat.replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.errors?.category && (
                      <p className="text-sm text-destructive mt-1">
                        {state.errors.category[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      defaultValue={report?.status ?? "published"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentStatus.enumValues.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.errors?.status && (
                      <p className="text-sm text-destructive mt-1">
                        {state.errors.status[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Excerpt *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    required
                    rows={3}
                    defaultValue={report?.summary}
                  />
                  {state.errors?.summary && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.summary[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <input type="hidden" name="tags" value={tags.join(",")} />
                  <TagsInput
                    value={tags}
                    onChange={setTags}
                    placeholder="Add up to 10 tags"
                    maxTags={10}
                  />
                  {state.errors?.tags && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.tags[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Featured Image *</Label>
                  <input type="hidden" name="featuredImage" value={imageUrl} />
                  <ImageUpload
                    value={imageUrl}
                    onChange={setImageUrl}
                    onRemove={() => setImageUrl("")}
                    // placeholder="Upload featured image"
                  />
                  {state.errors?.featuredImage && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.featuredImage[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>PDF Document</Label>
                  <input type="hidden" name="fileDocument" value={fileUrl} />
                  <div id="drag-drop-area" className="flex w-full" />
                  {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="pdf_upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload PDF document
                          </span>
                          <Input
                            id="pdf_upload"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) {
                                setFileName(undefined);
                                setFileUrl("");
                                return;
                              }

                              const reader = new FileReader();
                              reader.onload = (e) => {
                                const result = e.target?.result as string;
                                setFileUrl(result);
                                setFileName(file.name);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                          PDF up to 10MB
                        </p>
                      </div>
                    </div>
                    {fileName && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-green-600">
                          ✓ File uploaded: {fileName}
                        </p>
                      </div>
                    )}
                    {state.errors?.fileDocument && (
                      <p className="text-sm text-destructive mt-1">
                        {state.errors.fileDocument[0]}
                      </p>
                    )}
                  </div> */}
                  {state.errors?.fileDocument && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.fileDocument[0]}
                    </p>
                  )}
                </div>

                {/* SEO Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">SEO Title</Label>
                      <Input
                        id="metaTitle"
                        name="metaTitle"
                        maxLength={72}
                        defaultValue={report?.metaTitle || ""}
                        placeholder="Leave empty to use report title"
                      />
                      {state.errors?.metaTitle && (
                        <p className="text-sm text-destructive mt-1">
                          {state.errors.metaTitle[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">SEO Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        rows={2}
                        maxLength={160}
                        defaultValue={report?.metaDescription || ""}
                        placeholder="Meta description for search engines"
                      />
                      {state.errors?.metaDescription && (
                        <p className="text-sm text-destructive mt-1">
                          {state.errors.metaDescription[0]}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      name="isFeatured"
                      defaultChecked={report?.featured ?? undefined}
                    />
                    <Label htmlFor="isFeatured">Feature article</Label>
                    {state.errors?.isFeatured && (
                      <p className="text-sm text-destructive mt-1">
                        {state.errors.isFeatured[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Report"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
