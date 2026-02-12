"use client";

import { getProjects } from "@/app/actions/projects";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { useLanguage } from "@/components/language-context";
import {
  countryCode,
  geographicRegion,
  projectStage,
} from "@/lib/db/schema";
import { SECTORS } from "@/lib/constants";
import { FetchProjectsResults } from "@/lib/types";
import { useState, useTransition, useEffect } from "react";

export default function AdminProjectsPage() {
  const { t } = useLanguage();

  const projectFilters = [
    {
      column: "region",
      title: "Region",
      options: geographicRegion.enumValues.map((region) => ({
        label: t(`common.regions.${region}`),
        value: region,
      })),
    },
    {
      column: "country",
      title: "Country",
      options: countryCode.enumValues.map((country) => ({
        label: t(`common.countries.${country}`),
        value: country,
      })),
    },
    {
      column: "sectors",
      title: "Sector",
      options: SECTORS.map((sector) => ({
        label: t(`common.sectors.${sector}`),
        value: sector,
      })),
    },
    {
      column: "stage",
      title: "Stage",
      options: projectStage.enumValues.map((stage) => ({
        label: t(`projects.stages.${stage}`),
        value: stage,
      })),
    },
  ];

  const [projects, setProjects] = useState<FetchProjectsResults>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { projects: allProjects } = (await getProjects(undefined, undefined, undefined, undefined, 2000))!;
      setProjects(
        allProjects.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      );
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">
            View, create, and manage all energy projects.
          </p>
        </div>
        {/* <Button asChild>
          <Link href="/admin/projects/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Link>
        </Button> */}
      </div>

      {/* The DataTable component now handles everything else */}
      <DataTable
        columns={columns}
        data={projects}
        filters={projectFilters}
        searchField="name"
        label="projects"
      />
    </div>
  );
}
