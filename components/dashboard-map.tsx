"use client";

import { getProjectsAnalytics } from "@/app/actions/actions";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import africanCountries from "@/lib/africa.geo.json";
import type { FeatureCollection, Feature } from "geojson";
import { Country } from "@/lib/types";

type CountryCapacityFundraising = Awaited<
  ReturnType<typeof getProjectsAnalytics>
>["countriesByCapacityAndFinancing"];

function getCountryData(code: Country, data: CountryCapacityFundraising) {
  // Ensure we match case-insensitively or strictly depending on your data
  return data.find((p) => p.countryCode === code);
}

function getColor(value: number, min: number, max: number) {
  if (value === 0 || isNaN(value)) return "#e5e7eb"; // Gray-200 for no data

  const ratio = (value - min) / (max - min || 1);

  // Interpolate between light green and dark green
  // Light: rgb(220, 252, 231) (Tailwind green-100)
  // Dark:  rgb(21, 128, 61)   (Tailwind green-700)

  const r1 = 220,
    g1 = 252,
    b1 = 231;
  const r2 = 21,
    g2 = 128,
    b2 = 61;

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `rgb(${r},${g},${b})`;
}

export default function InteractiveMap({
  data,
}: {
  data: CountryCapacityFundraising;
}) {
  // Calculate ranges for color scaling
  const capacities = data.map((d) => d.totalCapacity ?? 0);
  const financing = data.map((d) => d.financing ?? 0);

  const minCapacity = Math.min(...capacities, 0);
  const maxCapacity = Math.max(...capacities, 1); // Avoid div by zero
  const minFinancing = Math.min(...financing, 0);
  const maxFinancing = Math.max(...financing, 1);

  const style = (feature?: Feature) => {
    // Note: Verify if your GeoJSON uses 'iso_a2' or 'ISO_A2'. It is case sensitive.
    const isoCode = feature?.properties?.iso_a2 || feature?.properties?.ISO_A2;
    const country = getCountryData(isoCode, data);

    // Priority: Capacity -> Financing -> Default
    const value = country?.totalCapacity || country?.financing || 0;
    const min = country?.totalCapacity ? minCapacity : minFinancing;
    const max = country?.totalCapacity ? maxCapacity : maxFinancing;

    return {
      fillColor: getColor(value, min, max),
      weight: 1,
      opacity: 1,
      color: "white", // Border color
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const isoCode = feature.properties?.iso_a2 || feature.properties?.ISO_A2;
    const country = getCountryData(isoCode, data);

    const countryName =
      feature.properties?.admin || feature.properties?.name || "Unknown";

    if (country) {
      const content = `
        <div class="text-sm">
          <strong class="text-base">${countryName}</strong>
          <div class="mt-1">
            Project Capacity: <b>${country.totalCapacity ?? 0} MW</b><br/>
            Financing: <b>$${(
              country.financing ?? 0
            ).toLocaleString()}M</b><br/>
            Total Projects: <b>${country.projectCount ?? 0}</b>
          </div>
        </div>
      `;
      layer.bindTooltip(content, { sticky: true, opacity: 1 });

      // Optional: Add hover effect
      // @ts-ignore
      layer.on("mouseover", function (e) {
        e.target.setStyle({ fillOpacity: 1, weight: 2 });
      });
      // @ts-ignore
      layer.on("mouseout", function (e) {
        e.target.setStyle({ fillOpacity: 0.8, weight: 1 });
      });
    } else {
      layer.bindTooltip(
        `<strong>${countryName}</strong><br/><span class="text-xs text-gray-500">No active projects</span>`,
        {
          sticky: true,
        }
      );
    }
  };

  return (
    <MapContainer
      center={[2, 17]}
      minZoom={2}
      maxZoom={4}
      zoom={2.5}
      touchZoom={false}
      style={{ height: "100%", width: "100%", backgroundColor: "#f8fafc" }}
      scrollWheelZoom={false}
      dragging={true}
      doubleClickZoom={false}
      attributionControl={false}
      maxBounds={[
        [-40, -25], // Southwest coordinates
        [45, 65], // Northeast coordinates
      ]}
    >
      <GeoJSON
        // CRITICAL: This key forces the component to re-mount when data changes
        key={JSON.stringify(data)}
        data={africanCountries as FeatureCollection}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
