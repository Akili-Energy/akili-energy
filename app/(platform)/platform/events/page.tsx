"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

const events = [
  {
    id: 1,
    title: "Africa Energy Forum 2025",
    type: "Conference",
    date: "2025-06-15",
    endDate: "2025-06-17",
    location: "Cape Town, South Africa",
    organizer: "EnergyNet",
    attendees: 1200,
    status: "Upcoming",
    description:
      "The premier gathering for Africa's energy sector, bringing together investors, developers, and policymakers.",
    topics: ["Solar", "Wind", "Hydro", "Investment"],
    price: "€1,995",
    website: "https://africa-energy-forum.com",
  },
  {
    id: 2,
    title: "West Africa Power Summit",
    type: "Summit",
    date: "2025-05-20",
    endDate: "2025-05-22",
    location: "Lagos, Nigeria",
    organizer: "Power Africa",
    attendees: 800,
    status: "Upcoming",
    description: "Focused on accelerating power sector development across West Africa.",
    topics: ["Grid Infrastructure", "Mini-grids", "Policy"],
    price: "$1,200",
    website: "https://west-africa-power.com",
  },
  {
    id: 3,
    title: "Solar Power Africa Webinar Series",
    type: "Webinar",
    date: "2025-05-08",
    endDate: "2025-05-08",
    location: "Virtual",
    organizer: "Solar Power Europe",
    attendees: 500,
    status: "Upcoming",
    description: "Monthly webinar series covering latest trends in African solar markets.",
    topics: ["Solar", "Technology", "Market Trends"],
    price: "Free",
    website: "https://solarpowereurope.org",
  },
  {
    id: 4,
    title: "East Africa Renewable Energy Conference",
    type: "Conference",
    date: "2025-04-10",
    endDate: "2025-04-12",
    location: "Nairobi, Kenya",
    organizer: "EABC",
    attendees: 600,
    status: "Past",
    description: "Regional conference focusing on renewable energy opportunities in East Africa.",
    topics: ["Geothermal", "Solar", "Wind", "Hydro"],
    price: "$800",
    website: "https://eabc.info",
  },
  {
    id: 5,
    title: "African Energy Investment Summit",
    type: "Summit",
    date: "2025-07-25",
    endDate: "2025-07-26",
    location: "London, UK",
    organizer: "African Energy",
    attendees: 400,
    status: "Upcoming",
    description: "High-level summit connecting African energy projects with international investors.",
    topics: ["Investment", "Project Finance", "M&A"],
    price: "£2,500",
    website: "https://african-energy.com",
  },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || event.type === selectedType
    const matchesTopic =
      selectedTopic === "all" || event.topics.some((topic) => topic.toLowerCase() === selectedTopic.toLowerCase())

    // Simple date filtering
    let matchesDate = true
    if (selectedDateRange !== "all") {
      const eventDate = new Date(event.date)
      const now = new Date()
      const diffTime = eventDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (selectedDateRange) {
        case "next-month":
          matchesDate = diffDays >= 0 && diffDays <= 30
          break
        case "next-3-months":
          matchesDate = diffDays >= 0 && diffDays <= 90
          break
        case "next-6-months":
          matchesDate = diffDays >= 0 && diffDays <= 180
          break
        default:
          matchesDate = true
      }
    }

    return matchesSearch && matchesType && matchesTopic && matchesDate
  })

  const upcomingEvents = filteredEvents.filter((event) => event.status === "Upcoming")
  const pastEvents = filteredEvents.filter((event) => event.status === "Past")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover conferences, summits, and webinars in the energy sector
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Tracked events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, event) => sum + event.attendees, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Expected participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(events.map((e) => e.location.split(", ").pop())).size}</div>
            <p className="text-xs text-muted-foreground">Host countries</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Find events that match your interests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Summit">Summit</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="hydro">Hydro</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="next-month">Next Month</SelectItem>
                <SelectItem value="next-3-months">Next 3 Months</SelectItem>
                <SelectItem value="next-6-months">Next 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {event.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">{event.price}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={event.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <Badge variant="secondary">{event.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {event.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">{event.price}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={event.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
