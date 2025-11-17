"use client";

import { useState, useTransition, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, MapPin, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

type LatLng = [number, number];

// Type for a location suggestion from Nominatim
type Suggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
};

// Type for the selected location value
type Location = {
  address: string;
  position: LatLng;
};

const defaultPosition: LatLng = [2, 17];

type LocationPickerProps = {
  label?: string;
  value?: Location;
  onChange?: (value: Location | null) => void;
};

export default function LocationPicker({
  label = "Select Location",
  value,
  onChange,
}: LocationPickerProps) {
  const [mode, setMode] = useState<"combobox" | "map">("combobox");
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<Location | undefined>(value);
  const [boundingBox, setBoundingBox] = useState<
    [LatLng, LatLng] | undefined
  >();
  const [isPending, startTransition] = useTransition();

  // State for the combobox input and suggestions
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(encodeURIComponent(inputValue), 250); // Debounce API calls
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Fetch suggestions from Nominatim API
  useEffect(() => {
    console.log("Fetching suggestions for:", debouncedInputValue);
    if (debouncedInputValue && debouncedInputValue?.length > 2) {
      startTransition(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${debouncedInputValue}&limit=5`
          );
          if (response.ok) setSuggestions(await response.json());
        } catch (error) {
          console.error("Failed to fetch from Nominatim:", error);
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue]);

  // Handler for map clicks to update the location
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        // Perform reverse geocoding to get the address
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const { display_name } = (await response.json()) as Suggestion;
        const newLocation = {
          address:
            display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
          position: [lat, lng] as LatLng,
        };
        setLocation(newLocation);
        setInputValue(newLocation.address);
        setBoundingBox([
          [lat - 1, lng - 1],
          [lat + 1, lng + 1],
        ]);
        onChange?.(newLocation);
        setMode("combobox"); // Switch back to combobox to show the result
      },
    });
    return null;
  };

  return (
    <Card className="w-full p-2 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => {
            if (v) setMode(v as "combobox" | "map");
          }}
          aria-label="Location selection mode"
        >
          <ToggleGroupItem value="combobox" aria-label="Search by address">
            <Search className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="map" aria-label="Pick on map">
            <MapPin className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {mode === "combobox" ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="truncate">
                {location ? location.address : "Select location..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-7xl p-0">
            <Command>
              <CommandInput
                placeholder="Search for address..."
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                {isPending && (
                  <Loader2 className="h-8 w-8 animate-spin p-2 mx-auto" />
                )}
                {!isPending && <CommandEmpty>No location found.</CommandEmpty>}
                <CommandGroup>
                  {suggestions.map(({ place_id, display_name }) => (
                    <CommandItem
                      key={place_id}
                      value={display_name}
                      onSelect={(currentValue) => {
                        const selectedSuggestion = suggestions.find(
                          (s) =>
                            s.display_name.toLowerCase() ===
                            currentValue.toLowerCase()
                        );
                        if (selectedSuggestion) {
                          const newLocation = {
                            address: selectedSuggestion.display_name,
                            position: [
                              parseFloat(selectedSuggestion.lat),
                              parseFloat(selectedSuggestion.lon),
                            ] as LatLng,
                          };
                          setLocation(newLocation);
                          setInputValue(newLocation.address);
                          setBoundingBox([
                            [
                              parseFloat(selectedSuggestion.boundingbox[0]),
                              parseFloat(selectedSuggestion.boundingbox[2]),
                            ],
                            [
                              parseFloat(selectedSuggestion.boundingbox[1]),
                              parseFloat(selectedSuggestion.boundingbox[3]),
                            ],
                          ]);
                          onChange?.(newLocation);
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          location?.address === display_name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {display_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="rounded-md cursor-pointer">
          <MapContainer
            center={location?.position || defaultPosition}
            zoom={14}
            minZoom={3}
            style={{ height: "300px", width: "100%" }}
            scrollWheelZoom={true}
            bounds={boundingBox}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location && <Marker position={location.position}></Marker>}
            <MapClickHandler />
          </MapContainer>
        </div>
      )}
    </Card>
  );
}
