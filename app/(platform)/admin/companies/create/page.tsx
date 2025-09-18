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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Plus, Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/image-upload"

interface Employee {
  id: string
  name: string
  position: string
  email: string
  phone: string
  linkedin: string
  bio: string
  profile_image: string
}

export default function CreateCompanyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [employeesOpen, setEmployeesOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
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

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      position: "",
      email: "",
      phone: "",
      linkedin: "",
      bio: "",
      profile_image: "",
    }
    setEmployees([...employees, newEmployee])
  }

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const updateEmployee = (id: string, field: keyof Employee, value: string) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          founded_year: formData.founded_year ? Number.parseInt(formData.founded_year) : null,
          employee_count: formData.employee_count ? Number.parseInt(formData.employee_count) : null,
          employees: employees.filter((emp) => emp.name.trim() !== ""), // Only include employees with names
        }),
      })

      if (response.ok) {
        toast.success("Company created successfully")
        router.push("/admin/companies")
      } else {
        toast.error("Failed to create company")
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

  return (
    <div className="container mx-auto py-6 max-h-screen overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Company</h1>
        <p className="text-muted-foreground">Add a new company to the database</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        {/* Employees Section - Collapsible */}
        <Card>
          <Collapsible open={employeesOpen} onOpenChange={setEmployeesOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <CardTitle>Team Members ({employees.length})</CardTitle>
                  </div>
                  {employeesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Add key team members and employees to the company profile
                  </p>
                  <Button type="button" variant="outline" onClick={addEmployee}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>

                {employees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No team members added yet</p>
                    <p className="text-sm">Click "Add Employee" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {employees.map((employee, index) => (
                      <Card key={employee.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Employee #{index + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmployee(employee.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Full Name *</Label>
                              <Input
                                value={employee.name}
                                onChange={(e) => updateEmployee(employee.id, "name", e.target.value)}
                                placeholder="John Doe"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Position *</Label>
                              <Input
                                value={employee.position}
                                onChange={(e) => updateEmployee(employee.id, "position", e.target.value)}
                                placeholder="CEO, CTO, etc."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={employee.email}
                                onChange={(e) => updateEmployee(employee.id, "email", e.target.value)}
                                placeholder="john@company.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input
                                value={employee.phone}
                                onChange={(e) => updateEmployee(employee.id, "phone", e.target.value)}
                                placeholder="+1 234 567 8900"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>LinkedIn Profile</Label>
                              <Input
                                type="url"
                                value={employee.linkedin}
                                onChange={(e) => updateEmployee(employee.id, "linkedin", e.target.value)}
                                placeholder="https://linkedin.com/in/johndoe"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Profile Image</Label>
                            <ImageUpload
                              value={employee.profile_image}
                              onChange={(url) => updateEmployee(employee.id, "profile_image", url)}
                              onRemove={() => updateEmployee(employee.id, "profile_image", "")}
                              placeholder="Upload profile photo"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                              value={employee.bio}
                              onChange={(e) => updateEmployee(employee.id, "bio", e.target.value)}
                              rows={3}
                              placeholder="Brief professional biography..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 pb-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Company"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
