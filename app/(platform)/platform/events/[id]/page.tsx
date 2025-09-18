import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, MapPin, Users, Clock, ExternalLink, Download } from "lucide-react"
import Link from "next/link"

export default async function EventDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Mock data - in real app, fetch based on params.id
  const event = {
    id: params.id,
    title: "Africa Energy Forum 2025",
    type: "Conference",
    status: "Upcoming",
    date: "2025-06-15",
    endDate: "2025-06-17",
    time: "09:00 - 18:00",
    location: "Cape Town, South Africa",
    venue: "Cape Town International Convention Centre",
    organizer: "EnergyNet",
    attendees: 1200,
    price: "€1,995",
    earlyBird: "€1,595",
    website: "https://africa-energy-forum.com",
    description:
      "The Africa Energy Forum is the premier gathering for Africa's energy sector, bringing together investors, developers, policymakers, and industry leaders. This three-day event features keynote presentations, panel discussions, networking sessions, and exhibition opportunities focused on accelerating energy development across the continent.",
    topics: ["Solar", "Wind", "Hydro", "Investment", "Policy", "Grid Infrastructure"],
    agenda: [
      {
        day: "Day 1 - June 15",
        sessions: [
          { time: "09:00-09:30", title: "Registration & Welcome Coffee" },
          { time: "09:30-10:30", title: "Opening Keynote: The Future of African Energy" },
          { time: "10:30-11:00", title: "Coffee Break" },
          { time: "11:00-12:30", title: "Panel: Investment Trends in Renewable Energy" },
          { time: "12:30-13:30", title: "Networking Lunch" },
          { time: "13:30-15:00", title: "Workshop: Project Finance Structures" },
          { time: "15:00-15:30", title: "Coffee Break" },
          { time: "15:30-17:00", title: "Panel: Grid Integration Challenges" },
          { time: "18:00-20:00", title: "Welcome Reception" },
        ],
      },
      {
        day: "Day 2 - June 16",
        sessions: [
          { time: "09:00-10:30", title: "Keynote: Technology Innovation in Energy" },
          { time: "10:30-11:00", title: "Coffee Break" },
          { time: "11:00-12:30", title: "Panel: Country Spotlights - West Africa" },
          { time: "12:30-13:30", title: "Networking Lunch" },
          { time: "13:30-15:00", title: "Workshop: ESG in Energy Projects" },
          { time: "15:00-15:30", title: "Coffee Break" },
          { time: "15:30-17:00", title: "Panel: Mini-grids and Energy Access" },
          { time: "19:00-22:00", title: "Gala Dinner" },
        ],
      },
    ],
    speakers: [
      {
        name: "Dr. Amina Hassan",
        title: "CEO, African Development Bank",
        company: "AfDB",
      },
      {
        name: "John Kamau",
        title: "Managing Director",
        company: "Serengeti Energy",
      },
      {
        name: "Sarah Okonkwo",
        title: "Head of Africa",
        company: "AMEA Power",
      },
    ],
    sponsors: ["Shell", "TotalEnergies", "Enel Green Power", "Scatec"],
    registration: {
      deadline: "2025-06-01",
      includes: ["All sessions", "Networking meals", "Conference materials", "Certificate"],
      contact: "events@energynet.co.uk",
    },
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/platform/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{event.type}</Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {event.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Brochure
          </Button>
          <Button>
            <ExternalLink className="w-4 h-4 mr-2" />
            Register Now
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Description */}
          <Card>
            <CardHeader>
              <CardTitle>About the Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
              <div className="flex flex-wrap gap-2">
                {event.topics.map((topic, index) => (
                  <Badge key={index} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card>
            <CardHeader>
              <CardTitle>Event Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {event.agenda.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h4 className="font-semibold text-lg text-gray-900 mb-3">{day.day}</h4>
                    <div className="space-y-2">
                      {day.sessions.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-600 min-w-[80px]">{session.time}</div>
                          <div className="text-sm text-gray-900">{session.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Speakers */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Speakers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{speaker.name}</p>
                      <p className="text-sm text-gray-600">{speaker.title}</p>
                      <p className="text-sm text-gray-500">{speaker.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sponsors */}
          <Card>
            <CardHeader>
              <CardTitle>Event Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.sponsors.map((sponsor, index) => (
                  <div key={index} className="p-4 border rounded-lg text-center">
                    <div className="h-12 bg-gray-100 rounded flex items-center justify-center mb-2">
                      <span className="text-sm font-medium text-gray-600">{sponsor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  <p className="text-sm text-gray-600">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium">{event.attendees.toLocaleString()} Expected</p>
                  <p className="text-sm text-gray-600">Attendees</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">3 Days</p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Regular Price:</span>
                  <span className="font-semibold line-through text-gray-500">{event.price}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Early Bird:</span>
                  <span className="font-semibold text-green-600 text-lg">{event.earlyBird}</span>
                </div>
                <p className="text-xs text-gray-500">Early bird pricing until May 15, 2025</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Registration Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {event.registration.includes.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">
                  <strong>Registration Deadline:</strong> {new Date(event.registration.deadline).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Contact:</strong> {event.registration.contact}
                </p>
              </div>

              <Button className="w-full" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Register Now
              </Button>
            </CardContent>
          </Card>

          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle>Event Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-gray-600">{event.organizer.charAt(0)}</span>
                </div>
                <h4 className="font-medium">{event.organizer}</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Leading organizer of energy sector events across Africa and globally.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Visit Website
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
