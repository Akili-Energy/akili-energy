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
import { ArrowLeft, Upload } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import ImageUpload from "@/components/admin/image-upload"

export default function CreateResearchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    research_type: "",
    category: "",
    authors: "",
    publication_date: new Date().toISOString().slice(0, 10),
    pdf_url: "",
    cover_image: "",
    is_premium: false,
    is_published: false,
    tags: "",
    executive_summary: "",
    page_count: "",
    file_size: "",
  })

  const researchTypes = [
    "Market Report",
    "Industry Analysis",
    "Technology Assessment",
    "Policy Brief",
    "Investment Guide",
    "Country Profile",
    "Sector Overview",
    "White Paper",
    "Case Study",
  ]

  const categories = [
    "Solar Energy",
    "Wind Energy",
    "Hydropower",
    "Geothermal",
    "Biomass",
    "Energy Storage",
    "Grid Infrastructure",
    "Policy & Regulation",
    "Financing",
    "Market Analysis",
    "Technology Innovation",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          authors: formData.authors
            .split(",")
            .map((author) => author.trim())
            .filter(Boolean),
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          page_count: formData.page_count ? Number.parseInt(formData.page_count) : null,
        }),
      })

      if (response.ok) {
        toast.success("Research report created successfully")
        router.push("/admin/research")
      } else {
        toast.error("Failed to create research report")
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

  const handleFileUpload = async (file: File) => {
    // Simulate file upload - in real app, upload to your storage service
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Mock upload response
      const mockUrl = `/uploads/research/${file.name}`
      handleInputChange("pdf_url", mockUrl)
      handleInputChange("file_size", `${(file.size / 1024 / 1024).toFixed(1)} MB`)
      toast.success("File uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload file")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/research">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Research
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Research Report</h1>
          <p className="text-muted-foreground">Add a new research report</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Information</CardTitle>
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
                <Label htmlFor="research_type">Research Type *</Label>
                <Select
                  value={formData.research_type}
                  onValueChange={(value) => handleInputChange("research_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select research type" />
                  </SelectTrigger>
                  <SelectContent>
                    {researchTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="publication_date">Publication Date</Label>
                <Input
                  id="publication_date"
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) => handleInputChange("publication_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authors">Authors (comma-separated) *</Label>
                <Input
                  id="authors"
                  value={formData.authors}
                  onChange={(e) => handleInputChange("authors", e.target.value)}
                  placeholder="John Doe, Jane Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="page_count">Page Count</Label>
                <Input
                  id="page_count"
                  type="number"
                  value={formData.page_count}
                  onChange={(e) => handleInputChange("page_count", e.target.value)}
                  placeholder="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="renewable energy, market analysis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_size">File Size</Label>
                <Input
                  id="file_size"
                  value={formData.file_size}
                  onChange={(e) => handleInputChange("file_size", e.target.value)}
                  placeholder="2.5 MB"
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                placeholder="Brief description of the research report"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="executive_summary">Executive Summary</Label>
              <Textarea
                id="executive_summary"
                value={formData.executive_summary}
                onChange={(e) => handleInputChange("executive_summary", e.target.value)}
                rows={5}
                placeholder="Key findings and recommendations"
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                value={formData.cover_image}
                onChange={(url) => handleInputChange("cover_image", url)}
                onRemove={() => handleInputChange("cover_image", "")}
                placeholder="Upload cover image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf_upload">PDF Document</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="pdf_upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">Upload PDF document</span>
                      <input
                        id="pdf_upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                      />
                    </label>
                    <p className="mt-1 text-sm text-gray-500">PDF up to 50MB</p>
                  </div>
                </div>
                {formData.pdf_url && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-green-600">✓ File uploaded: {formData.pdf_url.split("/").pop()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => handleInputChange("is_premium", checked)}
                />
                <Label htmlFor="is_premium">Premium Content</Label>
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

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Report"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
