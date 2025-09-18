"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Calendar, Users, Globe, Phone, Mail } from "lucide-react"

interface OverviewTabProps {
  companyId: string
}

export function OverviewTab({ companyId }: OverviewTabProps) {
  // Mock data - in real app, this would come from API
  const company = {
    id: companyId,
    name: "SolarTech Solutions",
    description:
      "Leading renewable energy company specializing in large-scale solar installations across Africa. We develop, finance, and operate utility-scale solar projects with a focus on sustainable energy solutions.",
    sector: "Solar Energy",
    founded: "2018",
    headquarters: "Cape Town, South Africa",
    employees: "250-500",
    website: "www.solartech-solutions.com",
    phone: "+27 21 123 4567",
    email: "info@solartech-solutions.com",
    status: "Active",
    tags: ["Solar", "Utility Scale", "Development", "EPC"],
    keyMetrics: {
      totalCapacity: "1,250 MW",
      projectsCompleted: 15,
      countriesActive: 5,
      totalInvestment: "$2.1B",
    },
  }

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
              <CardDescription className="mt-2 max-w-3xl">{company.description}</CardDescription>
            </div>
            <Badge variant={company.status === "Active" ? "default" : "secondary"}>{company.status}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Sector</p>
                  <p className="text-sm text-muted-foreground">{company.sector}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Founded</p>
                  <p className="text-sm text-muted-foreground">{company.founded}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Headquarters</p>
                  <p className="text-sm text-muted-foreground">{company.headquarters}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Employees</p>
                  <p className="text-sm text-muted-foreground">{company.employees}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{company.website}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{company.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{company.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-akili-orange">{company.keyMetrics.totalCapacity}</p>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{company.keyMetrics.projectsCompleted}</p>
              <p className="text-sm text-muted-foreground">Projects Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{company.keyMetrics.countriesActive}</p>
              <p className="text-sm text-muted-foreground">Countries Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{company.keyMetrics.totalInvestment}</p>
              <p className="text-sm text-muted-foreground">Total Investment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
