"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Grid3X3, List, Download, Edit, Trash2, Eye, MapPin, Users, Globe, Calendar } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"

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
  created_at: string
  updated_at: string
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSector, setFilterSector] = useState<string>("all")
  const [filterCountry, setFilterCountry] = useState<string>("all")

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockCompanies: Company[] = [
        {
          id: "1",
          name: "AMEA Power",
          description: "Leading renewable energy developer in the Middle East and Africa",
          sector: "Solar",
          headquarters: "Dubai",
          country: "UAE",
          website: "https://ameapower.com",
          logo_url: "/placeholder.svg?height=60&width=60",
          founded_year: 2015,
          employee_count: 250,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Serengeti Energy",
          description: "PE-backed renewable energy company focusing on hydro, wind, and solar projects",
          sector: "Multi-sector",
          headquarters: "Nairobi",
          country: "Kenya",
          website: "https://serengetienergy.com",
          logo_url: "/placeholder.svg?height=60&width=60",
          founded_year: 2018,
          employee_count: 120,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "3",
          name: "Mulilo",
          description: "South African renewable energy company specializing in storage, wind, and solar",
          sector: "Multi-sector",
          headquarters: "Cape Town",
          country: "South Africa",
          website: "https://mulilo.co.za",
          logo_url: "/placeholder.svg?height=60&width=60",
          founded_year: 2012,
          employee_count: 180,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ]
      setCompanies(mockCompanies)
    } catch (error) {
      console.error("Error loading companies:", error)
      toast.error("Failed to load companies")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return

    try {
      setCompanies(companies.filter((company) => company.id !== id))
      toast.success("Company deleted successfully")
    } catch (error) {
      toast.error("Failed to delete company")
    }
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = filterSector === "all" || company.sector === filterSector
    const matchesCountry = filterCountry === "all" || company.country === filterCountry

    return matchesSearch && matchesSector && matchesCountry
  })

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "Solar":
        return "bg-yellow-100 text-yellow-800"
      case "Wind":
        return "bg-blue-100 text-blue-800"
      case "Hydro":
        return "bg-cyan-100 text-cyan-800"
      case "Multi-sector":
        return "bg-purple-100 text-purple-800"
      case "Energy Storage":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading companies...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies Management</h1>
          <p className="text-muted-foreground">Manage energy companies and organizations</p>
        </div>
        <Button asChild>
          <Link href="/admin/companies/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Solar">Solar</SelectItem>
                  <SelectItem value="Wind">Wind</SelectItem>
                  <SelectItem value="Hydro">Hydro</SelectItem>
                  <SelectItem value="Multi-sector">Multi-sector</SelectItem>
                  <SelectItem value="Energy Storage">Energy Storage</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Egypt">Egypt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCompanies.length} of {companies.length} companies
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {company.logo_url && (
                      <Image
                        src={company.logo_url || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge className={getSectorColor(company.sector)}>{company.sector}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/companies/${company.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/companies/${company.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {company.headquarters}, {company.country}
                  </span>
                </div>
                {company.employee_count && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{company.employee_count} employees</span>
                  </div>
                )}
                {company.founded_year && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {company.founded_year}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <Link href={`/admin/companies/${company.id}/team`}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Founded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {company.logo_url && (
                          <Image
                            src={company.logo_url || "/placeholder.svg"}
                            alt={`${company.name} logo`}
                            width={64}
                            height={64}
                            className="rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{company.name}</div>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSectorColor(company.sector)}>{company.sector}</Badge>
                    </TableCell>
                    <TableCell>
                      {company.headquarters}, {company.country}
                    </TableCell>
                    <TableCell>{company.employee_count || "N/A"}</TableCell>
                    <TableCell>{company.founded_year || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${company.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${company.id}/team`}>
                            <Users className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${company.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No companies found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
