"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getEventById } from "@/app/actions/events";
import { useLanguage } from "@/components/language-context";
import { FetchEventResult } from "@/lib/types";
import { useParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import Image from "next/image";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [event, setEvent] = useState<FetchEventResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (params?.id) {
      startTransition(async () => {
        const eventData = await getEventById(params.id);
        setEvent(eventData);
      });
    }
  }, [params?.id]);

  if (isPending) {
    return <div className="p-6">Loading event details...</div>;
  }

  if (!event) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="text-muted-foreground mt-2">
          The requested event could not be found or you do not have permission
          to view it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/platform/events">Back to Events</Link>
        </Button>
      </div>
    );
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
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={event.website ?? ""}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Now
            </Link>
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
              <p className="text-gray-700 leading-relaxed mb-4">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle>Event Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {event.organizer.imageUrl ? (
                  <Image
                    className="object-cover w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3"
                    src={event.organizer.imageUrl}
                    alt={event.organizer.name}
                    height={64}
                    width={64}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-gray-600">
                      {event.organizer.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h4 className="font-medium">{event.organizer.name}</h4>
                <p className="text-sm text-gray-600 mt-2">
                  {event.organizer.bio}
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href={event.organizer.website ?? ""}>
                    Visit Website
                  </Link>
                </Button>
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
                    {event?.start.toLocaleDateString()} -{" "}
                    {event?.endDate.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event?.start.toLocaleTimeString()} -{" "}
                    {event?.endDate.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{event.address}</p>
                  {/* <p className="text-sm text-gray-600">{event.venue}</p> */}
                </div>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">3 Days</p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild>
                <Link href={event.registrationUrl ?? ""}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Register Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
