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
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { type Project, ProjectsService } from "@/lib/db/projects"
import LocationInput from "@/components/admin/location-input"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technology: "",
    capacity_mw: "",
    status: "",
    region: "",
    country: "",
    developer_id: "",
    announced_date: "",
    expected_completion: "",
    investment_amount: "",
    location: {
      text: "",
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    },
  })

  const technologies = ["Solar", "Wind", "Hydro", "Geothermal", "Biomass", "Storage", "Grid"]
  const statuses = ["Proposal", "Early-stage", "Late-Stage", "NtP/RtB", "Construction", "Operational"]

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    try {
      const projectData = await ProjectsService.getById(projectId)
      if (projectData) {
        setProject(projectData)
        setFormData({
          name: projectData.name,
          description: projectData.description || "",
          technology: projectData.technology,
          capacity_mw: projectData.capacity_mw.toString(),
          status: projectData.status,
          region: projectData.region,
          country: projectData.country,
          developer_id: projectData.developer_id,
          announced_date: projectData.announced_date.split("T")[0],
          expected_completion: projectData.expected_completion?.split("T")[0] || "",
          investment_amount: projectData.investment_amount?.toString() || "",
          location: {
            text:
              projectData.latitude && projectData.longitude
                ? `${projectData.latitude}, ${projectData.longitude}`
                : `${projectData.region}, ${projectData.country}`,
            latitude: projectData.latitude,
            longitude: projectData.longitude,
          },
        })
      }
    } catch (error) {
      console.error("Error loading project:", error)
      toast.error("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updated = await ProjectsService.update(projectId, {
        name: formData.name,
        description: formData.description,
        technology: formData.technology,
        capacity_mw: Number.parseFloat(formData.capacity_mw),
        status: formData.status as Project["status"],
        region: formData.region,
        country: formData.country,
        developer_id: formData.developer_id,
        announced_date: formData.announced_date,
        expected_completion: formData.expected_completion || undefined,
        investment_amount: formData.investment_amount ? Number.parseFloat(formData.investment_amount) : undefined,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
      })

      if (updated) {
        toast.success("Project updated successfully")
        router.push("/admin/projects")
      } else {
        toast.error("Failed to update project")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (location: { text?: string; latitude?: number; longitude?: number }) => {
    setFormData((prev) => ({ ...prev, location }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update project information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technology">Technology *</Label>
                <Select value={formData.technology} onValueChange={(value) => handleInputChange("technology", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologies.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity_mw">Capacity (MW) *</Label>
                <Input
                  id="capacity_mw"
                  type="number"
                  step="0.1"
                  value={formData.capacity_mw}
                  onChange={(e) => handleInputChange("capacity_mw", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="developer_id">Developer ID *</Label>
                <Input
                  id="developer_id"
                  value={formData.developer_id}
                  onChange={(e) => handleInputChange("developer_id", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="announced_date">Announced Date *</Label>
                <Input
                  id="announced_date"
                  type="date"
                  value={formData.announced_date}
                  onChange={(e) => handleInputChange("announced_date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_completion">Expected Completion</Label>
                <Input
                  id="expected_completion"
                  type="date"
                  value={formData.expected_completion}
                  onChange={(e) => handleInputChange("expected_completion", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment_amount">Investment Amount ($ million)</Label>
                <Input
                  id="investment_amount"
                  type="number"
                  step="0.1"
                  value={formData.investment_amount}
                  onChange={(e) => handleInputChange("investment_amount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                placeholder="Project description and details"
              />
            </div>

            <LocationInput
              value={formData.location}
              onChange={handleLocationChange}
              label="Project Location"
              placeholder="Enter project location"
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Project"}
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
