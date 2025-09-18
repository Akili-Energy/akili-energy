"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Zap, ExternalLink } from "lucide-react"

interface ProjectsTabProps {
  companyId: string
}

export function ProjectsTab({ companyId }: ProjectsTabProps) {
  // Mock data - in real app, this would come from API
  const projects = [
    {
      id: "1",
      name: "Kathu Solar Park",
      location: "Northern Cape, South Africa",
      capacity: "100 MW",
      technology: "CSP",
      status: "Operational",
      completionDate: "2019-02-15",
      investment: "$460M",
    },
    {
      id: "2",
      name: "Redstone Solar Thermal",
      location: "Northern Cape, South Africa",
      capacity: "100 MW",
      technology: "CSP",
      status: "Under Construction",
      completionDate: "2024-06-30",
      investment: "$700M",
    },
    {
      id: "3",
      name: "Lephalale Solar Farm",
      location: "Limpopo, South Africa",
      capacity: "75 MW",
      technology: "PV",
      status: "Development",
      completionDate: "2025-12-31",
      investment: "$85M",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Under Construction":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Development":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Company Projects</h3>
          <p className="text-sm text-muted-foreground">
            {projects.length} projects • Total capacity:{" "}
            {projects.reduce((sum, p) => sum + Number.parseInt(p.capacity), 0)} MW
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {project.capacity}
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Technology</p>
                  <p className="text-sm text-muted-foreground">{project.technology}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Investment</p>
                  <p className="text-sm text-muted-foreground">{project.investment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Completion Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.completionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
