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
import { Search, FilterX, Eye, Map, List } from "lucide-react";
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
  Pagination,
  ProjectFilters,
  Cursor,
} from "@/lib/types";
import { Countries } from "@/components/countries-flags";
import { useLanguage } from "@/components/language-context";

const ProjectsMap = dynamic(() => import("@/components/projects-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const PAGE_SIZE = 10;

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
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [isPending, startTransition] = useTransition();
  const [cursors, setCursors] = useState<{ next?: Cursor; previous?: Cursor }>(
    {}
  );

  const fetchAndSetProjects = (
    newFilter?: ProjectFilters,
    order?: Pagination,
    search?: string
  ) => {
    startTransition(async () => {
      const currentFilters = { ...filters, ...newFilter };
      const { projects: fetchedProjects, total, nextCursor, prevCursor } = await getProjects(
        currentFilters,
        order,
        projects.length > 0 && order
          ? cursors[order]
          : undefined,
        search
      );

      setProjects(fetchedProjects);
      setCursors({ next: nextCursor, previous: prevCursor });
      setCount(total);
      setFilters(currentFilters);

      if (order === "previous") {
        setCurrentPage(p => Math.max(1, p - 1));
      } else if (order === "next") {
        setCurrentPage(p => Math.min(Math.ceil(total / PAGE_SIZE), p + 1));
      } else {
        setCurrentPage(1); // Reset to first page on new filter/search
      }
    });
  };

  useEffect(() => {
    fetchAndSetProjects();
  }, []);

  const handleSearch = () => {
    fetchAndSetProjects(undefined, undefined, searchTerm);
  };

  const onRegionChange = (value: string) => {
    const region = value === "all" ? undefined : (value as Region);
    const newFilters: ProjectFilters = { ...filters, region };

    if (
      region &&
      filters.country &&
      !REGIONS_COUNTRIES[region].includes(filters.country as Country)
    ) {
      newFilters.country = undefined; // Reset country if not in the new region
    }
    fetchAndSetProjects(newFilters);
  };

  const onCountryChange = (value: string) => {
    const country = value === "all" ? undefined : (value as Country);
    const newFilters: ProjectFilters = { ...filters, country };

    if (country) {
      for (const key in REGIONS_COUNTRIES) {
        const region = key as Region;
        if (REGIONS_COUNTRIES[region].includes(country as Country)) {
          newFilters.region = region;
          break;
        }
      }
    }
    fetchAndSetProjects(newFilters);
  };

  const onFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilterValue = value === "all" ? undefined : value;
    fetchAndSetProjects({ [key]: newFilterValue });
  };

  const resetFilters = () => {
    setSearchTerm("");
    fetchAndSetProjects(
      {
        sector: undefined,
        region: undefined,
        country: undefined,
        stage: undefined,
      },
      undefined,
      ""
    );
  };

  const projectDataByCountry = useMemo(() => {
    // This can be enhanced later to fetch aggregate data for all projects,
    // but for now, it shows aggregates for the currently loaded data.
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-akili-blue">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track energy infrastructure projects across Africa
        </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Select value={filters.region} onValueChange={onRegionChange}>
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
            <Select value={filters.country} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {(filters.region
                  ? REGIONS_COUNTRIES[filters.region]
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
              value={filters.sector}
              onValueChange={(v) => onFilterChange("sector", v)}
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
            <Select
              value={filters.stage}
              onValueChange={(v) => onFilterChange("stage", v)}
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
            <Button
              variant="outline"
              className="border-akili-orange text-akili-orange hover:bg-akili-orange hover:text-white col-span-full md:col-span-1"
              onClick={resetFilters}
            >
              <FilterX className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects with View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects ({count})</CardTitle>
              <CardDescription>
                {/* Showing page {currentPage} of {Math.ceil(count / PAGE_SIZE)} */}
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
            <>
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
                      {/* <TableHead>Operational Date</TableHead> */}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/platform/projects/${project.id}`}
                            className="hover:text-akili-blue transition-colors line-clamp-2"
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
                            max={1}
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
                          {project.investmentCosts}
                        </TableCell>
                        {/* <TableCell>
                          {project.date?.toLocaleDateString()}
                        </TableCell> */}
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
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * PAGE_SIZE, count)}
                  </span>{" "}
                  of <span className="font-medium">{count}</span> results
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      fetchAndSetProjects(filters, "previous", searchTerm)
                    }
                    disabled={cursors.previous === undefined || isPending}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      fetchAndSetProjects(filters, "next", searchTerm)
                    }
                    disabled={cursors.next === undefined || isPending}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
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
