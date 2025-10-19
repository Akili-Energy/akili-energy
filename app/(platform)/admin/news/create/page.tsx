"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import ImageUpload from "@/components/admin/image-upload"
import EnhancedRichTextEditor from "@/components/admin/wysiwyg-rich-text-editor"

export default function CreateNewsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    source: "",
    external_url: "",
    featured_image: "",
    is_featured: false,
    is_published: false,
    publish_date: new Date().toISOString().slice(0, 16),
  })

  const categories = [
    "Market Analysis",
    "Policy & Regulation",
    "Technology",
    "Financing",
    "M&A",
    "Project Updates",
    "Industry News",
    "Sustainability",
    "Energy Transition",
    "Investment",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        toast.success("News article created successfully")
        router.push("/admin/news")
      } else {
        toast.error("Failed to create news article")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-white p-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create News Article</h1>
            <p className="text-muted-foreground">Add a new news article</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Source *</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => handleInputChange("source", e.target.value)}
                      placeholder="e.g., Reuters, Bloomberg, Company Press Release"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="external_url">External URL</Label>
                    <Input
                      id="external_url"
                      type="url"
                      value={formData.external_url}
                      onChange={(e) => handleInputChange("external_url", e.target.value)}
                      placeholder="https://example.com/original-article"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input
                      id="publish_date"
                      type="datetime-local"
                      value={formData.publish_date}
                      onChange={(e) => handleInputChange("publish_date", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      placeholder="renewable energy, solar, africa, investment"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    rows={3}
                    placeholder="Brief summary of the news article"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <ImageUpload
                    value={formData.featured_image}
                    onChange={(url) => handleInputChange("featured_image", url)}
                    onRemove={() => handleInputChange("featured_image", "")}
                    placeholder="Upload featured image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <EnhancedRichTextEditor
                    value={formData.content}
                    onChange={(content) => handleInputChange("content", content)}
                    placeholder="Write your news article content here..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                    />
                    <Label htmlFor="is_featured">Featured Article</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleInputChange("is_published", checked)}
                    />
                    <Label htmlFor="is_published">Publish Now</Label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Article"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
