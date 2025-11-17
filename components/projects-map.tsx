"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import africanCountries from "@/lib/africa.geo.json";
import type { FeatureCollection, Feature } from "geojson";
import type { Path } from "leaflet";

type ProjectsMapProps = {
  projectsByCountry: Record<string, { count: number; capacity: number }>;
  onCountryClick: (countryCode: string) => void;
};

// Helper function for linear interpolation
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const colorStops = {
  0.0: [240, 255, 240],
  0.33: [160, 216, 160],
  0.66: [80, 170, 80],
  1.0: [0, 128, 0],
};

/**
 * Calculates the color for a given capacity value based on a logarithmic scale.
 * @param capacity - The total capacity for a country.
 * @param minLog - The minimum logarithmic capacity value in the dataset.
 * @param maxLog - The maximum logarithmic capacity value in the dataset.
 * @returns An RGB color string.
 */
const getColor = (capacity: number, minLog: number, maxLog: number): string => {
  if (capacity <= 0) return "#c0c0c0";

  // Use log scale for better distribution, adding 1 to handle capacities of 0
  const logCapacity = Math.log10(capacity + 1);

  // Normalize the value between 0 and 1
  const t = maxLog > minLog ? (logCapacity - minLog) / (maxLog - minLog) : 0;

  let startColor, endColor, localT;

  if (t < 0.33) {
    startColor = colorStops[0.0];
    endColor = colorStops[0.33];
    localT = t / 0.33;
  } else if (t < 0.66) {
    startColor = colorStops[0.33];
    endColor = colorStops[0.66];
    localT = (t - 0.33) / 0.33;
  } else {
    startColor = colorStops[0.66];
    endColor = colorStops[1.0];
    localT = (t - 0.66) / 0.34;
  }

  const r = Math.round(lerp(startColor[0], endColor[0], localT));
  const g = Math.round(lerp(startColor[1], endColor[1], localT));
  const b = Math.round(lerp(startColor[2], endColor[2], localT));

  return `rgb(${r}, ${g}, ${b})`;
};

export default function ProjectsMap({
  projectsByCountry,
  onCountryClick,
}: ProjectsMapProps) {
  // Calculate min and max capacities using a log scale for better color distribution.
  // useMemo ensures this calculation only runs when the project data changes.
  const { minLog, maxLog } = useMemo(() => {
    const capacities = Object.values(projectsByCountry)
      .map((d) => d.capacity)
      .filter((c) => c > 0);

    if (capacities.length === 0) {
      return { minLog: 0, maxLog: 0 };
    }

    const logCapacities = capacities.map((c) => Math.log10(c + 1));

    return {
      minLog: Math.min(...logCapacities),
      maxLog: Math.max(...logCapacities),
    };
  }, [projectsByCountry]);

  const style = (feature?: Feature) => {
    const countryCode = feature?.properties?.iso_a2;
    const countryData = projectsByCountry[countryCode];

    return {
      fillColor: countryData
        ? getColor(countryData.capacity, minLog, maxLog)
        : "#c0c0c0",
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: countryData ? 0.8 : 0.4,
    };
  };

  const onEachFeature = (feature: Feature, layer: Path) => {
    if (!feature.properties) return;
    const countryCode = feature.properties.iso_a2;
    const countryName = feature.properties.name;
    const data = projectsByCountry[countryCode];

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 2.5,
          color: "#333",
          fillOpacity: 1,
        });
        if (data) {
          layer.openTooltip();
        }
      },
      mouseout: () => {
        layer.setStyle(style(feature));
        if (data) {
          layer.closeTooltip();
        }
      },
      click: () => {
        if (data) {
          onCountryClick(countryCode);
        }
      },
    });

    if (data) {
      layer.bindTooltip(
        `
        <div style="font-weight: bold; font-size: 1.1em;">${countryName}</div>
        <div><strong>Projects:</strong> ${data.count}</div>
        <div><strong>Total Capacity:</strong> ${data.capacity.toFixed(
          2
        )} MW</div>
      `,
        { sticky: true, className: "leaflet-custom-tooltip" }
      );
    }
  };

  return (
    <MapContainer
      center={[2, 17]} // Centered more appropriately for Africa
      minZoom={3}
      maxZoom={4}
      zoom={3}
      touchZoom={false}
      style={{ height: "600px", width: "100%", backgroundColor: "#f9f9f9" }}
      scrollWheelZoom={false}
      dragging={false}
      // zoomControl={false}
      maxBounds={[
        [-40, -25],
        [40, 65],
      ]} // Lock view to Africa
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <GeoJSON
        data={africanCountries as FeatureCollection}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
