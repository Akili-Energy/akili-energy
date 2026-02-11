"use client";

import { useMemo, useState, useRef, useId, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useRouter } from "next/navigation";
import type { FetchProjectsResults } from "@/lib/types";
import { useLanguage } from "@/components/language-context";
import { Badge } from "@/components/ui/badge";

type Project = FetchProjectsResults[number];

type PopupState = {
  project: Project;
  x: number; // px relative to wrapper div
  y: number;
};

type ProjectsMapProps = {
  projects: FetchProjectsResults;
  onProjectClick?: (projectId: string) => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SECTOR_COLORS: Record<string, string> = {
  solar: "#FFB020",
  wind: "#4A90E2",
  hydro: "#50C8E8",
  geothermal: "#E85050",
  battery: "#9B59B6",
  biomass: "#2ECC71",
  gas: "#FF6B6B",
  coal: "#7D7D7D",
  nuclear: "#FF8C42",
  other: "#95A5A6",
};

const STAGE_COLORS: Record<string, string> = {
  operational: "bg-green-100  text-green-800  border border-green-200",
  in_construction: "bg-blue-100   text-blue-800   border border-blue-200",
  early_stage: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  late_stage: "bg-orange-100 text-orange-800 border border-orange-200",
  ready_to_build: "bg-purple-100 text-purple-800 border border-purple-200",
  proposal: "bg-teal-100   text-teal-800   border border-teal-200",
};

const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  DZ: [28.0339, 1.6596],
  AO: [-11.2027, 17.8739],
  BJ: [9.3077, 2.3158],
  BW: [-22.3285, 24.6849],
  BF: [12.2383, -1.5616],
  BI: [-3.3731, 29.9189],
  CM: [7.3697, 12.3547],
  CV: [16.5388, -23.0418],
  CF: [6.6111, 20.9394],
  TD: [15.4542, 18.7322],
  KM: [-11.6455, 43.3333],
  CG: [-0.228, 15.8277],
  CD: [-4.0383, 21.7587],
  CI: [7.54, -5.5471],
  DJ: [11.8251, 42.5903],
  EG: [26.8206, 30.8025],
  GQ: [1.6508, 10.2679],
  ER: [15.1794, 39.7823],
  ET: [9.145, 40.4897],
  GA: [-0.8037, 11.6094],
  GM: [13.4432, -15.3101],
  GH: [7.9465, -1.0232],
  GN: [9.9456, -9.6966],
  GW: [11.8037, -15.1804],
  KE: [-0.0236, 37.9062],
  LS: [-29.61, 28.2336],
  LR: [6.4281, -9.4295],
  LY: [26.3351, 17.2283],
  MG: [-18.767, 46.8691],
  MW: [-13.254, 34.3015],
  ML: [17.5707, -3.9962],
  MR: [21.0079, -10.9408],
  MU: [-20.348, 57.5522],
  MA: [31.7917, -7.0926],
  MZ: [-18.666, 35.5296],
  NA: [-22.958, 18.4904],
  NE: [17.6078, 8.0817],
  NG: [9.082, 8.6753],
  RW: [-1.9403, 29.8739],
  ST: [0.1864, 6.6131],
  SN: [14.4974, -14.4524],
  SC: [-4.6796, 55.492],
  SL: [8.4606, -11.7799],
  SO: [5.1521, 46.1996],
  ZA: [-30.56, 22.9375],
  SS: [6.877, 31.307],
  SD: [12.8628, 30.2176],
  SZ: [-26.523, 31.4659],
  TZ: [-6.369, 34.8888],
  TG: [8.6195, 0.8248],
  TN: [33.8869, 9.5375],
  UG: [1.3733, 32.2903],
  ZM: [-13.134, 27.8493],
  ZW: [-19.015, 29.1549],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getSectorColor = (sectors: string[]): string => {
  if (!sectors?.length) return SECTOR_COLORS.other;
  return SECTOR_COLORS[sectors[0].toLowerCase()] ?? SECTOR_COLORS.other;
};

// plantCapacity and investmentCosts are numbers
const getMarkerRadius = (capacity: number | null): number => {
  if (!capacity || capacity <= 0) return 7;
  const normalized = Math.min(
    Math.max(Math.log10(capacity + 1) / Math.log10(10_000), 0),
    1,
  );
  return 7 + normalized * (22 - 7);
};

const formatCapacity = (v: number | null) =>
  v != null ? `${v.toLocaleString()} MW` : "N/A";

const formatInvestment = (v: number | null) =>
  v != null ? `$${v.toLocaleString()}M` : "N/A";

const getProjectCoords = (project: Project): [number, number] | null => {
  // Swap to real coordinates once you add lat/lng to DB:
  // if (project.latitude != null && project.longitude != null)
  //   return [project.latitude, project.longitude];

  if (!project.country) return null;
  const centroid = COUNTRY_CENTROIDS[project.country];
  if (!centroid) return null;

  // Deterministic scatter so positions are stable across renders
  const hash = [...project.id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const angle = (hash % 360) * (Math.PI / 180);
  const distance = ((hash % 100) / 100) * 0.8;
  return [
    centroid[0] + Math.sin(angle) * distance,
    centroid[1] + Math.cos(angle) * distance,
  ];
};

// ─── Popup Card (rendered outside MapContainer, never clipped) ────────────────

const POPUP_W = 320;
const POPUP_H = 290; // approx height for smart placement
const V_OFFSET = 18; // px gap between marker centre and popup edge

function ProjectPopup({
  popup,
  pinned,
  wrapperHeight,
  t,
  onClose,
  onViewDetails,
}: {
  popup: PopupState;
  pinned: boolean;
  wrapperHeight: number;
  t: (k: string) => string;
  onClose: () => void;
  onViewDetails: () => void;
}) {
  const color = getSectorColor(popup.project.sectors);

  // Prefer popup above marker; flip below if not enough room
  const fitsAbove = popup.y - POPUP_H - V_OFFSET >= 4;
  let top = fitsAbove ? popup.y - POPUP_H - V_OFFSET : popup.y + V_OFFSET + 12;
  let left = popup.x - POPUP_W / 2;

  // Clamp horizontally within the wrapper
  if (left < 8) left = 8;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top,
        left,
        width: POPUP_W,
        zIndex: 2000,
        maxWidth: "calc(100% - 16px)",
      }}
    >
      {/* Caret – above popup means caret is at bottom */}
      {fitsAbove && (
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: Math.min(POPUP_W / 2, POPUP_W - 20),
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "9px solid white",
            filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.10))",
          }}
        />
      )}

      <div
        className="rounded-xl border border-gray-100 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.99)",
          boxShadow:
            "0 20px 60px -10px rgba(0,0,0,0.22), 0 4px 16px -4px rgba(0,0,0,0.10)",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 border-b border-gray-100"
          style={{
            background: `linear-gradient(135deg, ${color}18 0%, ${color}05 100%)`,
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
              {popup.project.name}
            </h3>
            {pinned && (
              <button
                className="pointer-events-auto flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mt-0.5"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {popup.project.country
                ? t(`common.countries.${popup.project.country}`)
                : ""}
              {popup.project.region
                ? ` · ${t(`common.regions.${popup.project.region}`)}`
                : ""}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Technology + Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                Technology
              </p>
              <div className="flex flex-wrap gap-1">
                {popup.project.sectors?.length ? (
                  popup.project.sectors.slice(0, 2).map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        background: getSectorColor([s]) + "18",
                        color: getSectorColor([s]),
                        border: `1px solid ${getSectorColor([s])}35`,
                      }}
                    >
                      {t(`common.sectors.${s}`)}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">N/A</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                Stage
              </p>
              {popup.project.stage ? (
                <Badge
                  className={`text-[10px] font-medium px-2 py-0.5 ${
                    STAGE_COLORS[popup.project.stage] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t(`projects.stages.${popup.project.stage}`)}
                </Badge>
              ) : (
                <span className="text-xs text-gray-400">N/A</span>
              )}
            </div>
          </div>

          {/* Capacity + Investment */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                Capacity
              </p>
              <p className="text-base font-bold text-gray-900 tabular-nums">
                {formatCapacity(popup.project.plantCapacity)}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                Investment
              </p>
              <p className="text-base font-bold text-gray-900 tabular-nums">
                {formatInvestment(popup.project.investmentCosts)}
              </p>
            </div>
          </div>

          {/* Sponsor */}
          {popup.project.sponsor && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                Sponsor
              </p>
              <p className="text-xs text-gray-700 font-medium truncate">
                {popup.project.sponsor}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {pinned ? (
          <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100">
            <button
              className="pointer-events-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
            >
              View project details
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100">
            <p className="text-[9px] text-gray-400 text-center tracking-wide">
              Click marker to pin · click again to dismiss
            </p>
          </div>
        )}
      </div>

      {/* Caret below popup (when popup is below marker) */}
      {!fitsAbove && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: Math.min(POPUP_W / 2, POPUP_W - 20),
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "9px solid white",
            filter: "drop-shadow(0 -3px 3px rgba(0,0,0,0.10))",
          }}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectsMap({
  projects,
  onProjectClick,
}: ProjectsMapProps) {
  const [mapKey, setMapKey] = useState<string | null>(null);
  const { t } = useLanguage();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null!);

  const [hoverPopup, setHoverPopup] = useState<PopupState | null>(null);
  const [pinnedPopup, setPinnedPopup] = useState<PopupState | null>(null);

  useEffect(() => {
    setMapKey(`map-${Date.now()}`);
  }, []);

  const projectsWithCoords = useMemo(
    () => projects.filter((p) => getProjectCoords(p) !== null),
    [projects],
  );

  if (!mapKey) return <div className="h-[600px] w-full bg-gray-100 animate-pulse" />;

  return (
    // overflow: visible so the popup div is never clipped
    <div
      ref={wrapperRef}
      className="relative"
      style={{ overflow: "visible", isolation: "isolate" }}
    >
      <MapContainer
        key={mapKey} // Force remount on key change to reset internal state
        center={[2, 17]}
        minZoom={3}
        maxZoom={10}
        zoom={3}
        style={{ height: "600px", width: "100%", backgroundColor: "#f9f9f9" }}
        scrollWheelZoom
        dragging
        maxBounds={[
          [-45, -30],
          [45, 70],
        ]}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {projectsWithCoords.map((project) => {
          const coords = getProjectCoords(project)!;
          const radius = getMarkerRadius(project.plantCapacity);
          const color = getSectorColor(project.sectors);
          const isPinned = pinnedPopup?.project.id === project.id;

          return (
            <CircleMarker
              key={project.id}
              center={coords}
              radius={radius}
              pathOptions={{
                fillColor: color,
                color: isPinned ? "#111" : "#fff",
                weight: isPinned ? 2.5 : 1.5,
                opacity: 1,
                fillOpacity: isPinned ? 1 : 0.82,
              }}
              eventHandlers={{
                mouseover(e) {
                  e.target.setStyle({
                    fillOpacity: 1,
                    weight: 2.5,
                    color: "#fff",
                  });
                  const { x, y } = e.containerPoint;
                  setHoverPopup({ project, x, y });
                },
                mouseout(e) {
                  e.target.setStyle({
                    fillOpacity: isPinned ? 1 : 0.82,
                    weight: isPinned ? 2.5 : 1.5,
                    color: isPinned ? "#111" : "#fff",
                  });
                  setHoverPopup(null);
                },
                click(e) {
                  const { x, y } = e.containerPoint;
                  setPinnedPopup((prev) =>
                    prev?.project.id === project.id ? null : { project, x, y },
                  );
                  if (onProjectClick) onProjectClick(project.id);
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* Hover popup – hidden while something is pinned */}
      {!pinnedPopup && hoverPopup && (
        <ProjectPopup
          popup={hoverPopup}
          pinned={false}
          wrapperHeight={wrapperRef.current?.offsetHeight ?? 600}
          t={t}
          onClose={() => {}}
          onViewDetails={() =>
            router.push(`/platform/projects/${hoverPopup.project.id}`)
          }
        />
      )}

      {/* Pinned popup */}
      {pinnedPopup && (
        <ProjectPopup
          popup={pinnedPopup}
          pinned
          wrapperHeight={wrapperRef.current?.offsetHeight ?? 600}
          t={t}
          onClose={() => setPinnedPopup(null)}
          onViewDetails={() =>
            router.push(`/platform/projects/${pinnedPopup.project.id}`)
          }
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 rounded-xl shadow-xl border border-gray-100 p-4 z-[1001]">
        <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-2.5">
          Sectors
        </p>
        <div className="space-y-1.5">
          {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
            <div key={sector} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-700 capitalize">{sector}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-gray-100 text-[9px] text-gray-400">
          ● size indicates capacity
        </div>
      </div>

      {/* Count badge */}
      <div className="absolute top-3 right-4 bg-white/95 rounded-lg shadow border border-gray-100 px-3 py-1.5 z-[1001]">
        <p className="text-xs text-gray-600">
          <span className="font-bold text-gray-900">
            {projectsWithCoords.length}
          </span>{" "}
          project{projectsWithCoords.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
