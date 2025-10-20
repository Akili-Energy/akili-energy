"use client";

import React, { useState, useActionState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImageUpload from "@/components/admin/image-upload";
import WYSIWYGRichTextEditor from "@/components/admin/wysiwyg-rich-text-editor";
import { ContentActionState, saveContent } from "@/app/actions/content";
import { getContentBySlug } from "@/app/actions/content"; // Fetch action
import { contentCategory, contentStatus } from "@/lib/db/schema";
import TagsInput from "@/components/admin/tags-input";
import { Editorial } from "@/lib/types";

const initialState: ContentActionState = {
  success: false,
  message: "",
};

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveContent,
    initialState
  );

  // State to hold the post data
  const [post, setPost] = useState<Editorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for controlled components
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch initial post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      const fetchedPost = await getContentBySlug(params.slug, "blog");
      if (fetchedPost) {
        setPost(fetchedPost);
        setContent(fetchedPost.blogPost?.content || "");
        setTags(fetchedPost.tags.map((tag) => tag.name) || []);
        setImageUrl(fetchedPost.imageUrl || "");
      } else {
        toast.error("Blog post not found.");
        router.push("/admin/blog");
      }
      setIsLoading(false);
    };
    fetchPost();
  }, [params.slug, router]);

  // Handle form submission success/error
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Optional: refetch data or optimistically update state
      router.push(state.status === "published" ? `/blog/${state.slug}` : "/admin/blog");
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

  if (!post) return null; // Or a "Not Found" component

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Blog Post</h1>
            <p className="text-gray-600 mt-2 truncate">Editing: {post.title}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="type" value="blog" />
                {/* Hidden field to pass the original slug for the WHERE clause */}
                <input type="hidden" name="originalSlug" value={params.slug} />
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={post.title}
                    maxLength={72}
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
                    defaultValue={post.slug}
                    onChange={({ target: { value } }) =>
                      (value = generateSlug(value))
                    }
                    maxLength={200}
                    required
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
                      defaultValue={post.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentCategory.enumValues.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                    <Label htmlFor="status">Status *</Label>
                    <Select name="status" defaultValue={post.status} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentStatus.enumValues.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Excerpt *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    defaultValue={post.summary}
                    rows={3}
                    placeholder="Brief summary of the blog post"
                    required
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
                  <Label htmlFor="content">Content *</Label>
                  <input type="hidden" name="content" value={content} />
                  <WYSIWYGRichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your blog post content here..."
                  />
                  {state.errors?.content && (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.content[0]}
                    </p>
                  )}
                </div>

                {/* SEO Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">SEO Title</Label>
                      <Input
                        id="metaTitle"
                        name="metaTitle"
                        defaultValue={post.metaTitle ?? ""}
                        placeholder="Leave empty to use post title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">SEO Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        defaultValue={post.metaDescription ?? ""}
                        rows={2}
                        placeholder="Meta description for search engines"
                        maxLength={160}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      name="isFeatured"
                      defaultChecked={post.featured ?? undefined}
                    />
                    <Label htmlFor="isFeatured">Featured Post</Label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving Changes..." : "Save Changes"}
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
