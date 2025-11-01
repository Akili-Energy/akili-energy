"use client";

import React, { useState, useActionState, useEffect, use } from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImageUpload from "@/components/admin/image-upload";
import WYSIWYGRichTextEditor from "@/components/admin/wysiwyg-rich-text-editor";
import {
  ContentActionState,
  getContentBySlug,
  saveContent,
} from "@/app/actions/content"; // Fetch action
import { contentCategory, contentStatus } from "@/lib/db/schema";
import TagsInput from "@/components/admin/tags-input";
import { Editorial } from "@/lib/types";

const initialState: ContentActionState = {
  success: false,
  message: "",
};

export default function CreateEditNewsPage({
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

  // State to hold the article data
  const [article, setArticle] = useState<Editorial | null>(null);
  const [isLoading, setLoading] = useState(true);

  // States for controlled components
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch initial article data on component mount
  useEffect(() => {
    const fetchArticle = async (articleSlug: string) => {
      setLoading(true);
      const fetchedArticle = await getContentBySlug(articleSlug, "news", true);
      console.log("Fetched Article:", fetchedArticle);
      if (fetchedArticle) {
        setArticle(fetchedArticle);
        setContent(fetchedArticle.newsArticle?.content || "");
        setTags(fetchedArticle.tags.map((tag) => tag.name) || []);
        setImageUrl(fetchedArticle.imageUrl || "");
      } else {
        toast.error("News article not found.");
        router.push("/admin/news");
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
      fetchArticle(contentSlug);
    } else {
      router.push("/admin/news");
    }
  }, [segments, router]);

  // Handle form submission success/error
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Optional: refetch data or optimistically update state
      router.push(
        state.status === "published" ? `/news/${state.slug}` : "/admin/news"
      );
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

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

  if (!article && mode === "edit") return null; // Or a "Not Found" component

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {mode} News Article
            </h1>
            <p className="text-gray-600 mt-2 truncate">
              {mode === "create"
                ? "Add a news article"
                : `Updating: ${article?.title}`}
            </p>
          </div>
        </div>
      </div>

      <form action={formAction}>
        <input type="hidden" name="type" value="news" />
        {/* Hidden field to pass the original slug for the WHERE clause */}
        {mode === "edit" && (
          <input type="hidden" name="originalSlug" value={slug ?? ""} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    maxLength={72}
                    defaultValue={article?.title}
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
                <div>
                  <Label htmlFor="summary">Excerpt *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    required
                    rows={3}
                    defaultValue={article?.summary}
                  />
                  {state.errors?.summary && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.summary[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <input type="hidden" name="content" value={content} />
                  <WYSIWYGRichTextEditor
                    value={content}
                    onChange={setContent}
                  />
                  {state.errors?.content && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.content[0]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">SEO Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    maxLength={72}
                    defaultValue={article?.metaTitle || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">SEO Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    rows={2}
                    maxLength={160}
                    defaultValue={article?.metaDescription || ""}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    required
                    maxLength={200}
                    defaultValue={article?.slug}
                    value={mode === "create" ? slug ?? undefined : undefined}
                    onChange={({ target: { value } }) => {
                      const newSlug = generateSlug(value);
                      value = newSlug;
                      setSlug(newSlug);
                    }}
                  />
                  {state.errors?.slug && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.slug[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    defaultValue={article?.status ?? "published"}
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
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isFeatured"
                    name="isFeatured"
                    defaultChecked={article?.featured ?? undefined}
                  />
                  <Label htmlFor="isFeatured">Feature article</Label>
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Saving..." : "Save Article"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    name="category"
                    required
                    defaultValue={article?.category}
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
                <div>
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Featured Image *</CardTitle>
              </CardHeader>
              <CardContent>
                <input type="hidden" name="featuredImage" value={imageUrl} />
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onRemove={() => setImageUrl("")}
                />
                {state.errors?.featuredImage && (
                  <p className="text-sm text-destructive mt-1">
                    {state.errors.featuredImage[0]}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
