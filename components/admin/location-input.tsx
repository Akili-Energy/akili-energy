"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Type } from "lucide-react"

interface LocationInputProps {
  value: {
    text?: string
    latitude?: number
    longitude?: number
  }
  onChange: (location: { text?: string; latitude?: number; longitude?: number }) => void
  label?: string
  placeholder?: string
}

export default function LocationInput({
  value,
  onChange,
  label = "Location",
  placeholder = "Enter location",
}: LocationInputProps) {
  const [inputMode, setInputMode] = useState<"text" | "map">("text")

  const handleTextChange = (text: string) => {
    onChange({ text, latitude: undefined, longitude: undefined })
  }

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert pixel coordinates to lat/lng (simplified for demo)
    // In a real implementation, you'd use a proper map library like Leaflet or Google Maps
    const latitude = 51.5074 - (y / rect.height) * 10 // Rough conversion for demo
    const longitude = -0.1278 + (x / rect.width) * 10 // Rough conversion for demo

    onChange({
      text: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      latitude: Number(latitude.toFixed(4)),
      longitude: Number(longitude.toFixed(4)),
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={inputMode === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("text")}
          >
            <Type className="h-4 w-4 mr-1" />
            Text
          </Button>
          <Button
            type="button"
            variant={inputMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("map")}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Map
          </Button>
        </div>
      </div>

      {inputMode === "text" ? (
        <Input value={value.text || ""} onChange={(e) => handleTextChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <Card>
          <CardContent className="p-4">
            <div
              className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-crosshair relative"
              onClick={handleMapClick}
            >
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Click to set location</p>
                {value.latitude && value.longitude && (
                  <div className="mt-2 text-xs">
                    <p>Lat: {value.latitude}</p>
                    <p>Lng: {value.longitude}</p>
                  </div>
                )}
              </div>
              {value.latitude && value.longitude && (
                <div
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: `${((value.longitude + 0.1278) / 10) * 100}%`,
                    top: `${((51.5074 - value.latitude) / 10) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Click anywhere on the map to set the location coordinates</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
