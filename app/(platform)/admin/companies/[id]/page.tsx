"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Image from 'next/image'

interface Company {
  id: string
  name: string
  classification: string
  sectors: string[]
  hq_country: string
  hq_address: string
  operating_status: string
  founded_date: string
  company_size: string
  email: string
  phone: string
  website: string
  description: string
  logo_url: string
  operating_countries: string[]
  main_activities: string[]
  technology: string[]
  subsector: string
  created_at: string
  updated_at: string
}

interface Deal {
  id: string
  title: string
  deal_type: string
  amount: number
  date: string
  status: string
}

interface Project {
  id: string
  name: string
  sector: string
  capacity: string
  status: string
  location: string
}

interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  linkedin_url: string
  profile_image: string
}

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompanyData()
  }, [companyId])

  const loadCompanyData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockCompany: Company = {
        id: companyId,
        name: "AMEA Power",
        classification: "Private",
        sectors: ["Solar", "Wind", "Storage"],
        hq_country: "UAE",
        hq_address: "Dubai International Financial Centre, Dubai, UAE",
        operating_status: "Active",
        founded_date: "2015",
        company_size: "201-500",
        email: "info@ameapower.com",
        phone: "+971 4 123 4567",
        website: "https://ameapower.com",
        description:
          "AMEA Power is a leading renewable energy developer and operator in the Middle East and Africa, focusing on utility-scale solar, wind, and energy storage projects.",
        logo_url: "/placeholder.svg?height=80&width=200",
        operating_countries: ["UAE", "Egypt", "Jordan", "Morocco", "South Africa"],
        main_activities: ["Development", "EPC", "O&M", "Investment"],
        technology: ["Solar PV", "Wind", "BESS"],
        subsector: "Utility-scale",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
      }

      const mockDeals: Deal[] = [
        {
          id: "1",
          title: "500 MW Abydos Solar Plant",
          deal_type: "Project Update",
          amount: 500000000,
          date: "2024-12-14",
          status: "Operational",
        },
        {
          id: "2",
          title: "Series B Funding Round",
          deal_type: "Financing",
          amount: 150000000,
          date: "2024-10-20",
          status: "Completed",
        },
      ]

      const mockProjects: Project[] = [
        {
          id: "1",
          name: "Abydos Solar Plant",
          sector: "Solar",
          capacity: "500 MW",
          status: "Operational",
          location: "Egypt",
        },
        {
          id: "2",
          name: "Zaatari Solar Project",
          sector: "Solar",
          capacity: "200 MW",
          status: "Under Construction",
          location: "Jordan",
        },
      ]

      const mockTeam: TeamMember[] = [
        {
          id: "1",
          name: "Hussain Al Nowais",
          position: "Chairman",
          bio: "Experienced energy executive with over 20 years in the renewable energy sector.",
          linkedin_url: "https://linkedin.com/in/hussain-al-nowais",
          profile_image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          position: "CEO",
          bio: "Former McKinsey partner specializing in energy transition and infrastructure development.",
          linkedin_url: "https://linkedin.com/in/sarah-johnson",
          profile_image: "/placeholder.svg?height=100&width=100",
        },
      ]

      setCompany(mockCompany)
      setDeals(mockDeals)
      setProjects(mockProjects)
      setTeam(mockTeam)
    } catch (error) {
      console.error("Error loading company data:", error)
      toast.error("Failed to load company data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading company details...</div>
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
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/companies">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Link>
            </Button>
            <div className="flex items-center space-x-4">
              <Image
                src={company.logo_url || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="h-12 w-auto object-contain"
                width={400}
              />
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{company.classification}</Badge>
                  <Badge variant={company.operating_status === "Active" ? "default" : "secondary"}>
                    {company.operating_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/companies/${companyId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
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
              <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="team">Team ({team.length})</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Information */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building2 className="w-5 h-5 mr-2" />
                        Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600">{company.description}</p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Founded</h4>
                          <p className="text-gray-600">{company.founded_date}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Company Size</h4>
                          <p className="text-gray-600">{company.company_size} employees</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2">Sectors</h4>
                        <div className="flex flex-wrap gap-2">
                          {company.sectors.map((sector) => (
                            <Badge key={sector} variant="secondary">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Main Activities</h4>
                        <div className="flex flex-wrap gap-2">
                          {company.main_activities.map((activity) => (
                            <Badge key={activity} variant="outline">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Technology</h4>
                        <div className="flex flex-wrap gap-2">
                          {company.technology.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Geographic Presence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Headquarters</h4>
                          <p className="text-gray-600">{company.hq_address}</p>
                          <p className="text-gray-600">{company.hq_country}</p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Operating Countries</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.operating_countries.map((country) => (
                              <Badge key={country} variant="outline">
                                {country}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact & Quick Stats */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {company.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            Website <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}

                      {company.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                            {company.email}
                          </a>
                        </div>
                      )}

                      {company.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{company.phone}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Active Deals</span>
                        </div>
                        <span className="font-semibold">{deals.length}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Projects</span>
                        </div>
                        <span className="font-semibold">{projects.length}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Team Members</span>
                        </div>
                        <span className="font-semibold">{team.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{deal.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{deal.deal_type}</Badge>
                            <span className="text-sm text-gray-500">{deal.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">${(deal.amount / 1000000).toFixed(0)}M</div>
                          <Badge variant={deal.status === "Completed" ? "default" : "secondary"}>{deal.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{project.sector}</Badge>
                            <span className="text-sm text-gray-500">{project.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{project.capacity}</div>
                          <Badge variant={project.status === "Operational" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {team.map((member) => (
                      <div key={member.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <Image
                          src={member.profile_image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{member.position}</p>
                          <p className="text-sm text-gray-500 mb-2">{member.bio}</p>
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm flex items-center"
                            >
                              LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
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
                      <div className="text-2xl font-bold text-green-600">$650M</div>
                      <div className="text-sm text-gray-500">Total Deal Value</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">700 MW</div>
                      <div className="text-sm text-gray-500">Total Capacity</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-gray-500">Countries</div>
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
