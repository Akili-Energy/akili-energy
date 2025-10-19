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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImageUpload from "@/components/admin/image-upload";
import WYSIWYGRichTextEditor from "@/components/admin/wysiwyg-rich-text-editor";
import { saveBlogPost } from "@/app/actions/content"; // Import the server action
import { contentCategory, contentStatus } from "@/lib/db/schema";
import TagsInput from "@/components/admin/tags-input";

const initialState = {
  success: false,
  message: "",
  errors: undefined,
  slug: undefined,
};

export default function CreateBlogPage() {
  const router = useRouter();

  // useActionState hook manages form state and transitions
  const [state, formAction, isPending] = useActionState(
    saveBlogPost,
    initialState
  );

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    status: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  // Effect to handle post-submission logic
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Redirect to the edit page of the newly created post
      router.push(`/blog/${state.slug}`);
    } else if (state.message && !state.errors) {
      // Show general errors that are not field-specific
      toast.error(state.message);
    }
  }, [state, router]);

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Fixed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Blog Post
            </h1>
            <p className="text-gray-600 mt-2">
              Write and publish a new blog article
            </p>
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
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    maxLength={72}
                    onChange={({ target: { value } }) => {
                      handleInputChange("title", value);
                      handleInputChange(
                        "slug",
                        generateSlug(value).slice(0, 72)
                      );
                    }}
                  />
                  {state.errors?.title ? (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.title[0]}
                    </p>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">
                      {formData.title.length}/72 characters
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      handleInputChange("slug", generateSlug(e.target.value))
                    }
                    maxLength={200}
                    required
                  />
                  {state.errors?.slug ? (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.slug[0]}
                    </p>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">
                      Preview: /blog/{formData.slug}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" required>
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
                    <Select
                      name="status"
                      defaultValue="published"
                      required
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
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
                    onChange={(e) =>
                      handleInputChange("summary", e.target.value)
                    }
                    rows={3}
                    placeholder="Brief summary of the blog post"
                    required
                  />
                  {state.errors?.summary ? (
                    <p className="text-sm text-destructive mt-1">
                      {state.errors.summary[0]}
                    </p>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">
                      {formData.summary.length} characters
                    </div>
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
                        value={formData.metaTitle}
                        onChange={(e) =>
                          handleInputChange("metaTitle", e.target.value)
                        }
                        placeholder="Leave empty to use post title"
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {formData.metaTitle.length}/72 characters
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">SEO Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) =>
                          handleInputChange("metaDescription", e.target.value)
                        }
                        rows={2}
                        placeholder="Meta description for search engines"
                        maxLength={160}
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {formData.metaDescription.length}/160 characters
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" name="isFeatured" />
                    <Label htmlFor="isFeatured">Featured Post</Label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={isPending}>
                    {isPending
                      ? "Saving..."
                      : formData.status === "draft"
                      ? "Save Draft"
                      : "Publish Post"}
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
