"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, MapPin, Users, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  type: "conference" | "webinar" | "workshop" | "summit"
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  startDate: string
  endDate: string
  location: string
  isVirtual: boolean
  organizer: string
  website: string
  attendees: number
  maxAttendees: number
  tags: string[]
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "African Energy Summit 2025",
    description: "Annual summit bringing together energy leaders, investors, and policymakers across Africa",
    type: "summit",
    status: "upcoming",
    startDate: "2025-06-15",
    endDate: "2025-06-17",
    location: "Cape Town, South Africa",
    isVirtual: false,
    organizer: "African Energy Association",
    website: "https://africaenergysummit.com",
    attendees: 847,
    maxAttendees: 1200,
    tags: ["summit", "networking", "investment"],
  },
  {
    id: "2",
    title: "Solar Power Africa Webinar Series",
    description: "Monthly webinar series focusing on solar energy developments across the continent",
    type: "webinar",
    status: "ongoing",
    startDate: "2025-04-01",
    endDate: "2025-04-01",
    location: "Virtual Event",
    isVirtual: true,
    organizer: "Solar Power Africa",
    website: "https://solarpowerafrica.com/webinars",
    attendees: 324,
    maxAttendees: 500,
    tags: ["solar", "webinar", "monthly"],
  },
]

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default"
      case "ongoing":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conference":
        return "🎤"
      case "webinar":
        return "💻"
      case "workshop":
        return "🔧"
      case "summit":
        return "🏔️"
      default:
        return "📅"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">Manage industry events, conferences, and webinars</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <Input
          placeholder="Search events by title, location, or organizer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Events Grid */}
      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
                    <span className="text-lg">{getTypeIcon(event.type)}</span>
                    {event.isVirtual && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Virtual
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-sm">
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.startDate !== event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-sm">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Attendees</p>
                        <p className="font-medium text-sm">
                          {event.attendees} / {event.maxAttendees}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organizer</p>
                      <p className="font-medium text-sm">{event.organizer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {event.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Event Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
