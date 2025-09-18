import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Countries } from "@/components/countries-flags";
import { type Project } from "@/lib/types";
import { PROJECT_COMPANY_ROLES } from "@/lib/constants";
import { PlatformLink } from "@/components/platform-link";
import { Separator } from "@/components/ui/separator";

export default async function ProjectDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  // Mock data - in real app, fetch based on params.id
  const project: Project = {
    id: params.id,
    name: "Gribo-Popoli hydroelectric power plant",
    country: {
      code: "CI",
      region: "west_africa",
    },
    capacity: 112,
    investment: 403,
    sectors: ["hydro"],
    technologies: ["large_hydro"],
    subSectors: ["utility_scale"],
    segments: ["generation", "transmission"],
    stage: "operational",
    status: true,
    milestone: "commissioning",
    companies: [
      {
        id: "1",
        name: "CI-ENERGIES",
        role: "sponsor",
      },
      {
        id: "2",
        name: "Sinohydro",
        role: "contractor",
      },
      {
        id: "3",
        name: "CI-ENERGIES",
        role: "operations_maintenance",
      },
      {
        id: "3",
        name: "Eximbank China",
        role: "lender",
      },
    ],
    onOffGrid: true,
    onOffShore: true,
    transmissionInfrastructure: "225 KV transmission line",
    contractType: [],
    features: "Greenfield (Public)",
    financingStrategy: {
      debt: 70,
      equity: 30,
    },
    constructionStart: new Date("2021-08-05"),
    operationalDate: new Date("2025-05-02"),
    ppaSigned: true,
    eiaApproved: true,
    gridConnection: true,
    bidSubmissionDeadline: new Date("2025-06-14"),
    tenderObjective: "design",
    evaluationCriteria: {
      technical: 80,
      financial: 20,
    },
    impact:
      "The project is expected to produce approximately 580 GWh of clean energy annually, supporting SDG 7.",
    insights:
      "The Gribo-Popoli hydropower plant, located on the Sassandra River, has reached full completion and is scheduled for official commissioning by the President of Côte d’Ivoire. With an installed capacity of 112 MW, the plant will supply 580 GWh of clean electricity annually, supporting the country’s strategic ambition to become a regional energy leader in West Africa.",
    description:
      "The government of Côte d'Ivoire commissions the 112 MW Gribo-Popoli hydroelectric power plant.",
    location: [-6.6222, 5.7666],
  };

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
              {/* <Badge variant="secondary">{project.sector}</Badge> */}
              <Badge variant="outline">{project.stage}</Badge>
              <Badge>{project.status}</Badge>
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
                  <p className="font-medium">{project.country?.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Country
                  </label>
                  <Countries countries={[project.country?.code]} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Sector
                  </label>
                  <p className="font-medium">{project.sectors.join(", ")}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Technology
                  </label>
                  <p className="font-medium">
                    {project.technologies.join(", ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Sub-sector
                  </label>
                  <p className="font-medium">{project.subSectors.join(", ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Segment
                  </label>
                  <p className="font-medium">{project.segments.join(", ")}</p>
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
                    {project.milestone}
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
                    {`${project.revenueModel?.model}`}
                    {project.revenueModel?.duration && (
                      <span>({project.revenueModel.duration} Years)</span>
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
                      {project.colocatedStorageCapacity}MW
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contract Type
                  </label>
                  <p className="font-medium">
                    {project.contractType.join(", ")}
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
                      {project.transmissionInfrastructure}
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
                      {project.gridConnection ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Parties */}
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {PROJECT_COMPANY_ROLES.map((role) => (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {role}
                    </label>
                    <PlatformLink
                      data={project.companies.filter(
                        (company) => role === company.role
                      )}
                      type="companies"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.impact && (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">SDG Impact</h4>
                  <p className="text-gray-700 leading-relaxed">{project.impact}</p>
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
                  <p className="font-semibold">${project.investment}M</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Capacity (MW)</p>
                  <p className="font-semibold">{project.capacity} MW</p>
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
              {project.stage === "proposal" ? (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Bid Submission Deadline
                  </label>
                  <p className="font-medium">
                    {project.bidSubmissionDeadline?.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Financial Closing
                  </label>
                  <p className="font-medium">
                    {project.financialClosing?.toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Construction Start
                </label>
                <p className="font-medium">
                  {project.constructionStart?.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Construction End
                </label>
                <p className="font-medium">
                  {project.constructionEnd?.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Operational Date
                </label>
                <p className="font-medium">
                  {project.operationalDate?.toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Project Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Address: {project.address}</span>
                </div>
              </div>
              <div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Map View</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
