"use client";

import React, {
  useState,
  useEffect,
  useActionState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getOrganizers,
  upsertEvent,
  getEventById,
} from "@/app/actions/actions";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ActionState } from "@/lib/types";

type EventData = NonNullable<Awaited<ReturnType<typeof getEventById>>>;
type Organizer = Awaited<ReturnType<typeof getOrganizers>>[0];

interface EventFormProps {
  mode: "create" | "edit";
  event?: EventData;
}

const initialState: ActionState = { success: false, message: "" };

export function EventForm({ mode, event }: EventFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    upsertEvent,
    initialState
  );

  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [isFetching, startTransition] = useTransition();

  const [selectedOrganizerId, setSelectedOrganizerId] = useState<
    string | undefined
  >(event?.organizerId);
  const [isCreatingOrganizer, setIsCreatingOrganizer] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      const fetchedOrganizers = await getOrganizers();
      setOrganizers(fetchedOrganizers);
    });
  }, []);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/admin/events");
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleOrganizerSelect = (value: string) => {
    if (value === "create_new") {
      setIsCreatingOrganizer(true);
      setSelectedOrganizerId(undefined);
    } else {
      setIsCreatingOrganizer(false);
      setSelectedOrganizerId(value);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {mode === "edit" && (
        <input type="hidden" name="eventId" value={event?.id} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={event?.title}
            />
            {state.errors?.title && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.title[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={5}
              defaultValue={event?.description}
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.description[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.png"
              defaultValue={event?.imageUrl || ""}
            />
            {state.errors?.imageUrl && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.imageUrl[0]}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start Date & Time *</Label>
            <Input
              id="start"
              name="start"
              type="datetime-local"
              required
              defaultValue={
                event?.start
                  ? new Date(
                      event.start.getTime() -
                        event.start.getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
            />
            {state.errors?.start && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.start[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date & Time *</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              required
              defaultValue={
                event?.endDate
                  ? new Date(
                      event.endDate.getTime() -
                        event.endDate.getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
            />
            {state.errors?.endDate && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.endDate[0]}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="virtual"
              name="virtual"
              defaultChecked={event?.virtual ?? false}
            />
            <Label htmlFor="virtual">This is a virtual event</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address / Platform *</Label>
            <Input
              id="address"
              name="address"
              required
              placeholder="e.g., Sandton Convention Centre or 'Online'"
              defaultValue={event?.address}
            />
            {state.errors?.address && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.address[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              Location Coordinates (Longitude, Latitude)
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., 28.0473, -26.2041"
              defaultValue={event?.location?.join(", ") || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Event Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com/event-page"
              defaultValue={event?.website || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationUrl">Registration URL</Label>
            <Input
              id="registrationUrl"
              name="registrationUrl"
              type="url"
              placeholder="https://tickets.com/event"
              defaultValue={event?.registrationUrl || ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organizer *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="hidden" name="organizerId" value={selectedOrganizerId} />
          <SearchableSelect
            options={[
              ...organizers.map((o) => ({ label: o.name, value: o.id })),
              { label: "+ Create a new organizer...", value: "create_new" },
            ]}
            value={selectedOrganizerId ?? ""}
            onChange={handleOrganizerSelect}
            placeholder="Select an existing organizer..."
            searchPlaceholder="Search organizers..."
            emptyText="No organizers found."
          />
          {state.errors?.organizerId && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.organizerId[0]}
            </p>
          )}

          <Collapsible
            open={isCreatingOrganizer}
            onOpenChange={setIsCreatingOrganizer}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center text-sm text-primary cursor-pointer -mt-2">
                {isCreatingOrganizer ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                {isCreatingOrganizer
                  ? "Cancel new organizer"
                  : "Or create a new one"}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <h3 className="font-semibold">New Organizer Details</h3>
              <div className="space-y-2">
                <Label htmlFor="newOrganizerName">Organizer Name</Label>
                <Input
                  id="newOrganizerName"
                  name="newOrganizerName"
                  placeholder="e.g., Africa Energy Forum"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newOrganizerBio">Bio / Description</Label>
                <Textarea
                  id="newOrganizerBio"
                  name="newOrganizerBio"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newOrganizerWebsite">Website</Label>
                <Input
                  id="newOrganizerWebsite"
                  name="newOrganizerWebsite"
                  type="url"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      <div className="flex justify-start gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : mode === "create"
            ? "Create Event"
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
