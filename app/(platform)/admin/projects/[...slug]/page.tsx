"use client";

import React, {
  useState,
  useActionState,
  useEffect,
  use,
  useTransition,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  countryCode,
  geographicRegion,
  projectCompanyRole,
  projectContractType,
  projectSector,
  projectStage,
  projectStatus,
  projectSubSector,
  projectTenderObjective,
  revenueModel,
  segment,
  technology,
} from "@/lib/db/schema";
import {
  ActionState,
  CompanyClassification,
  Country,
  FetchProjectResult,
  ProjectCompanyRole,
  ProjectContractType,
  ProjectSector,
  ProjectStage,
  Region,
  Segment,
  ProjectSubSector,
  Technology,
  ProposalEvaluationCriteria,
  ProjectFinancingStrategy,
} from "@/lib/types";
import { upsertProject, getProjectById } from "@/app/actions/projects";
import { fetchCompanies } from "@/app/actions/actions";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { REGIONS_COUNTRIES, SECTORS_TECHNOLOGIES } from "@/lib/constants";
import { MultiSelect } from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/language-context";
import { DatePickerInput } from "@/components/ui/date-picker-input";

const initialState: ActionState = {
  success: false,
  message: "",
};

type Companies = Awaited<ReturnType<typeof fetchCompanies>>;

type Company = {
  id: string;
  name: string;
  categories: CompanyClassification[];
  role?: ProjectCompanyRole;
  percentageOwnership?: number;
  equityAmount?: number;
  details?: string;
};

const LocationPicker = dynamic(
  () => import("@/components/admin/location-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
  },
);

const reverseGeocode = async ([lat, lng]: [number, number]) => {
  const latLng = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    );
    const { display_name } = (await response.json()) as {
      display_name: string;
    };
    return display_name || latLng;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return latLng;
  }
};

