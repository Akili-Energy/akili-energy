"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, Download, Eye, Building2, List, Grid3X3, Sun, Wind, Droplets, Battery, Leaf, Zap } from "lucide-react"
import Link from "next/link"
import type { JSX } from "react"

const companies = [
  {
    id: 1,
    name: "Serengeti Energy",
    description:
      "Developer and operator of renewable energy projects across East Africa, specializing in small to medium-sized hydro and solar installations.",
    classification: "PE Backed",
    sectors: ["Hydro", "Wind", "Solar"],
    technologies: ["Solar PV", "Wind Onshore", "Small Hydro"],
    hqCountry: "Kenya",
    operatingCountries: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
    operatingStatus: "Active",
    founded: "2018",
    size: "51-200",
    mainActivities: ["Project Development", "EPC", "O&M"],
  },
  {
    id: 2,
    name: "Mulilo",
    description:
      "Leading South African renewable energy developer with a strong focus on utility-scale solar PV and wind projects, as well as energy storage solutions.",
    classification: "Private",
    sectors: ["Battery", "Wind", "Solar"],
    technologies: ["Solar PV", "Wind Onshore", "Battery Storage"],
    hqCountry: "South Africa",
    operatingCountries: ["South Africa", "Botswana"],
    operatingStatus: "Active",
    founded: "2012",
    size: "201-500",
    mainActivities: ["Project Development", "IPP", "O&M"],
  },
  {
    id: 3,
    name: "AMEA Power",
    description:
      "Global developer, owner, and operator of renewable energy projects with a significant portfolio across Africa and the Middle East.",
    classification: "Private",
    sectors: ["Solar", "Wind"],
    technologies: ["Solar PV", "Wind Onshore"],
    hqCountry: "UAE",
    operatingCountries: ["Egypt", "Jordan", "UAE"],
    operatingStatus: "Active",
    founded: "2015",
    size: "101-200",
    mainActivities: ["Project Development", "IPP"],
  },
]

// Helper functions with tooltips
const getSectorIcons = (sectors: string[]) => {
  const iconMap: { [key: string]: JSX.Element } = {
    Solar: <Sun className="w-4 h-4 text-yellow-500" />,
    Wind: <Wind className="w-4 h-4 text-blue-500" />,
    Hydro: <Droplets className="w-4 h-4 text-blue-600" />,
    Battery: <Battery className="w-4 h-4 text-green-500" />,
    Bioenergy: <Leaf className="w-4 h-4 text-green-600" />,
    Nuclear: <Zap className="w-4 h-4 text-purple-500" />,
  }

  if (sectors.length > 3) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-xs text-gray-600 cursor-help">Multiple</span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {sectors.map((sector, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {iconMap[sector]}
                  <span>{sector}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex gap-1">
      {sectors.map((sector, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>{iconMap[sector] || <span className="text-xs">{sector}</span>}</TooltipTrigger>
            <TooltipContent>
              <span>{sector}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

const getCountryFlags = (countries: string[]) => {
  const flagMap: { [key: string]: string } = {
    Kenya: "🇰🇪",
    Tanzania: "🇹🇿",
    Uganda: "🇺🇬",
    Rwanda: "🇷🇼",
    "South Africa": "🇿🇦",
    Botswana: "🇧🇼",
    UAE: "🇦🇪",
    Egypt: "🇪🇬",
    Jordan: "🇯🇴",
  }

  if (countries.length > 3) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-xs text-gray-600 cursor-help">Multiple</span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {countries.map((country, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-lg">{flagMap[country] || "🏳️"}</span>
                  <span>{country}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex gap-1">
      {countries.map((country, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-lg cursor-help" title={country}>
                {flagMap[country] || "🏳️"}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{country}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClassification, setSelectedClassification] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedActivity, setSelectedActivity] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClassification = selectedClassification === "all" || company.classification === selectedClassification
    const matchesSector =
      selectedSector === "all" ||
      company.sectors.some((sector) => sector.toLowerCase() === selectedSector.toLowerCase())
    const matchesCountry = selectedCountry === "all" || company.hqCountry === selectedCountry
    const matchesActivity = selectedActivity === "all" || company.mainActivities.includes(selectedActivity)

    return matchesSearch && matchesClassification && matchesSector && matchesCountry && matchesActivity
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Companies</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore energy companies and their portfolios across Africa
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">Active companies tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PE Backed</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.filter((c) => c.classification === "PE Backed").length}</div>
            <p className="text-xs text-muted-foreground">Private equity backed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(companies.map((c) => c.hqCountry)).size}</div>
            <p className="text-xs text-muted-foreground">HQ locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sectors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(companies.flatMap((c) => c.sectors)).size}</div>
            <p className="text-xs text-muted-foreground">Technology sectors</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your search to find specific companies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClassification} onValueChange={setSelectedClassification}>
              <SelectTrigger>
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="PE Firm">PE Firm</SelectItem>
                <SelectItem value="PE Backed">PE Backed</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="DFI">DFI</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="hydro">Hydro</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="HQ Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Main Activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="Project Development">Project Development</SelectItem>
                <SelectItem value="EPC">EPC</SelectItem>
                <SelectItem value="O&M">O&M</SelectItem>
                <SelectItem value="IPP">IPP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies with View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
              <CardDescription>Energy companies and developers</CardDescription>
            </div>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "cards" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/platform/companies/${company.id}`}
                        className="hover:text-akili-blue transition-colors"
                      >
                        <CardTitle className="cursor-pointer">{company.name}</CardTitle>
                      </Link>
                      <Badge variant="outline">{company.classification}</Badge>
                    </div>
                    <CardDescription>{company.hqCountry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{company.description}</p>
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {company.sectors.map((sector, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Founded</p>
                        <p className="font-medium">{company.founded}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Size</p>
                        <p className="font-medium">{company.size}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Operating Countries</p>
                        <div>{getCountryFlags(company.operatingCountries)}</div>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Status</p>
                        <Badge variant={company.operatingStatus === "Active" ? "default" : "secondary"}>
                          {company.operatingStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-end pt-4 border-t">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/platform/companies/${company.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Sectors</TableHead>
                    <TableHead>HQ Country</TableHead>
                    <TableHead>Operating Countries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Founded</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{company.classification}</Badge>
                      </TableCell>
                      <TableCell>
                        {getSectorIcons(company.sectors)}
                      </TableCell>
                      <TableCell>{company.hqCountry}</TableCell>
                      <TableCell>{getCountryFlags(company.operatingCountries)}</TableCell>
                      <TableCell>
                        <Badge variant={company.operatingStatus === "Active" ? "default" : "secondary"}>
                          {company.operatingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{company.founded}</TableCell>
                      <TableCell>{company.size}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/platform/companies/${company.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
