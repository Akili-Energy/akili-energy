"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Globe, Mail, Phone, Clock, Building } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date: string
  location: string
  venue: string
  city: string
  country: string
  website: string
  registration_url: string
  organizer: string
  organizer_email: string
  organizer_phone: string
  capacity: number
  registration_fee: number
  sectors: string[]
  target_audience: string[]
  speakers: string[]
  agenda: string
  created_at: string
  updated_at: string
}

interface Attendee {
  id: string
  name: string
  company: string
  position: string
  email: string
  registration_date: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEventData()
  }, [eventId])

  const loadEventData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockEvent: Event = {
        id: eventId,
        title: "Africa Energy Forum 2025",
        description:
          "The premier gathering for energy professionals across Africa, featuring discussions on renewable energy, investment opportunities, policy developments, and technological innovations shaping the continent's energy future.",
        event_type: "Conference",
        start_date: "2025-03-15T09:00:00Z",
        end_date: "2025-03-17T18:00:00Z",
        location: "Cape Town International Convention Centre",
        venue: "CTICC",
        city: "Cape Town",
        country: "South Africa",
        website: "https://africaenergyforum.com",
        registration_url: "https://africaenergyforum.com/register",
        organizer: "Energy Events Africa",
        organizer_email: "info@energyeventsafrica.com",
        organizer_phone: "+27 21 123 4567",
        capacity: 2500,
        registration_fee: 1500,
        sectors: ["Solar", "Wind", "Hydro", "Storage", "Grid Infrastructure"],
        target_audience: [
          "Investors",
          "Developers",
          "Government Officials",
          "Technology Providers",
          "Financial Institutions",
        ],
        speakers: ["Dr. Akinwumi Adesina", "Kandeh Yumkella", "Monica Maeland", "Gwede Mantashe"],
        agenda: "Day 1: Policy & Regulation, Day 2: Investment & Finance, Day 3: Technology & Innovation",
        created_at: "2024-10-01T00:00:00Z",
        updated_at: "2024-12-15T00:00:00Z",
      }

      const mockAttendees: Attendee[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          company: "African Development Bank",
          position: "Senior Investment Officer",
          email: "s.johnson@afdb.org",
          registration_date: "2024-11-15",
        },
        {
          id: "2",
          name: "Ahmed Hassan",
          company: "AMEA Power",
          position: "Regional Director",
          email: "a.hassan@ameapower.com",
          registration_date: "2024-11-20",
        },
        {
          id: "3",
          name: "Maria Santos",
          company: "Scatec Solar",
          position: "Business Development Manager",
          email: "m.santos@scatec.com",
          registration_date: "2024-12-01",
        },
      ]

      setEvent(mockEvent)
      setAttendees(mockAttendees)
    } catch (error) {
      console.error("Error loading event data:", error)
      toast.error("Failed to load event data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/admin/events/${eventId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Event deleted successfully")
          router.push("/admin/events")
        } else {
          toast.error("Failed to delete event")
        }
      } catch (error) {
        toast.error("An error occurred")
      }
    }
  }

  const getEventStatus = () => {
    if (!event) return "Unknown"
    const now = new Date()
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)

    if (now < startDate) return "Upcoming"
    if (now >= startDate && now <= endDate) return "Ongoing"
    return "Completed"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800"
      case "Ongoing":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading event details...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Event not found</p>
      </div>
    )
  }

  const eventStatus = getEventStatus()

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(eventStatus)}>{eventStatus}</Badge>
              <Badge variant="outline">{event.event_type}</Badge>
              <Badge variant="secondary">
                {event.city}, {event.country}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href={`/admin/events/${eventId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-600">{event.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Start Date
                      </h4>
                      <p>{new Date(event.start_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{new Date(event.start_date).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        End Date
                      </h4>
                      <p>{new Date(event.end_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{new Date(event.end_date).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </h4>
                    <p>{event.location}</p>
                    <p className="text-sm text-gray-500">{event.venue}</p>
                    <p className="text-sm text-gray-500">
                      {event.city}, {event.country}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Sectors</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.sectors.map((sector) => (
                        <Badge key={sector} variant="outline">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Target Audience</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.target_audience.map((audience) => (
                        <Badge key={audience} variant="secondary">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Event Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span className="font-semibold">{event.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registered</span>
                    <span className="font-semibold">{attendees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee</span>
                    <span className="font-semibold">${event.registration_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">
                      {Math.ceil(
                        (new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Organization</span>
                    <p className="font-semibold">{event.organizer}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${event.organizer_email}`} className="text-blue-600 hover:underline">
                      {event.organizer_email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{event.organizer_phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Event Website
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Event Type</span>
                  <span className="font-semibold">{event.event_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge className={getStatusColor(eventStatus)}>{eventStatus}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Venue</span>
                  <span className="font-semibold">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span>City</span>
                  <span className="font-semibold">{event.city}</span>
                </div>
                <div className="flex justify-between">
                  <span>Country</span>
                  <span className="font-semibold">{event.country}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Registration Fee</span>
                  <span className="font-semibold">${event.registration_fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity</span>
                  <span className="font-semibold">{event.capacity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered</span>
                  <span className="font-semibold">{attendees.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Spots</span>
                  <span className="font-semibold">{(event.capacity - attendees.length).toLocaleString()}</span>
                </div>
                <Button asChild className="w-full">
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    Registration Portal
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Speakers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="p-4 border rounded-lg text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={speaker} />
                      <AvatarFallback>
                        {speaker
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold">{speaker}</h4>
                    <p className="text-sm text-gray-500">Keynote Speaker</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={attendee.name} />
                        <AvatarFallback>
                          {attendee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{attendee.name}</h3>
                        <p className="text-sm text-gray-500">
                          {attendee.position} at {attendee.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Registered</p>
                      <p className="text-sm font-semibold">
                        {new Date(attendee.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agenda" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{event.agenda}</p>

                <Separator />

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Day 1 - Policy & Regulation
                    </h4>
                    <div className="ml-6 space-y-2">
                      <div className="flex justify-between">
                        <span>09:00 - 10:30</span>
                        <span>Opening Keynote: The Future of Energy Policy in Africa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>11:00 - 12:30</span>
                        <span>Panel: Regulatory Frameworks for Renewable Energy</span>
                      </div>
                      <div className="flex justify-between">
                        <span>14:00 - 15:30</span>
                        <span>Workshop: Navigating Energy Regulations</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Day 2 - Investment & Finance
                    </h4>
                    <div className="ml-6 space-y-2">
                      <div className="flex justify-between">
                        <span>09:00 - 10:30</span>
                        <span>Keynote: Financing the Energy Transition</span>
                      </div>
                      <div className="flex justify-between">
                        <span>11:00 - 12:30</span>
                        <span>Panel: Investment Opportunities in African Energy</span>
                      </div>
                      <div className="flex justify-between">
                        <span>14:00 - 15:30</span>
                        <span>Investor Roundtable</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Day 3 - Technology & Innovation
                    </h4>
                    <div className="ml-6 space-y-2">
                      <div className="flex justify-between">
                        <span>09:00 - 10:30</span>
                        <span>Keynote: Technological Innovations in Energy</span>
                      </div>
                      <div className="flex justify-between">
                        <span>11:00 - 12:30</span>
                        <span>Panel: Next-Generation Energy Technologies</span>
                      </div>
                      <div className="flex justify-between">
                        <span>14:00 - 15:30</span>
                        <span>Closing Ceremony & Networking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Venue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Venue Name</span>
                  <p className="font-semibold">{event.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Short Name</span>
                  <p className="font-semibold">{event.venue}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="font-semibold">
                    {event.city}, {event.country}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Capacity</span>
                  <p className="font-semibold">{event.capacity.toLocaleString()} attendees</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Created</span>
                  <p className="font-semibold">{new Date(event.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <p className="font-semibold">{new Date(event.updated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Event Duration</span>
                  <p className="font-semibold">
                    {Math.ceil(
                      (new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className={getStatusColor(eventStatus)}>{eventStatus}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-semibold">{event.organizer_email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <p className="font-semibold">{event.organizer_phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Website</span>
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