export default function CreateEditProjectPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    upsertProject,
    initialState,
  );

  const { t } = useLanguage();

  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [companies, setCompanies] = useState<Companies>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const allCompanies = await fetchCompanies();
      setCompanies(
        allCompanies.toSorted((a, b) =>
          a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
        ),
      );
    });
  }, []);

  // State to hold the project data
  const [project, setProject] = useState<FetchProjectResult>(null);
  const [projectCompanies, setProjectCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStage, setSelectedStage] = useState<ProjectStage>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [country, setCountry] = useState<Country>();
  const [sectors, setSectors] = useState<ProjectSector[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [subSectors, setSubSectors] = useState<ProjectSubSector[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [contractTypes, setContractTypes] = useState<ProjectContractType[]>([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<[number, number]>();

  // Financial strategy state (JSON object)
  const [financingStrategy, setFinancingStrategy] =
    useState<ProjectFinancingStrategy | null>(null);

  // Evaluation criteria state (JSON object) - for proposals
  const [evaluationCriteria, setEvaluationCriteria] = useState<
    ProposalEvaluationCriteria | undefined
  >();

  // Fetch initial project data on component mount
  useEffect(() => {
    if (slug.length === 1 && slug[0] === "create") {
      setMode("create");
    } else if (slug.length === 2 && slug[1] === "edit") {
      setMode("edit");
      const projectId = slug[0];
      startTransition(async () => {
        const fetchedProject = await getProjectById(projectId);
        setProject(fetchedProject);

        if (fetchedProject) {
          setSelectedStage(fetchedProject.stage as ProjectStage);
          setCountry(fetchedProject.country?.code);
          setRegions(
            fetchedProject.country?.region
              ? [fetchedProject.country.region]
              : [],
          );
          setTechnologies(fetchedProject.technologies ?? []);
          setSectors(fetchedProject.sectors ?? []);
          setSubSectors(
            fetchedProject.subSectors?.filter((ss) => ss !== null) ?? [],
          );
          setSegments(
            fetchedProject.segments?.filter((ss) => ss !== null) ?? [],
          );
          setContractTypes(fetchedProject.contractType?.filter(Boolean) ?? []);
          setLocation(fetchedProject.location ?? undefined);
          setAddress(
            (fetchedProject.address ?? fetchedProject.location)
              ? await reverseGeocode(fetchedProject.location!)
              : "",
          );

          setProjectCompanies(
            fetchedProject.companies.map(
              ({ percentageOwnership, equityAmount, details, ...c }) => ({
                ...c,
                categories: [], // Would need to fetch this
                percentageOwnership: percentageOwnership ?? undefined,
                equityAmount: equityAmount ?? undefined,
                details: details ?? undefined,
              }),
            ) ?? [],
          );

          // Parse financing strategy
          setFinancingStrategy(fetchedProject.financingStrategy);

          // Parse evaluation criteria
          setEvaluationCriteria(fetchedProject.evaluationCriteria ?? undefined);
        }
      });
    } else {
      router.replace("/admin/projects");
    }
  }, [slug, router]);

  const addCompany = () => {
    const company = companies.find((c) => c.id === selectedCompany);
    if (company) {
      setProjectCompanies((prev) => [
        ...prev,
        {
          id: company.id,
          name: company.name,
          categories: company.classification ?? [],
        },
      ]);
      setSelectedCompany("");
    }
  };

  const removeEntry = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string | number,
    key: keyof T = "id" as any,
  ) => {
    setter((prev) => prev.filter((row) => row[key] !== id));
  };

  const updateEntry = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string | number,
    field: string,
    value: T[keyof T],
    key: keyof T = "id" as any,
  ) => {
    setter((prev) =>
      prev.map((row) => (row[key] === id ? { ...row, [field]: value } : row)),
    );
  };

  // Handle form submission success/error
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/admin/projects");
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state, router]);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basic: true,
    location: true,
    technical: true,
    companies: true,
    timeline: true,
    details: true,
    comments: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const onCountryChange = (selected: string) => {
    setCountry(selected as Country);
    const region = (Object.keys(REGIONS_COUNTRIES) as Region[]).find((r) =>
      REGIONS_COUNTRIES[r].includes(selected as Country),
    );
    setRegions(region ? [region] : []);
  };

  const onSectorsChange = (selected: Array<string | ProjectSector>) => {
    setSectors(selected as ProjectSector[]);
    setTechnologies((prev) =>
      prev.every((t) =>
        selected
          .flatMap((s) => SECTORS_TECHNOLOGIES[s as ProjectSector])
          .includes(t),
      )
        ? prev
        : [],
    );
  };

  const onTechnologiesChange = (selected: Array<string | Technology>) => {
    setTechnologies(selected as Technology[]);
    setSectors(
      (Object.keys(SECTORS_TECHNOLOGIES) as ProjectSector[]).filter((s) =>
        selected.some((t) =>
          (SECTORS_TECHNOLOGIES[s] ?? []).includes(t as Technology),
        ),
      ),
    );
  };

  if (pending) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project && mode === "edit") return null;

  return (
    <div key={slug.join("/")} className="space-y-6 pb-20">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "edit" ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === "edit"
              ? "Update project information"
              : "Add a new project to the database"}
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {!!project?.id && (
          <input type="hidden" name="projectId" value={project?.id} />
        )}

        {/* Basic Information */}
        <Card>
          <Collapsible
            open={expandedSections.basic}
            onOpenChange={() => toggleSection("basic")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </div>
                  {expandedSections.basic ? <ChevronDown /> : <ChevronRight />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={mode === "edit" ? project?.name : undefined}
                  />
                  {state.errors?.name && (
                    <p className="text-sm text-destructive">
                      {state.errors.name[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Project Stage *</Label>
                  <Select
                    name="stage"
                    required
                    value={selectedStage}
                    onValueChange={(value: ProjectStage) =>
                      setSelectedStage(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStage.enumValues.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {t(`projects.stages.${stage}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Project Status</Label>
                  <Select
                    name="status"
                    defaultValue={
                      mode === "edit"
                        ? (project?.status ?? undefined)
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatus.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`projects.statuses.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Region</Label>
                  <MultiSelect
                    selected={regions}
                    disabled
                    onChange={(selected) => setRegions(selected as Region[])}
                    options={geographicRegion.enumValues.map((region) => ({
                      label: t(`common.regions.${region}`),
                      value: region,
                    }))}
                    placeholder="Select region..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <SearchableSelect
                    options={countryCode.enumValues.map((c) => ({
                      label: t(`common.countries.${c}`),
                      value: c,
                    }))}
                    value={country ?? ""}
                    onChange={onCountryChange}
                    placeholder="Select country..."
                  />
                  <input type="hidden" name="country" value={country} />
                </div>

                <div className="space-y-2">
                  <input type="hidden" name="sectors" value={sectors} />
                  <Label>Sectors *</Label>
                  <MultiSelect
                    selected={sectors}
                    onChange={onSectorsChange}
                    options={projectSector.enumValues.map((s) => ({
                      label: t(`common.sectors.${s}`),
                      value: s,
                    }))}
                    placeholder="Select sectors..."
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="hidden"
                    name="technologies"
                    value={technologies}
                  />
                  <Label>Technologies</Label>
                  <MultiSelect
                    selected={technologies}
                    onChange={onTechnologiesChange}
                    options={technology.enumValues.map((tech) => ({
                      label: t(`common.technologies.${tech}`),
                      value: tech,
                    }))}
                    placeholder="Select technologies..."
                  />
                </div>

                <div className="space-y-2">
                  <input type="hidden" name="subSectors" value={subSectors} />
                  <Label>Sub-sectors</Label>
                  <MultiSelect
                    selected={subSectors}
                    onChange={(selected) =>
                      setSubSectors(selected as ProjectSubSector[])
                    }
                    options={projectSubSector.enumValues.map((ss) => ({
                      label: t(`common.subSectors.${ss}`),
                      value: ss,
                    }))}
                    placeholder="Select sub-sectors..."
                  />
                </div>

                <div className="space-y-2">
                  <input type="hidden" name="segments" value={segments} />
                  <Label>Segments</Label>
                  <MultiSelect
                    selected={segments}
                    onChange={(selected) => setSegments(selected as Segment[])}
                    options={segment.enumValues.map((s) => ({
                      label: t(`common.segments.${s}`),
                      value: s,
                    }))}
                    placeholder="Select segments..."
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Location */}
        <Card>
          <Collapsible
            open={expandedSections.location}
            onOpenChange={() => toggleSection("location")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Project Location
                  </div>
                  {expandedSections.location ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    id="address"
                    name="address"
                    type="hidden"
                    value={address}
                  />
                  <Input
                    id="location"
                    name="location"
                    type="hidden"
                    value={location ? location.toReversed().join(",") : ""}
                  />
                  <LocationPicker
                    value={
                      location ? { address, position: location } : undefined
                    }
                    onChange={(value) => {
                      if (value) {
                        setAddress(value.address);
                        setLocation(value.position);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Technical Details */}
        <Card>
          <Collapsible
            open={expandedSections.technical}
            onOpenChange={() => toggleSection("technical")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Technical Specifications
                  </div>
                  {expandedSections.technical ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="plantCapacity">Plant Capacity (MW)</Label>
                  <Input
                    type="number"
                    id="plantCapacity"
                    name="plantCapacity"
                    step={0.01}
                    min={0}
                    defaultValue={
                      mode === "edit"
                        ? (project?.plantCapacity ?? undefined)
                        : undefined
                    }
                    placeholder="e.g. 50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentCosts">Investment Costs ($M)</Label>
                  <Input
                    type="number"
                    id="investmentCosts"
                    name="investmentCosts"
                    step={0.01}
                    min={0}
                    defaultValue={
                      mode === "edit"
                        ? (project?.investmentCosts ?? undefined)
                        : undefined
                    }
                    placeholder="e.g. 150.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>On-/Off-Grid</Label>
                  <Select
                    name="onOffGrid"
                    defaultValue={
                      mode === "edit"
                        ? project?.onOffGrid?.toString()
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grid type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">On-grid</SelectItem>
                      <SelectItem value="false">Off-grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>On-/Offshore</Label>
                  <Select
                    name="onOffShore"
                    defaultValue={
                      mode === "edit"
                        ? project?.onOffShore?.toString()
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shore type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Onshore</SelectItem>
                      <SelectItem value="false">Offshore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Revenue Model</Label>
                  <Select
                    name="revenueModel"
                    defaultValue={
                      mode === "edit"
                        ? (project?.revenueModel ?? undefined)
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue model..." />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueModel.enumValues.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenueModelDuration">
                    Revenue Model Duration (Years)
                  </Label>
                  <Input
                    type="number"
                    id="revenueModelDuration"
                    name="revenueModelDuration"
                    defaultValue={
                      mode === "edit"
                        ? (project?.revenueModelDuration ?? undefined)
                        : undefined
                    }
                    placeholder="e.g. 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Co-located Storage</Label>
                  <Select
                    name="colocatedStorage"
                    defaultValue={
                      mode === "edit"
                        ? project?.colocatedStorage?.toString()
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colocatedStorageCapacity">
                    Co-located Storage Capacity (MWh)
                  </Label>
                  <Input
                    id="colocatedStorageCapacity"
                    name="colocatedStorageCapacity"
                    defaultValue={
                      mode === "edit"
                        ? (project?.colocatedStorageCapacity ?? undefined)
                        : undefined
                    }
                    placeholder="e.g. 100 MWh"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contract Type</Label>
                  <MultiSelect
                    selected={contractTypes}
                    onChange={(selected) =>
                      setContractTypes(selected as ProjectContractType[])
                    }
                    options={projectContractType.enumValues.map((ct) => ({
                      label: t(`projects.contractTypes.${ct}`),
                      value: ct,
                    }))}
                    placeholder="Select contract types..."
                  />
                  <input
                    type="hidden"
                    name="contractType"
                    value={contractTypes}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milestone">Milestone</Label>
                  <Input
                    id="milestone"
                    name="milestone"
                    defaultValue={
                      mode === "edit"
                        ? (project?.milestone ?? undefined)
                        : undefined
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Funding Secured</Label>
                  <Select
                    name="fundingSecured"
                    defaultValue={
                      mode === "edit"
                        ? project?.fundingSecured?.toString()
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features</Label>
                  <Input
                    id="features"
                    name="features"
                    defaultValue={
                      mode === "edit"
                        ? (project?.features ?? undefined)
                        : undefined
                    }
                    placeholder="e.g. Greenfield (PPP)"
                  />
                </div>

                <div className="border rounded-lg p-4 bg-white col-span-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Financing Strategy (%)
                      </h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="debt" className="text-sm">
                        Debt
                      </Label>
                      <Input
                        type="number"
                        id="debt"
                        value={financingStrategy?.debt}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          return setFinancingStrategy((prev) => ({
                            ...prev,
                            debt: isNaN(val) ? undefined : val,
                          }));
                        }}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equity" className="text-sm">
                        Equity
                      </Label>
                      <Input
                        type="number"
                        id="equity"
                        value={financingStrategy?.equity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          return setFinancingStrategy((prev) => ({
                            ...prev,
                            equity: isNaN(val) ? undefined : val,
                          }));
                        }}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="grants" className="text-sm">
                        Grants
                      </Label>
                      <Input
                        type="number"
                        id="grants"
                        value={financingStrategy?.grants}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          return setFinancingStrategy((prev) => ({
                            ...prev,
                            grants: isNaN(val) ? undefined : val,
                          }));
                        }}
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name="financingStrategy"
                    value={
                      financingStrategy
                        ? JSON.stringify(
                            Object.fromEntries(
                              Object.entries(financingStrategy).filter(
                                ([_, v]) => !!v,
                              ),
                            ),
                          )
                        : undefined
                    }
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Companies */}
        <Card>
          <Collapsible
            open={expandedSections.companies}
            onOpenChange={() => toggleSection("companies")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Companies Involved
                  </div>
                  {expandedSections.companies ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-4 space-y-4">
                {projectCompanies.map(
                  ({
                    id,
                    name,
                    categories,
                    role,
                    percentageOwnership,
                    equityAmount,
                    details,
                  }) => (
                    <div key={id} className="border rounded-lg p-4 bg-gray-50">
                      <input type="hidden" name="companyId" value={id} />
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {categories.join(", ")}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEntry(setProjectCompanies, id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Role</Label>
                          <input
                            type="hidden"
                            name="companyRole"
                            value={role}
                          />
                          <SearchableSelect
                            options={projectCompanyRole.enumValues.map((r) => ({
                              label: t(`companies.roles.projects.${r}`),
                              value: r,
                            }))}
                            value={role ?? ""}
                            onChange={(value) =>
                              updateEntry(
                                setProjectCompanies,
                                id,
                                "role",
                                value,
                              )
                            }
                            placeholder="Select role..."
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`company-${id}-ownership`}
                            className="text-sm"
                          >
                            Percentage Ownership (%)
                          </Label>
                          <Input
                            id={`company-${id}-ownership`}
                            name="companyPercentageOwnership"
                            type="number"
                            step={0.1}
                            min={0}
                            max={100}
                            value={percentageOwnership ?? ""}
                            onChange={({ target: { value } }) =>
                              updateEntry(
                                setProjectCompanies,
                                id,
                                "percentageOwnership",
                                parseFloat(value),
                              )
                            }
                            placeholder="e.g. 25.5"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`company-${id}-equity`}
                            className="text-sm"
                          >
                            Equity Amount ($M)
                          </Label>
                          <Input
                            id={`company-${id}-equity`}
                            name="companyEquityAmount"
                            type="number"
                            step={0.01}
                            min={0}
                            value={equityAmount ?? ""}
                            onChange={({ target: { value } }) =>
                              updateEntry(
                                setProjectCompanies,
                                id,
                                "equityAmount",
                                parseFloat(value),
                              )
                            }
                            placeholder="e.g. 10.5"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`company-${id}-details`}
                            className="text-sm"
                          >
                            Details
                          </Label>
                          <Input
                            id={`company-${id}-details`}
                            name="companyDetails"
                            value={details ?? ""}
                            onChange={({ target: { value } }) =>
                              updateEntry(
                                setProjectCompanies,
                                id,
                                "details",
                                value,
                              )
                            }
                            placeholder="Additional details..."
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-sm font-medium mb-2 block">
                    Add Company
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={companies
                          .filter(
                            (c) =>
                              !projectCompanies.some((pc) => pc.id === c.id),
                          )
                          .map((c) => ({ value: c.id, label: c.name }))}
                        value={selectedCompany}
                        onChange={setSelectedCompany}
                        searchPlaceholder="Search companies..."
                        emptyText="No companies found."
                        placeholder="Select a company to add..."
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addCompany}
                      disabled={!selectedCompany}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Company
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Timeline */}
        <Card>
          <Collapsible
            open={expandedSections.timeline}
            onOpenChange={() => toggleSection("timeline")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Timeline
                  </div>
                  {expandedSections.timeline ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {selectedStage !== "proposal" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="financialClosingDate">
                        Financial Closing Date
                      </Label>
                      <DatePickerInput
                        id="financialClosingDate"
                        value={
                          mode === "edit"
                            ? (project?.financialClosingDate ?? undefined)
                            : undefined
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="constructionStart">
                        Construction Start
                      </Label>
                      <DatePickerInput
                        id="constructionStart"
                        value={
                          mode === "edit"
                            ? (project?.constructionStart ?? undefined)
                            : undefined
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="operationalDate">Operational Date</Label>
                      <DatePickerInput
                        id="operationalDate"
                        value={
                          mode === "edit"
                            ? (project?.operationalDate ?? undefined)
                            : undefined
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <DatePickerInput
                        id="endDate"
                        value={
                          mode === "edit"
                            ? (project?.endDate ?? undefined)
                            : undefined
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="bidSubmissionDeadline">
                      Bid Submission Deadline
                    </Label>
                    <DatePickerInput
                      id="bidSubmissionDeadline"
                      value={
                        mode === "edit"
                          ? (project?.bidSubmissionDeadline ?? undefined)
                          : undefined
                      }
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Project Details / Proposal Details */}
        <Card>
          <Collapsible
            open={expandedSections.details}
            onOpenChange={() => toggleSection("details")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {selectedStage === "proposal"
                      ? "Proposal Details"
                      : "Project Details"}
                  </div>
                  {expandedSections.details ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {selectedStage === "proposal" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Tender Objective</Label>
                      <Select
                        name="tenderObjective"
                        defaultValue={
                          mode === "edit"
                            ? (project?.tenderObjective ?? undefined)
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tender objective..." />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTenderObjective.enumValues.map((obj) => (
                            <SelectItem key={obj} value={obj}>
                              {t(`projects.tenderObjectives.${obj}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bidsReceived">Bids Received</Label>
                      <Input
                        type="number"
                        id="bidsReceived"
                        name="bidsReceived"
                        defaultValue={
                          mode === "edit"
                            ? (project?.bidsReceived ?? undefined)
                            : undefined
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="winningBid">Winning Bid (USD/kWh)</Label>
                      <Input
                        type="number"
                        step={0.001}
                        id="winningBid"
                        name="winningBid"
                        defaultValue={
                          mode === "edit"
                            ? (project?.winningBid ?? undefined)
                            : undefined
                        }
                      />
                    </div>
                    <div className="border rounded-lg p-4 bg-white col-span-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            Evaluation Criteria (%)
                          </h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="technical" className="text-sm">
                            Technical
                          </Label>
                          <Input
                            type="number"
                            id="technical"
                            value={evaluationCriteria?.technical}
                            onChange={(e) => {
                              const val = Number(e.target.value);

                              return setEvaluationCriteria((prev) => ({
                                ...prev,
                                technical: isNaN(val) ? undefined : val,
                              }));
                            }}
                            placeholder="50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="financial" className="text-sm">
                            Financial
                          </Label>
                          <Input
                            type="number"
                            id="financial"
                            value={evaluationCriteria?.financial}
                            onChange={(e) =>
                              setEvaluationCriteria((prev) => ({
                                ...prev,
                                financial: isNaN(Number(e.target.value))
                                  ? undefined
                                  : Number(e.target.value),
                              }))
                            }
                            placeholder="50"
                          />
                        </div>
                      </div>
                      <input
                        type="hidden"
                        name="evaluationCriteria"
                        value={evaluationCriteria ? JSON.stringify(
                          Object.fromEntries(
                            Object.entries(evaluationCriteria).filter(
                              ([_, v]) => !!v,
                            ),
                          ),
                        ) : undefined}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="transmissionInfrastructureDetails">
                        Transmission Infrastructure Details
                      </Label>
                      <Textarea
                        id="transmissionInfrastructureDetails"
                        name="transmissionInfrastructureDetails"
                        rows={3}
                        defaultValue={
                          mode === "edit"
                            ? (project?.transmissionInfrastructureDetails ??
                              undefined)
                            : undefined
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PPA Signed</Label>
                      <Select
                        name="ppaSigned"
                        defaultValue={
                          mode === "edit"
                            ? project?.ppaSigned?.toString()
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>EIA Approved</Label>
                      <Select
                        name="eiaApproved"
                        defaultValue={
                          mode === "edit"
                            ? project?.eiaApproved?.toString()
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Grid Connection Approved</Label>
                      <Select
                        name="gridConnectionApproved"
                        defaultValue={
                          mode === "edit"
                            ? project?.gridConnectionApproved?.toString()
                            : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Comments */}
        <Card>
          <Collapsible
            open={expandedSections.comments}
            onOpenChange={() => toggleSection("comments")}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Project Comments
                  </div>
                  {expandedSections.comments ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Summary</Label>
                  <Textarea
                    placeholder="Project summary"
                    name="description"
                    id="description"
                    rows={5}
                    defaultValue={
                      mode === "edit"
                        ? (project?.description ?? undefined)
                        : undefined
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insights">Insights</Label>
                  <Textarea
                    placeholder="Insights and comments"
                    name="insights"
                    id="insights"
                    rows={5}
                    defaultValue={
                      mode === "edit"
                        ? (project?.insights ?? undefined)
                        : undefined
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impacts">SDG Impact</Label>
                  <Textarea
                    placeholder="Sustainable Development Goals impact"
                    name="impacts"
                    id="impacts"
                    rows={5}
                    defaultValue={
                      mode === "edit"
                        ? (project?.impacts ?? undefined)
                        : undefined
                    }
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <div className="sticky bottom-4 z-10 flex justify-end gap-4 bg-background/80 backdrop-blur p-4 rounded-lg border shadow-sm">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
