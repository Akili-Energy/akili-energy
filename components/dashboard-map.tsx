import { getProjectsAnalytics } from "@/app/actions/actions";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import africanCountries from "@/lib/africa.geo.json";
import type { FeatureCollection, Feature } from "geojson";
import { Country } from "@/lib/types";

type CountryCapacityFundraising = Awaited<
  ReturnType<typeof getProjectsAnalytics>
>["countriesByCapacityAndFinancing"];

function getCountryData(code: Country, data: CountryCapacityFundraising) {
  return data.find((p) => p.countryCode === code);
}

function getColor(value: number, min: number, max: number) {
  if (isNaN(value)) return "#f0f0f0";
  const ratio = (value - min) / (max - min || 1);
  const r1 = 250,
    g1 = 255,
    b1 = 250; // #c0ffc0
  const r2 = 0,
    g2 = 128,
    b2 = 0; // #008000
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
  const capacities = data.map((d) => d.totalCapacity);
  const minCapacity = Math.min(...capacities);
  const maxCapacity = Math.max(...capacities);

  const financing = data.map((d) => d.totalFinancing);
  const minFinancing = Math.min(...financing);
  const maxFinancing = Math.max(...financing);


  // Style each feature
  const style = (feature?: Feature) => {
    const country = getCountryData(feature?.properties?.iso_a2, data);
    return {
      fillColor: country?.totalCapacity
        ? getColor(country?.totalCapacity, minCapacity, maxCapacity)
        : getColor(country?.totalFinancing ?? 0, minFinancing, maxFinancing),
      weight: 1,
      opacity: 1,
      color: "#ccc",
      fillOpacity: 0.9,
    };
  };

  // Bind tooltip for each country
  const onEachFeature = (feature: Feature, layer: Layer) => {
    const country = getCountryData(feature.properties?.iso_a2, data);
    if (country) {
      const content = `
        <div>
          <strong>${feature.properties?.admin}</strong>
          <br/>Capacity: ${country.totalCapacity ?? 0} MW
          <br/>Financing: $${country.totalFinancing ?? 0}M
          <br/>Projects: ${country.projectCount ?? "-"}
        </div>
      `;
      layer.bindTooltip(content, { sticky: true });
    } else {
      layer.bindTooltip(`<strong>${feature.properties?.admin}</strong><br/>`, {
        sticky: true,
      });
    }
  };

  return (
    <MapContainer
      center={[2, 17]} // Centered more appropriately for Africa
      minZoom={2}
      maxZoom={3}
      zoom={2.5}
      touchZoom={false}
      style={{ height: 400, width: "100%", backgroundColor: "#FFFFFF" }}
      scrollWheelZoom={false}
      dragging={false}
      // zoomControl={false}
      maxBounds={[
        [-40, -25],
        [40, 65],
      ]} // Lock view to Africa
    >
      <TileLayer
        url="https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={africanCountries as FeatureCollection}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
