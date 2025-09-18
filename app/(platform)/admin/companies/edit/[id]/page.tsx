"use client"

import type React from "react"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/image-upload"

interface Company {
  id: string
  name: string
  description?: string
  sector: string
  headquarters: string
  country: string
  website?: string
  logo_url?: string
  founded_year?: number
  employee_count?: number
}

export default function EditCompanyPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sector: "",
    headquarters: "",
    country: "",
    website: "",
    logo_url: "",
    founded_year: "",
    employee_count: "",
  })

  const sectors = [
    "Solar",
    "Wind",
    "Hydro",
    "Geothermal",
    "Biomass",
    "Energy Storage",
    "Grid Infrastructure",
    "Energy Efficiency",
    "Oil & Gas",
    "Nuclear",
  ]

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/admin/companies/${params.id}`)
        if (response.ok) {
          const company: Company = await response.json()
          setFormData({
            name: company.name,
            description: company.description || "",
            sector: company.sector,
            headquarters: company.headquarters,
            country: company.country,
            website: company.website || "",
            logo_url: company.logo_url || "",
            founded_year: company.founded_year?.toString() || "",
            employee_count: company.employee_count?.toString() || "",
          })
        } else {
          toast.error("Failed to load company data")
          router.push("/admin/companies")
        }
      } catch (error) {
        toast.error("An error occurred while loading company data")
        router.push("/admin/companies")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchCompany()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/companies/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          founded_year: formData.founded_year ? Number.parseInt(formData.founded_year) : null,
          employee_count: formData.employee_count ? Number.parseInt(formData.employee_count) : null,
        }),
      })

      if (response.ok) {
        toast.success("Company updated successfully")
        router.push("/admin/companies")
      } else {
        toast.error("Failed to update company")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading company data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Company</h1>
        <p className="text-muted-foreground">Update company information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector *</Label>
                <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headquarters">Headquarters *</Label>
                <Input
                  id="headquarters"
                  value={formData.headquarters}
                  onChange={(e) => handleInputChange("headquarters", e.target.value)}
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => handleInputChange("founded_year", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_count">Employee Count</Label>
                <Input
                  id="employee_count"
                  type="number"
                  value={formData.employee_count}
                  onChange={(e) => handleInputChange("employee_count", e.target.value)}
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
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <ImageUpload
                value={formData.logo_url}
                onChange={(url) => handleInputChange("logo_url", url)}
                onRemove={() => handleInputChange("logo_url", "")}
                placeholder="Upload company logo"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Company"}
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
