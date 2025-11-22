"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { getProjectById } from "@/app/actions/projects";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
  FileText,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import { Countries } from "@/components/countries-flags";
import { PlatformLink } from "@/components/platform-link";
import { PROJECT_COMPANY_ROLES } from "@/lib/constants";
import { type FetchProjectResult } from "@/lib/types";
import { useLanguage } from "@/components/language-context";
import { SectorsIconsTooltip } from "@/components/sector-icon";
import { extractValidUUID } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamicImport(() => import("@/components/map"), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-200 animate-pulse" />,
});

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [project, setProject] = useState<FetchProjectResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      console.log("Project ID from params:", params.id);
      const projectId = extractValidUUID(params, "id");

      if (!projectId) {
        setError("Invalid project ID format");
        return;
      }

      startTransition(async () => {
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      });
    }
  }, [params?.id]);

  if (error) {
    return (
      <Card className="border-destructive m-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Error Loading Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{error}</p>
          <Button asChild>
            <Link href="/platform/projects">Back to Projects</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return <div className="p-6">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-muted-foreground mt-2">
          The requested project could not be found or you do not have permission
          to view it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/platform/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/platform/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">
                {project.stage ? t(`projects.stages.${project.stage}`) : ""}
              </Badge>
              <Badge variant={project.status ? "default" : "destructive"}>
                {project.status ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Region
                  </label>
                  <p className="font-medium">
                    {project.country?.region
                      ? t(`common.regions.${project.country.region}`)
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Country
                  </label>
                  <Countries
                    countries={project.country ? [project.country.code] : []}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Sector
                  </label>
                  <div className="font-medium">
                    <SectorsIconsTooltip sectors={project.sectors} />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Technology
                  </label>
                  <p className="font-medium">
                    {project.technologies
                      ?.map((tech) => t(`common.technologies.${tech}`))
                      .join(", ") || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Sub-sector
                  </label>
                  <p className="font-medium">
                    {project.subSectors
                      ?.map((sub) => t(`common.subSectors.${sub}`))
                      .join(", ") || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Segment
                  </label>
                  <p className="font-medium">
                    {project.segments
                      ?.map((seg) => t(`common.segments.${seg}`))
                      .join(", ") || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Milestone
                  </label>
                  <p className="font-medium text-green-600">
                    {project.milestone ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    On-/Off-Grid
                  </label>
                  <p className="font-medium">
                    {`${project.onOffGrid ? "On" : "Off"}-grid`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    On-/OffShore
                  </label>
                  <p className="font-medium">
                    {`${project.onOffShore ? "On" : "Off"}shore`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Revenue Model (Years)
                  </label>
                  <p className="font-medium">
                    {`${project.revenueModel ?? "-"}`}
                    {project.revenueModelDuration && (
                      <span>({project.revenueModelDuration} Years)</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Co-located Storage
                  </label>
                  <p className="font-medium">
                    {project.colocatedStorage ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Co-located Storage Capacity (MW)
                  </label>
                  {project.colocatedStorage && (
                    <p className="font-medium">
                      {project.colocatedStorageCapacity}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contract Type
                  </label>
                  <p className="font-medium">
                    {project.contractType?.join(", ") ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Features
                  </label>
                  <p className="font-medium">{project.features}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Financing Strategy
                  </label>
                  {project.financingStrategy && (
                    <p className="font-medium">
                      {Object.entries(project.financingStrategy)
                        .map(([k, v]) => `${k} (${v}%)`)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
              {project.stage === "proposal" ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tender Objective
                    </label>
                    <p className="font-medium">{project.tenderObjective}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Evaluation Criteria
                    </label>
                    {project.evaluationCriteria && (
                      <p className="font-medium">
                        {Object.entries(project.evaluationCriteria)
                          .map(([k, v]) => `${k} (${v}%)`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Number of Bids Received
                    </label>
                    <p className="font-medium">{project.bidsReceived}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Winning Bid (USD/kWh)
                    </label>
                    <p className="font-medium">{project.winningBid}</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Transmission Infrastructure
                    </label>
                    <p className="font-medium">
                      {project.transmissionInfrastructureDetails}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      PPA Signed
                    </label>
                    <p className="font-medium">
                      {project.ppaSigned ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      EIA Approved
                    </label>
                    <p className="font-medium">
                      {project.eiaApproved ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Grid Connection
                    </label>
                    <p className="font-medium">
                      {project.gridConnectionApproved ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Parties */}
          <Card>
            <CardHeader>
              <CardTitle>Companies Involved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {PROJECT_COMPANY_ROLES.map((role) => {
                  const involvedCompanies = project.companies.filter(
                    (company) => role === company.role
                  );
                  if (involvedCompanies.length === 0) return null;
                  return (
                    <div key={role}>
                      <label className="text-sm font-medium text-gray-500">
                        {role}
                      </label>
                      <PlatformLink data={involvedCompanies} type="companies" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Latest News Section */}
          {project.deals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  Latest News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="border-l-4 border-akili-blue pl-4 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 leading-tight">
                            {deal.update}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {deal.type}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(deal.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.impacts && (
                <>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      SDG Impact
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {project.impacts}
                    </p>
                  </div>
                  <Separator />
                </>
              )}
              {project.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}
              {project.insights && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {project.insights}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Investment ($M)</p>
                  <p className="font-semibold">
                    {project.investmentCosts
                      ? `$${Number(project.investmentCosts).toLocaleString()}M`
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Capacity (MW)</p>
                  <p className="font-semibold">
                    {project.plantCapacity
                      ? `${Number(project.plantCapacity)} MW`
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.financialClosingDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Financial Closing
                  </label>
                  <p className="font-medium">
                    {project.financialClosingDate.toLocaleDateString()}
                  </p>
                </div>
              )}
              {project.constructionStart && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Construction Start
                  </label>
                  <p className="font-medium">
                    {project.constructionStart.toLocaleDateString()}
                  </p>
                </div>
              )}
              {project.operationalDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Operational Date
                  </label>
                  <p className="font-medium">
                    {project.operationalDate.toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Project Location</CardTitle>
            </CardHeader>
            <CardContent>
              {project.address && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Address: {project.address}</span>
                  </div>
                </div>
              )}
              <div className="h-48 bg-gray-100 rounded-lg">
                {project.location && (
                  <Map
                    locations={[
                      { name: project.name, position: project.location },
                    ]}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
