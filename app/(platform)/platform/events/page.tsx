"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, MapPin, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { getUserRole } from "@/app/actions/auth"
import { getEvents } from "@/app/actions/events"
import { useLanguage } from "@/components/language-context"
import { FetchEventsResults } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function EventsPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [events, setEvents] = useState<FetchEventsResults>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [cursor, setCursor] = useState<Date>();
  const [isGuestUser, setIsGuestUser] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState("all")


  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await getUserRole();
      if (userRole === null || userRole === undefined) {
        toast.error("Invalid user. Please log in again.");
        router.replace("/login");
      }
      setIsGuestUser(userRole === "guest");
    };
    fetchUserRole();
  }, []);

  // Ref for the observer target element
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchEvents = useCallback(
    () => {
      startTransition(async () => {

        const {
          events: fetchedEvents,
          total: totalCount,
        } = (await getEvents({cursor, search: searchTerm}))!;

                  setEvents((prev) => [...prev, ...fetchedEvents]);


        setTotal(totalCount);
        setCursor(fetchedEvents[fetchedEvents.length - 1]?.start);
      });
    },
    [searchTerm, cursor]
  );

  // Effect for initial load and when filters/search change
  useEffect(() => {
    // This fetches the first page and resets the list
    fetchEvents();
  }, [searchTerm]);

  // Effect for infinite scrolling
  useEffect(() => {
    if (isPending || !cursor) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // If the observer target is visible, fetch more data
        if (entries[0].isIntersecting && !isPending && !isGuestUser) {
          fetchEvents();
        }
      },
      { threshold: 1.0 } // Trigger when the element is fully visible
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    // Cleanup observer on component unmount or dependency change
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [
    events,
    cursor,
    isPending,
    isGuestUser,
    fetchEvents,
  ]);

  const getUpcoming = (allEvents: FetchEventsResults) => {
    return allEvents.filter(({ start }) => start.getTime() >= Date.now());
  }

  const getPast = (allEvents: FetchEventsResults) => {
    return allEvents.filter(({ start }) => start.getTime() < Date.now());
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover conferences, summits, and webinars in the energy sector
          </p>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      </div> */}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Find events that match your interests
          </CardDescription>
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
            <Select
              value={selectedDateRange}
              onValueChange={setSelectedDateRange}
            >
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
          <TabsTrigger value="upcoming">
            Upcoming Events ({getUpcoming(events).length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Events ({getPast(events).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getUpcoming(events).map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        <Link href={`/platform/events/${event.id}`}>
                          {event.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Upcoming
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {event?.start.toLocaleDateString()} -{" "}
                        {event?.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div />
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={event.website || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
            {getPast(events).map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow duration-300 opacity-75"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        <Link href={`/platform/events/${event.id}`}>
                          {event.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">Past</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {event?.start.toLocaleDateString()} -{" "}
                        {event?.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div />
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={event.website || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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

      {/* Observer Target and Loading Indicator for Card View */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {isPending && events.length > 0 && (
          <Loader2 className="h-8 w-8 animate-spin text-akili-blue" />
        )}
      </div>
    </div>
  );
}
