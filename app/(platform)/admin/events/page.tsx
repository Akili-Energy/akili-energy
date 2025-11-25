"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { FetchEventsResults } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { deleteEvent, getEvents } from "@/app/actions/events";
import { toast } from "sonner";
import { removeDuplicates } from "@/lib/utils";

export default function EventsAdmin() {
  const [events, setEvents] = useState<FetchEventsResults>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<Date | undefined>(undefined);

  const loaderRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to load events, handling both initial/search loads and "load more"
  const loadEvents = useCallback(
    async (isNewSearch = false) => {
      if (isLoading || (!hasMore && !isNewSearch)) return;
      setIsLoading(true);

      const currentCursor = isNewSearch ? undefined : cursor;

      try {
        // Get all statuses for the admin view by passing status: null
        const result = await getEvents({
          search: debouncedSearchTerm,
          cursor: currentCursor,
        });

        const newEvents = result?.events ?? [];
        if (isNewSearch) {
          setEvents(removeDuplicates(newEvents, "id"));
        } else {
          setEvents((prev) => removeDuplicates([...prev, ...newEvents], "id"));
        }

        setHasMore(result?.hasMore ?? false);
        if (newEvents.length > 0) {
          setCursor(newEvents[newEvents.length - 1].start ?? undefined);
        }
      } catch (error) {
        toast.error("Failed to fetch blog events.");
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearchTerm, cursor, hasMore, isLoading]
  );

  // Effect for debounced search: reset and fetch
  useEffect(() => {
    setEvents([]);
    setCursor(undefined);
    setHasMore(true);
    loadEvents(true);
  }, [debouncedSearchTerm]); // re-runs when debounced term changes

  // Effect for intersection observer (infinite scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadEvents();
        }
      },
      { threshold: 1.0 }
    );

    const loaderElement = loaderRef.current;
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [hasMore, isLoading, loadEvents]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const result = await deleteEvent(id);
    if (result.success) {
      toast.success(result.message);
      setEvents((prev) =>
        removeDuplicates(prev.filter((event) => event.id !== id), "id")
      );
    } else {
      toast.error(result.message);
    }
  };

  const getStatus = ({ start, endDate }: { start: Date; endDate: Date }) => {
    const now = Date.now();
    if (start.getTime() > now) return "upcoming";
    else if (start.getTime() <= now && endDate.getTime() >= now) return "ongoing";
    else return "completed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "ongoing":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conference":
        return "🎤";
      case "webinar":
        return "💻";
      case "workshop":
        return "🔧";
      case "summit":
        return "🏔️";
      default:
        return "📅";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">
            Manage industry events, conferences, and webinars
          </p>
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
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <Badge
                      variant={getStatusColor(getStatus(event))}
                      className="capitalize"
                    >
                      {getStatus(event)}
                    </Badge>
                    {event.virtual && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
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
                          {new Date(event.start).toLocaleDateString()}
                          {event.start !== event.endDate &&
                            ` - ${new Date(
                              event.endDate
                            ).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-sm">{event.address}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organizer</p>
                      <p className="font-medium text-sm">{event.organizer.name}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-4 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div> */}

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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 text-center">
        {isLoading && (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        )}
        {!hasMore && events.length > 0 && (
          <p className="text-muted-foreground">You've reached the end.</p>
        )}
      </div>

      {!isLoading && events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
}
