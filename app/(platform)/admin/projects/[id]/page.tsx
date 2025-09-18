"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Users,
  ExternalLink,
  Clock,
  Activity,
  Target,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
  sector: string
  technology: string
  capacity: number
  capacity_unit: string
  status: string
  development_stage: string
  country: string
  region: string
  location: string
  coordinates?: { lat: number; lng: number }
  description: string
  project_cost: number
  financing_status: string
  commercial_operation_date?: string
  construction_start_date?: string
  announcement_date: string
  developer: Company
  epc_contractor?: Company
  operator?: Company
  investors: Company[]
  offtaker?: string
  ppa_details?: string
  environmental_impact: string
  jobs_created: number
  co2_reduction: number
  created_at: string
  updated_at: string
}

interface Company {
  id: string
  name: string
  role: string
  classification: string
  hq_country: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  const loadProjectData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProject: Project = {
        id: projectId,
        name: "Abydos Solar Power Plant",
        sector: "Solar",
        technology: "Solar PV",
        capacity: 500,
        capacity_unit: "MW",
        status: "Operational",
        development_stage: "Commercial Operation",
        country: "Egypt",
        region: "North Africa",
        location: "Aswan Governorate, Egypt",
        coordinates: { lat: 24.0889, lng: 32.8998 },
        description:
          "The Abydos Solar Power Plant is a 500 MW utility-scale solar photovoltaic project located in Aswan Governorate, Egypt. The project is part of Egypt's renewable energy strategy to increase the share of renewable energy in the country's energy mix.",
        project_cost: 500000000,
        financing_status: "Fully Financed",
        commercial_operation_date: "2024-12-14",
        construction_start_date: "2022-06-01",
        announcement_date: "2021-03-15",
        developer: {
          id: "1",
          name: "AMEA Power",
          role: "Developer",
          classification: "Private",
          hq_country: "UAE",
        },
        epc_contractor: {
          id: "2",
          name: "Jinko Solar",
          role: "EPC Contractor",
          classification: "Public",
          hq_country: "China",
        },
        operator: {
          id: "3",
          name: "AMEA Power O&M",
          role: "Operator",
          classification: "Private",
          hq_country: "UAE",
        },
        investors: [
          {
            id: "4",
            name: "IFC",
            role: "Investor",
            classification: "DFI",
            hq_country: "USA",
          },
          {
            id: "5",
            name: "EBRD",
            role: "Investor",
            classification: "DFI",
            hq_country: "UK",
          },
        ],
        offtaker: "Egyptian Electricity Transmission Company (EETC)",
        ppa_details: "25-year Power Purchase Agreement with EETC at $0.0248/kWh",
        environmental_impact:
          "The project will reduce CO2 emissions by approximately 350,000 tons annually and contribute to Egypt's renewable energy targets.",
        jobs_created: 1200,
        co2_reduction: 350000,
        created_at: "2021-03-15T00:00:00Z",
        updated_at: "2024-12-14T00:00:00Z",
      }

