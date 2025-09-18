"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { getProjects } from "@/app/actions/projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Filter, Download, Eye, Map, List } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SectorsIconsTooltip } from "@/components/sector-icon";
import { REGIONS_COUNTRIES } from "@/lib/constants";
import {
  geographicRegion,
  countryCode,
  projectSector,
  projectStage as projectStageEnum,
} from "@/lib/db/schema";
import {
  FetchProjectsResults,
  ProjectSector,
  Region,
  Country,
  ProjectStage,
} from "@/lib/types";
import { Countries } from "@/components/countries-flags";
import { useLanguage } from "@/components/language-context";

const ProjectsMap = dynamic(() => import("@/components/projects-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const getStageColor = (stage: string | null) => {
  if (!stage) return "bg-gray-100 text-gray-800 border-gray-200";
  const colorMap: { [key: string]: string } = {
    operational: "bg-green-100 text-green-800 border-green-200",
    in_construction: "bg-blue-100 text-blue-800 border-blue-200",
    early_stage: "bg-yellow-100 text-yellow-800 border-yellow-200",
    late_stage: "bg-orange-100 text-orange-800 border-orange-200",
    ready_to_build: "bg-purple-100 text-purple-800 border-purple-200",
    proposal: "bg-teal-100 text-teal-800 border-teal-200",
  };
  return colorMap[stage] || "bg-gray-100 text-gray-800 border-gray-200";
};

export default function ProjectsPage() {
  const { t } = useLanguage();

  const [projects, setProjects] = useState<FetchProjectsResults>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<ProjectSector | "all">("all");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [selectedCountry, setSelectedCountry] = useState<Country | "all">(
    "all"
  );
  const [selectedStage, setSelectedStage] = useState<ProjectStage | "all">(
    "all"
  );
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const allProjects = await getProjects();
      setProjects(allProjects);
    });
  }, []);

  const projectDataByCountry = useMemo(() => {
    const data: Record<string, { count: number; capacity: number }> = {};
    projects.forEach((project) => {
      const country = project.country;
      if (country) {
        if (!data[country]) {
          data[country] = { count: 0, capacity: 0 };
        }
        data[country].count++;
        data[country].capacity += Number(project.plantCapacity) || 0;
      }
    });
    return data;
  }, [projects]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector =
          selectedSector === "all" || project.sectors.includes(selectedSector);
        const matchesRegion =
          selectedRegion === "all" || project.region === selectedRegion;
        const matchesCountry =
          selectedCountry === "all" || project.country === selectedCountry;
        const matchesStage =
          selectedStage === "all" || project.stage === selectedStage;

        return (
          matchesSearch &&
          matchesSector &&
          matchesRegion &&
          matchesCountry &&
          matchesStage
        );
      }),
    [
      projects,
      searchTerm,
      selectedSector,
      selectedRegion,
      selectedCountry,
      selectedStage,
    ]
  );

  const onRegionChange = (value: string) => {
    const region = value as Region | "all";
    setSelectedRegion(region);
    if (
      region !== "all" &&
      selectedCountry !== "all" &&
      !REGIONS_COUNTRIES[region].includes(selectedCountry as Country)
    ) {
      setSelectedCountry("all");
    }
  };

  const onCountryChange = (value: string) => {
    const country = value as Country | "all";
    setSelectedCountry(country);
    if (country === "all") return;

    for (const key in REGIONS_COUNTRIES) {
      const region = key as Region;
      if (REGIONS_COUNTRIES[region].includes(country as Country)) {
        setSelectedRegion(region);
        break;
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-akili-blue">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track energy infrastructure projects across Africa
          </p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine your search to find specific projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedSector}
              onValueChange={(v) =>
                setSelectedSector(v as ProjectSector | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {projectSector.enumValues.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`common.sectors.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {geographicRegion.enumValues.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`common.regions.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {(selectedRegion !== "all"
                  ? REGIONS_COUNTRIES[selectedRegion]
                  : countryCode.enumValues
                )
                  .toSorted()
                  .map((c) => (
                    <SelectItem key={c} value={c}>
                      {t(`common.countries.${c}`)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStage}
              onValueChange={(v) => setSelectedStage(v as ProjectStage | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Project Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {projectStageEnum.enumValues.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`projects.stages.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects with View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects ({filteredProjects.length})</CardTitle>
              <CardDescription>
                Showing {filteredProjects.length} of {projects.length} total
                projects
              </CardDescription>
            </div>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="h-8 px-3"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <p>Loading projects...</p>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">
                      Project Name
                    </TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Project Stage</TableHead>
                    <TableHead>Capacity (MW)</TableHead>
                    <TableHead>Investment ($M)</TableHead>
                    <TableHead>Operational Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/platform/projects/${project.id}`}
                          className="hover:text-akili-blue transition-colors cursor-pointer line-clamp-2 font-medium cursor-pointer"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell className="truncate">
                        {project.sponsor}
                      </TableCell>
                      <TableCell>
                        <SectorsIconsTooltip sectors={project.sectors} />
                      </TableCell>
                      <TableCell className="truncate">
                        {project.region &&
                          t(`common.regions.${project.region}`)}
                      </TableCell>
                      <TableCell className="truncate">
                        <Countries
                          countries={project.country ? [project.country] : []}
                          max={3}
                        />
                      </TableCell>
                      <TableCell className="truncate">
                        {project.stage && (
                          <Badge className={getStageColor(project.stage)}>
                            {t(`projects.stages.${project.stage}`)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {project.plantCapacity}
                      </TableCell>
                      <TableCell className="font-medium">
                        {project.investmentCosts || "N/A"}
                      </TableCell>
                      <TableCell>{project.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/platform/projects/${project.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // <></>
            <ProjectsMap
              projectsByCountry={projectDataByCountry}
              onCountryClick={(countryCode) => {
                onCountryChange(countryCode);
                setViewMode("table");
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
