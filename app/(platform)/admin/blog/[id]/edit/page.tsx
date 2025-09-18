"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import EnhancedRichTextEditor from "@/components/admin/enhanced-rich-text-editor"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  featured_image: string
  is_featured: boolean
  is_published: boolean
  publish_date: string
  seo_title?: string
  seo_description?: string
  reading_time?: number
}

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    featured_image: "",
    is_featured: false,
    is_published: false,
    publish_date: "",
    seo_title: "",
    seo_description: "",
    reading_time: "",
  })

  const categories = [
    "Energy Transition",
    "Renewable Energy",
    "Investment Analysis",
    "Policy & Regulation",
    "Technology Innovation",
    "Market Insights",
    "Sustainability",
    "Industry Trends",
    "Case Studies",
    "Opinion",
  ]

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      // Mock data - replace with actual API call
      const mockPost: BlogPost = {
        id: postId,
        title: "The Future of Solar Energy in Africa",
        excerpt: "Exploring the potential and challenges of solar energy adoption across African markets.",
        content: `
          <h2>Introduction</h2>
          <p>Solar energy represents one of the most promising renewable energy sources for Africa's sustainable development. With abundant sunshine across the continent, the potential for solar power generation is enormous.</p>
          
          <h3>Current Market Landscape</h3>
          <p>The African solar market has experienced significant growth in recent years, driven by:</p>
          <ul>
            <li>Declining technology costs</li>
            <li>Supportive government policies</li>
            <li>International investment flows</li>
            <li>Growing energy demand</li>
          </ul>
          
          <blockquote>
            "Africa has the potential to become a global leader in renewable energy, with solar power at the forefront of this transformation."
          </blockquote>
          
          <h3>Key Challenges</h3>
          <p>Despite the opportunities, several challenges remain:</p>
          <ol>
            <li><strong>Financing barriers:</strong> Limited access to affordable capital</li>
            <li><strong>Grid infrastructure:</strong> Inadequate transmission and distribution networks</li>
            <li><strong>Policy frameworks:</strong> Inconsistent regulatory environments</li>
          </ol>
          
          <p>The future of solar energy in Africa looks bright, with continued technological advancement and increasing investment interest.</p>
        `,
        category: "Renewable Energy",
        tags: ["solar", "africa", "renewable energy", "investment"],
        author: "Dr. Sarah Johnson",
        featured_image: "/placeholder.svg?height=400&width=800",
        is_featured: true,
        is_published: true,
        publish_date: "2024-01-15T10:00",
        seo_title: "Solar Energy Future in Africa - Market Analysis",
        seo_description: "Comprehensive analysis of solar energy potential in African markets",
        reading_time: 8,
      }

      setPost(mockPost)
      setFormData({
        title: mockPost.title,
        excerpt: mockPost.excerpt,
        content: mockPost.content,
        category: mockPost.category,
        tags: mockPost.tags.join(", "),
        author: mockPost.author,
        featured_image: mockPost.featured_image,
        is_featured: mockPost.is_featured,
        is_published: mockPost.is_published,
        publish_date: mockPost.publish_date,
        seo_title: mockPost.seo_title || "",
        seo_description: mockPost.seo_description || "",
        reading_time: mockPost.reading_time?.toString() || "",
      })
    } catch (error) {
      console.error("Error loading post:", error)
      toast.error("Failed to load blog post")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          reading_time: formData.reading_time ? Number.parseInt(formData.reading_time) : null,
        }),
      })

      if (response.ok) {
        toast.success("Blog post updated successfully")
        router.push("/admin/blog")
      } else {
        toast.error("Failed to update blog post")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blog post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Blog post not found</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-white p-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Blog Post</h1>
            <p className="text-muted-foreground">Update blog post information</p>
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
                    <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      value={formData.reading_time}
                      onChange={(e) => handleInputChange("reading_time", e.target.value)}
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

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
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
                  />
                </div>

                {/* SEO Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seo_title">SEO Title</Label>
                      <Input
                        id="seo_title"
                        value={formData.seo_title}
                        onChange={(e) => handleInputChange("seo_title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo_description">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        value={formData.seo_description}
                        onChange={(e) => handleInputChange("seo_description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                    />
                    <Label htmlFor="is_featured">Featured Post</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleInputChange("is_published", checked)}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Post"}
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
