"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { EventForm } from "../../_components/event-form";
import { getEventById } from "@/app/actions/events";

type Event = Awaited<ReturnType<typeof getEventById>>;

export default function EditEventPage({
  params,
}: {  
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventById(id);
      setEvent(event);
      setIsLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!event) {
    notFound();
  } 

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground mt-1 truncate">
            Editing: {event.title}
          </p>
        </div>
      </div>
      <EventForm mode="edit" event={event} />
    </div>
  );
}