      setProject(mockProject)
    } catch (error) {
      console.error("Error loading project data:", error)
      toast.error("Failed to load project data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "default"
      case "under construction":
        return "secondary"
      case "development":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getProgressPercentage = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "early stage":
        return 20
      case "development":
        return 40
      case "financial close":
        return 60
      case "under construction":
        return 80
      case "commercial operation":
        return 100
      default:
        return 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading project details...</div>
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
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{project.sector}</Badge>
                <Badge variant="secondary">{project.technology}</Badge>
                <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                <span className="text-lg font-semibold text-blue-600">
                  {project.capacity} {project.capacity_unit}
                </span>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/projects/${projectId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="companies">Companies ({1 + project.investors.length})</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Information */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Project Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600">{project.description}</p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Technology</h4>
                          <p className="text-gray-600">{project.technology}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Capacity</h4>
                          <p className="text-gray-600">
                            {project.capacity} {project.capacity_unit}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2">Development Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{project.development_stage}</span>
                            <span>{getProgressPercentage(project.development_stage)}%</span>
                          </div>
                          <Progress value={getProgressPercentage(project.development_stage)} className="h-2" />
                        </div>
                      </div>

                      {project.ppa_details && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2">Power Purchase Agreement</h4>
                            <p className="text-gray-600">{project.ppa_details}</p>
                            {project.offtaker && (
                              <p className="text-sm text-gray-500 mt-1">Offtaker: {project.offtaker}</p>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Country</h4>
                            <p className="text-gray-600">{project.country}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Region</h4>
                            <p className="text-gray-600">{project.region}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Specific Location</h4>
                          <p className="text-gray-600">{project.location}</p>
                        </div>

                        {project.coordinates && (
                          <div>
                            <h4 className="font-semibold mb-2">Coordinates</h4>
                            <p className="text-gray-600">
                              {project.coordinates.lat}°N, {project.coordinates.lng}°E
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Stats & Key Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Project Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        ${(project.project_cost / 1000000).toFixed(0)}M
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Total Project Cost</p>
                      <div className="mt-4">
                        <Badge variant={project.financing_status === "Fully Financed" ? "default" : "secondary"}>
                          {project.financing_status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Capacity</span>
                        </div>
                        <span className="font-semibold">
                          {project.capacity} {project.capacity_unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Jobs Created</span>
                        </div>
                        <span className="font-semibold">{project.jobs_created.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-sm">CO₂ Reduction</span>
                        </div>
                        <span className="font-semibold">{(project.co2_reduction / 1000).toFixed(0)}k tons/year</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">Announced</div>
                          <div className="text-sm text-gray-500">{project.announcement_date}</div>
                        </div>
                      </div>

                      {project.construction_start_date && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Construction Started</div>
                            <div className="text-sm text-gray-500">{project.construction_start_date}</div>
                          </div>
                        </div>
                      )}

                      {project.commercial_operation_date && (
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Commercial Operation</div>
                            <div className="text-sm text-gray-500">{project.commercial_operation_date}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="companies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Project Companies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Developer */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{project.developer.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="default">{project.developer.role}</Badge>
                          <Badge variant="secondary">{project.developer.classification}</Badge>
                          <span className="text-sm text-gray-500">{project.developer.hq_country}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/companies/${project.developer.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* EPC Contractor */}
                    {project.epc_contractor && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{project.epc_contractor.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{project.epc_contractor.role}</Badge>
                            <Badge variant="secondary">{project.epc_contractor.classification}</Badge>
                            <span className="text-sm text-gray-500">{project.epc_contractor.hq_country}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${project.epc_contractor.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    )}

                    {/* Operator */}
                    {project.operator && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{project.operator.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{project.operator.role}</Badge>
                            <Badge variant="secondary">{project.operator.classification}</Badge>
                            <span className="text-sm text-gray-500">{project.operator.hq_country}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${project.operator.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    )}

                    {/* Investors */}
                    {project.investors.map((investor) => (
                      <div key={investor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{investor.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{investor.role}</Badge>
                            <Badge variant="secondary">{investor.classification}</Badge>
                            <span className="text-sm text-gray-500">{investor.hq_country}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${investor.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${(project.project_cost / 1000000).toFixed(0)}M
                      </div>
                      <div className="text-sm text-gray-500">Total Project Cost</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${(project.project_cost / project.capacity / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-gray-500">Cost per MW</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{project.financing_status}</div>
                      <div className="text-sm text-gray-500">Financing Status</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-semibold">Project Announced</div>
                        <div className="text-sm text-gray-500">{project.announcement_date}</div>
                        <p className="text-sm text-gray-600 mt-1">
                          Initial project announcement and development planning
                        </p>
                      </div>
                    </div>

                    {project.construction_start_date && (
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mt-2"></div>
                        <div>
                          <div className="font-semibold">Construction Started</div>
                          <div className="text-sm text-gray-500">{project.construction_start_date}</div>
                          <p className="text-sm text-gray-600 mt-1">
                            Ground-breaking and construction activities commenced
                          </p>
                        </div>
                      </div>
                    )}

                    {project.commercial_operation_date && (
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <div className="font-semibold">Commercial Operation</div>
                          <div className="text-sm text-gray-500">{project.commercial_operation_date}</div>
                          <p className="text-sm text-gray-600 mt-1">
                            Project achieved commercial operation and began generating power
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-semibold">Record Updated</div>
                        <div className="text-sm text-gray-500">{project.updated_at.split("T")[0]}</div>
                        <p className="text-sm text-gray-600 mt-1">Latest update to project information</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Environmental & Social Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Environmental Impact</h4>
                    <p className="text-gray-600">{project.environmental_impact}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {(project.co2_reduction / 1000).toFixed(0)}k
                      </div>
                      <div className="text-sm text-gray-500">Tons CO₂ Reduced Annually</div>
                    </div>

                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {project.jobs_created.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Jobs Created</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
