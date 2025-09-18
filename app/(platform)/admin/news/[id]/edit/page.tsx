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

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  source: string
  external_url?: string
  featured_image: string
  is_featured: boolean
  is_published: boolean
  publish_date: string
}

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    publish_date: "",
  })

  const categories = ["Technology", "Health", "Sports", "Entertainment", "Business"]

  // Fetch article data based on articleId
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Mock data - replace with actual API call
        const mockArticle: NewsArticle = {
          id: articleId,
          title: "New Solar Farm Project in Kenya",
          excerpt:
            "A major new solar farm is set to begin construction in rural Kenya, boosting renewable energy capacity.",
          content: `
            <p>The Kenyan government has announced a new initiative to develop a large-scale solar farm in the Rift Valley region. This project aims to add 150 MW of clean energy to the national grid, significantly contributing to Kenya's renewable energy targets.</p>
            <h3>Project Details</h3>
            <ul>
              <li><strong>Capacity:</strong> 150 MW</li>
              <li><strong>Location:</strong> Rift Valley, Kenya</li>
              <li><strong>Developer:</strong> GreenPower Africa</li>
              <li><strong>Expected Completion:</strong> Q4 2025</li>
            </ul>
            <p>This development is part of a broader strategy to increase renewable energy penetration and reduce reliance on fossil fuels across East Africa.</p>
          `,
          category: "Project Updates",
          tags: ["solar", "kenya", "renewable energy", "project"],
          author: "Akili Energy Team",
          source: "Ministry of Energy, Kenya",
          external_url: "https://example.com/kenya-solar-project",
          featured_image: "/placeholder.svg?height=400&width=800",
          is_featured: true,
          is_published: true,
          publish_date: "2024-07-15T10:00",
        }

        setArticle(mockArticle)
        setFormData({
          title: mockArticle.title,
          excerpt: mockArticle.excerpt,
          content: mockArticle.content,
          category: mockArticle.category,
          tags: mockArticle.tags.join(", "),
          author: mockArticle.author,
          source: mockArticle.source,
          external_url: mockArticle.external_url || "",
          featured_image: mockArticle.featured_image,
          is_featured: mockArticle.is_featured,
          is_published: mockArticle.is_published,
          publish_date: mockArticle.publish_date,
        })
      } catch (error) {
        console.error("Error fetching article:", error)
        toast.error("Failed to load article")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [articleId])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/news/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(", ").filter((tag) => tag.trim() !== ""),
        }),
      })

      if (response.ok) {
        toast.success("Article updated successfully")
        router.push("/admin/news")
      } else {
        toast.error("Failed to update article")
      }
    } catch (error) {
      console.error("Error updating article:", error)
      toast.error("Failed to update article")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form data changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!article) {
    return <div>Article not found</div>
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
            <h1 className="text-3xl font-bold">Edit News Article</h1>
            <p className="text-muted-foreground">Update news article information</p>
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Article"}
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
