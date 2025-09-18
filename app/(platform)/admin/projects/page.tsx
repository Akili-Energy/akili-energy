"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Zap, MapPin, Grid, List, Search } from "lucide-react"
import Link from "next/link"
import { type Project, ProjectsService } from "@/lib/db/projects"

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const projectsData = await ProjectsService.getAll()
      setProjects(projectsData)
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technology.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const success = await ProjectsService.delete(id)
      if (success) {
        setProjects(projects.filter((project) => project.id !== id))
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Proposal: "bg-gray-100 text-gray-800",
      "Early-stage": "bg-blue-100 text-blue-800",
      "Late-Stage": "bg-yellow-100 text-yellow-800",
      "NtP/RtB": "bg-orange-100 text-orange-800",
      Construction: "bg-purple-100 text-purple-800",
      Operational: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getTechnologyColor = (technology: string) => {
    const colors: Record<string, string> = {
      Solar: "bg-yellow-100 text-yellow-800",
      Wind: "bg-blue-100 text-blue-800",
      Hydro: "bg-cyan-100 text-cyan-800",
      Geothermal: "bg-red-100 text-red-800",
      Biomass: "bg-green-100 text-green-800",
      Storage: "bg-purple-100 text-purple-800",
      Grid: "bg-gray-100 text-gray-800",
    }
    return colors[technology] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage energy projects and infrastructure developments</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Search and View Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects by name, country, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>
            <Grid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <List className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        /* Card View */
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <Badge className={getTechnologyColor(project.technology)}>{project.technology}</Badge>
                    </div>

                    {project.description && <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-medium">{project.capacity_mw} MW</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {project.region}, {project.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Announced</p>
                        <p className="font-medium">{new Date(project.announced_date).toLocaleDateString()}</p>
                      </div>
                      {project.expected_completion && (
                        <div>
                          <p className="text-sm text-gray-500">Expected Completion</p>
                          <p className="font-medium">{new Date(project.expected_completion).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {project.investment_amount && (
                      <div className="text-sm text-gray-500">
                        💰 Investment: ${project.investment_amount.toLocaleString()}M
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge className={getTechnologyColor(project.technology)}>{project.technology}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>{project.capacity_mw} MW</TableCell>
                    <TableCell>
                      {project.region}, {project.country}
                    </TableCell>
                    <TableCell>{new Date(project.announced_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
