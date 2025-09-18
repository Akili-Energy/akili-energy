"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Edit, Trash2, User } from "lucide-react"
import Link from "next/link"
import { type Company, type CompanyTeamMember, CompaniesService } from "@/lib/db/companies"
import ImageUpload from "@/components/admin/image-upload"

export default function CompanyTeamPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [teamMembers, setTeamMembers] = useState<CompanyTeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<CompanyTeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    linkedin_url: "",
    image_url: "",
  })

  useEffect(() => {
    loadData()
  }, [companyId])

  const loadData = async () => {
    try {
      const [companyData, teamData] = await Promise.all([
        CompaniesService.getById(companyId),
        CompaniesService.getTeamMembers(companyId),
      ])
      setCompany(companyData)
      setTeamMembers(teamData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMember) {
        const updated = await CompaniesService.updateTeamMember(editingMember.id, formData)
        if (updated) {
          setTeamMembers(teamMembers.map((member) => (member.id === editingMember.id ? updated : member)))
        }
      } else {
        const created = await CompaniesService.addTeamMember({
          company_id: companyId,
          ...formData,
        })
        if (created) {
          setTeamMembers([...teamMembers, created])
        }
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving team member:", error)
    }
  }

  const handleEdit = (member: CompanyTeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || "",
      linkedin_url: member.linkedin_url || "",
      image_url: member.image_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const success = await CompaniesService.deleteTeamMember(id)
      if (success) {
        setTeamMembers(teamMembers.filter((member) => member.id !== id))
      }
    }
  }

  const resetForm = () => {
    setEditingMember(null)
    setFormData({
      name: "",
      position: "",
      bio: "",
      linkedin_url: "",
      image_url: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading team...</div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Company not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/companies">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{company.name} - Team</h1>
          <p className="text-gray-600 mt-2">Manage team members and employees</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Team Members ({teamMembers.length})</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  placeholder="Brief biography or description"
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => handleInputChange("image_url", url)}
                  onRemove={() => handleInputChange("image_url", "")}
                  placeholder="Upload profile image"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">{editingMember ? "Update Member" : "Add Member"}</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center border">
                    {member.image_url ? (
                      <img
                        src={member.image_url || "/placeholder.svg"}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-blue-600 font-medium">{member.position}</p>
                    {member.bio && <p className="text-gray-600 mt-2 line-clamp-3">{member.bio}</p>}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No team members added yet.</p>
          <p className="text-gray-400 text-sm">Click "Add Team Member" to get started.</p>
        </div>
      )}
    </div>
  )
}
