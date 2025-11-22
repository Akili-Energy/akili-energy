"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { getUserRole } from "@/app/actions/auth";
import { getEvents } from "@/app/actions/events";
import { useLanguage } from "@/components/language-context";
import { FetchEventsResults } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function EventsPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [events, setEvents] = useState<FetchEventsResults>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [cursor, setCursor] = useState<Date>();
  const [isGuestUser, setIsGuestUser] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState("all");

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

  const fetchEvents = useCallback(() => {
    startTransition(async () => {
      const { events: fetchedEvents, total: totalCount } = (await getEvents({
        cursor,
        search: searchTerm,
      }))!;

      setEvents((prev) => [...prev, ...fetchedEvents]);

      setTotal(totalCount);
      setCursor(fetchedEvents[fetchedEvents.length - 1]?.start);
    });
  }, [searchTerm, cursor]);

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
  }, [events, cursor, isPending, isGuestUser, fetchEvents]);

  const getUpcoming = (allEvents: FetchEventsResults) => {
    return allEvents.filter(({ start }) => start.getTime() >= Date.now());
  };

  const getPast = (allEvents: FetchEventsResults) => {
    return allEvents.filter(({ start }) => start.getTime() < Date.now());
  };

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
                className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      height={384}
                      width={640}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-2">
                        <Link
                          href={`/platform/events/${event.id}`}
                          className="hover:underline"
                        >
                          {event.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 shrink-0 ml-2"
                    >
                      Upcoming
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                      <span>
                        {event?.start.toLocaleDateString()} -{" "}
                        {event?.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                      <span className="line-clamp-1">{event.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
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
                className="hover:shadow-lg transition-shadow duration-300 opacity-75 hover:opacity-100 overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 grayscale">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      height={384}
                      width={640}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-2">
                        <Link
                          href={`/platform/events/${event.id}`}
                          className="hover:underline"
                        >
                          {event.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="shrink-0 ml-2">
                      Past
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                      <span>
                        {event?.start.toLocaleDateString()} -{" "}
                        {event?.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                      <span className="line-clamp-1">{event.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
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
