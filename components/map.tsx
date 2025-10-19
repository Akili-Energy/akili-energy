import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

type MapProps = {
  locations: { name: string; position: [number, number] }[];
  height?: number;
};

export default function Map({ locations, height }: MapProps) {
  const latitudes = locations.map(({ position: [lat] }) => lat);
  const longitudes = locations.map(({ position: [_, lng] }) => lng);

  const north = Math.max(...latitudes);
  const east = Math.max(...longitudes);
  const south = Math.min(...latitudes);
  const west = Math.min(...longitudes);
  return (
    <MapContainer
      center={[(north + south) / 2, (east + west) / 2]}
      minZoom={6}
      zoom={15}
      //   touchZoom={false}
      style={{ height: "100%", width: "100%", backgroundColor: "#FFFFFF" }}
      //   scrollWheelZoom={false}
      dragging={false}
      // zoomControl={false}
      maxBounds={[
        [south - 1, west - 1],
        [north + 1, east + 1],
      ]}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map(({ name, position }) => (
        <Marker key={position.join(",")} position={position}>
          <Tooltip>{name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
