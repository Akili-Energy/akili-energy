"use client";

import React, {
  useState,
  useActionState,
  useEffect,
  use,
  useTransition,
  useMemo,
} from "react";
import { notFound, useRouter } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Handshake,
  Landmark,
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImageUpload from "@/components/admin/image-upload";
import WYSIWYGRichTextEditor from "@/components/admin/wysiwyg-rich-text-editor";
import {
  contentCategory,
  contentStatus,
  countryCode,
  dealCompanyRole,
  dealFinancingType,
  dealSubtype,
  dealType,
  financingInvestorType,
  financingObjective,
  financingSubtype,
  geographicRegion,
  maSpecifics,
  maStructure,
  projectSubSector,
  revenueModel,
  segment,
  technology,
} from "@/lib/db/schema";
import TagsInput from "@/components/admin/tags-input";
import {
  ActionState,
  CompanyClassification,
  Country,
  DealCompanyRole,
  DealFinancingType,
  DealSubtype,
  DealType,
  FetchDealResult,
  FinancingInvestorType,
  FinancingSubtype,
  MASpecifics,
  ProjectStage,
  Region,
  Sector,
  Segment,
  SubSector,
  Technology,
} from "@/lib/types";
import { upsertDeal, getDealById } from "@/app/actions/deals";
import { fetchCompanies, fetchProjects } from "@/app/actions/actions";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DEAL_TYPES_SUBTYPES,
  REGIONS_COUNTRIES,
  SECTORS,
  SECTORS_TECHNOLOGIES,
  SUB_SECTORS,
} from "@/lib/constants";
import { MultiSelect } from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/language-context";

const initialState: ActionState = {
  success: false,
  message: "",
};

type Projects = Awaited<ReturnType<typeof fetchProjects>>;
type Companies = Awaited<ReturnType<typeof fetchCompanies>>;

// Define simpler state types for client-side UI management
type Asset = {
  id: string;
  name: string;
  capacity: number;
  lifecycle: ProjectStage;
  country?: Country | null;
  maturity?: number;
  equity?: number;
};
type Company = {
  id: string;
  name: string;
  categories: CompanyClassification[];
  role?: DealCompanyRole;
  commitment?: number;
  investorType?: FinancingInvestorType;
  equityTransactedPercentage?: number;
  details?: string;
};

interface Financial {
  year: number;
  ebitda: number;
  enterpriseValue?: number;
  debt?: number;
  revenue?: number;
  cash?: number;
}

interface DealDetail {
  maSpecifics?: MASpecifics[];
  maFinancingStrategy?: DealFinancingType[];
  financingType?: DealFinancingType[];
  financingSubtype?: FinancingSubtype[];
}

export default function CreateEditDealPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    upsertDeal,
    initialState
  );

  const { t } = useLanguage();

  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [projects, setProjects] = useState<Projects>([]);
  const [companies, setCompanies] = useState<Companies>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [allProjects, allCompanies] = await Promise.all([
        fetchProjects(),
        fetchCompanies(),
      ]);
      setProjects(
        allProjects.toSorted((a, b) =>
          a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        )
      );
      setCompanies(
        allCompanies.toSorted((a, b) =>
          a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        )
      );
    });
  }, []);

  // State to hold the deal data
  const [deal, setDeal] = useState<FetchDealResult>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dealCompanies, setDealCompanies] = useState<Company[]>([]);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDealType, setSelectedDealType] = useState<DealType>();
  const [selectedDealSubtype, setSelectedDealSubtype] = useState<DealSubtype>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [subSectors, setSubSectors] = useState<SubSector[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [dealDetails, setDealDetails] = useState<DealDetail>({});

  // Fetch initial deal data on component mount
  useEffect(() => {
    if (slug.length === 1 && slug[0] === "create") {
      setMode("create");
    } else if (slug.length === 2 && slug[1] === "edit") {
      setMode("edit");
      const dealId = slug[0];
      startTransition(async () => {
        const fetchedDeal = await getDealById(dealId);

        if (
          fetchedDeal &&
          fetchedDeal.type === "project_update" &&
          fetchedDeal.assets?.length
        ) {
          router.push(`/admin/projects/${fetchedDeal.assets[0].id}/edit`);
        }

        setDeal(fetchedDeal);
        setSelectedDealType(fetchedDeal?.type);
        setSelectedDealSubtype(fetchedDeal?.subtype ?? undefined);
        setRegions(fetchedDeal?.regions ?? []);
        setCountries(fetchedDeal?.countries ?? []);
        setTechnologies(fetchedDeal?.technologies ?? []);
        setSectors(fetchedDeal?.sectors ?? []);
        setSubSectors(
          fetchedDeal?.subSectors.filter((ss) => ss !== null) ?? []
        );
        setSegments(fetchedDeal?.segments.filter((ss) => ss !== null) ?? []);
        setAssets(
          fetchedDeal?.assets.map(
            ({ maturity, equityTransactedPercentage, ...a }) => ({
              ...a,
              equity: equityTransactedPercentage ?? undefined,
              maturity: maturity ?? undefined,
            })
          ) ?? []
        );
        setDealCompanies(
          fetchedDeal?.companies.map(
            ({ classification, commitment, investorType, ...c }) => ({
              ...c,
              categories: classification ?? [],
              commitment: commitment ?? undefined,
              investorType: investorType ?? undefined,
            })
          ) ?? []
        );
        setDealDetails({
          maSpecifics: fetchedDeal?.mergerAcquisition?.specifics ?? [],
          maFinancingStrategy:
            fetchedDeal?.mergerAcquisition?.financingStrategy ?? [],
          financingType: fetchedDeal?.financing?.financingType ?? [],
          financingSubtype: fetchedDeal?.financing?.financingSubtype ?? [],
        });
      });
    } else {
      router.replace("/admin/deals");
    }
  }, [slug, router]);

  const addAsset = () => {
    const { id, name, plantCapacity, stage, country } =
      projects.find((p) => p.id === selectedProject) ?? {};
    if (id && name) {
      setAssets((prev) => [
        ...prev,
        {
          id,
          name,
          capacity: plantCapacity!,
          lifecycle: stage!,
          country,
        } as Asset,
      ]);
      setSelectedProject("");
    }
  };

  const addCompany = () => {
    const company = companies.find((c) => c.id === selectedCompany);
    if (company) {
      setDealCompanies((prev) => [
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

  const addFinancial = () =>
    setFinancials((prev) => [
      ...prev,
      {
        year:
          Math.min(...prev.map((f) => f.year), new Date().getFullYear() + 1) -
          1,
        ebitda: 0,
      },
    ]);

  const removeEntry = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string | number,
    key: keyof T = "id" as any
  ) => {
    setter((prev) => prev.filter((row) => row[key] !== id));
  };

  const updateEntry = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string | number,
    field: string,
    value: T[keyof T],
    key: keyof T = "id" as any
  ) => {
    setter((prev) =>
      prev.map((row) => (row[key] === id ? { ...row, [field]: value } : row))
    );
  };

  // Handle form submission success/error
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/admin/deals");
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state, router]);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    description: true,
    assets: true,
    companies: true,
    financials: true,
    timeline: true,
    comments: true,
    details: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const onCountriesChange = (selected: Array<string | Country>) => {
    setCountries(selected as Country[]);
    setRegions(
      (Object.keys(REGIONS_COUNTRIES) as Region[]).filter((region) =>
        selected.some((c) => REGIONS_COUNTRIES[region].includes(c as Country))
      )
    );
  };

  const onSectorsChange = (selected: Array<string | Sector>) => {
    setSectors(selected as Sector[]);
    setTechnologies((prev) =>
      prev.every((t) =>
        selected.flatMap((s) => SECTORS_TECHNOLOGIES[s as Sector]).includes(t)
      )
        ? prev
        : []
    );
  };

  const onTechnologiesChange = (selected: Array<string | Technology>) => {
    setTechnologies(selected as Technology[]);
    setSectors(
      (Object.keys(SECTORS_TECHNOLOGIES) as Sector[]).filter((s) =>
        selected.some((t) =>
          (SECTORS_TECHNOLOGIES[s] ?? []).includes(t as Technology)
        )
      )
    );
  };

  const SelectDealSubtype = useMemo(() => {
    const label =
      selectedDealType === "power_purchase_agreement"
        ? "PPA Category"
        : selectedDealType
        ? `${t(`deals.types.${selectedDealType}`)} Type`
        : "Deal Subtype";
    return (
      <div className="space-y-2">
        <Label>{label} *</Label>
        <Select
          name="subtype"
          value={selectedDealSubtype}
          required
          onValueChange={(value) =>
            setSelectedDealSubtype(value as DealSubtype)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${label}...`} />
          </SelectTrigger>
          <SelectContent>
            {(selectedDealType
              ? DEAL_TYPES_SUBTYPES[selectedDealType]
              : dealSubtype.enumValues
            ).map((subtype) => (
              <SelectItem key={subtype} value={subtype}>
                {t(`deals.subtypes.${subtype}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }, [selectedDealType]);

  const CompletedDatedInput = useMemo(() => {
    const label =
      selectedDealType === "power_purchase_agreement"
        ? "assetOperationalDate"
        : "completionDate";
    return (
      <div className="space-y-2">
        <Label htmlFor={label}>
          {selectedDealType === "power_purchase_agreement"
            ? "Asset Operational Date"
            : "Completion Date"}
        </Label>
        <Input
          type="date"
          name={label}
          id={label}
          defaultValue={
            mode === "edit"
              ? (selectedDealType === "power_purchase_agreement"
                  ? deal?.powerPurchaseAgreement?.assetOperationalDate
                  : deal?.completionDate
                )?.toLocaleDateString() ?? undefined
              : undefined
          }
        />
      </div>
    );
  }, [
    selectedDealType,
    deal?.completionDate,
    deal?.powerPurchaseAgreement?.assetOperationalDate,
  ]);

  if (pending) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!deal && mode === "edit") return null; // Or a "Not Found" component

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/deals">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deals
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Deal</h1>
          <p className="text-gray-600 mt-2">
            Add a new transaction or deal to the database
          </p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <form action={formAction} className="space-y-6">
          {!!deal?.id && <input type="hidden" name="dealId" value={deal?.id} />}
          <Card>
            <Collapsible
              open={expandedSections.description}
              onOpenChange={() => toggleSection("description")}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Deal Description
                    </div>
                    {expandedSections.description ? (
                      <ChevronDown />
                    ) : (
                      <ChevronRight />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="update">Deal Update *</Label>
                    <Input
                      id="update"
                      name="update"
                      required
                      defaultValue={mode === "edit" ? deal?.update : undefined}
                    />
                    {state.errors?.update && (
                      <p className="text-sm text-destructive">
                        {state.errors.update[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Deal Type *</Label>
                    <Select
                      name="type"
                      required
                      value={selectedDealType}
                      onValueChange={(value: DealType) => {
                        setSelectedDealType(value);
                        setSelectedDealSubtype((prev) =>
                          !DEAL_TYPES_SUBTYPES[value].includes(
                            prev as DealSubtype
                          )
                            ? prev
                            : undefined
                        );
                        setDealDetails({});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dealType.enumValues
                          .filter((type) => type !== "project_update")
                          .map((type) => (
                            <SelectItem key={type} value={type}>
                              {t(`deals.types.${type}`)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {state.errors?.type && (
                      <p className="text-sm text-destructive">
                        {state.errors.type[0]}
                      </p>
                    )}
                  </div>
                  {SelectDealSubtype}
                  <div className="space-y-2">
                    <Label htmlFor="dealDate">Deal Date</Label>
                    <Input
                      type="date"
                      name="dealDate"
                      id="dealDate"
                      required
                      defaultValue={
                        mode === "edit"
                          ? deal?.date?.toLocaleDateString() ?? undefined
                          : undefined
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      Amount (Millions USD){" "}
                      {selectedDealType === "financing" && "*"}
                    </Label>
                    <Input
                      type="number"
                      id="amount"
                      name="amount"
                      defaultValue={
                        mode === "edit" ? deal?.amount ?? undefined : undefined
                      }
                      placeholder="e.g. 150.5"
                      step={0.01}
                      required={selectedDealType === "financing"}
                    />
                    {state.errors?.amount && (
                      <p className="text-sm text-destructive">
                        {state.errors.amount[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Regions</Label>
                    <MultiSelect
                      selected={regions}
                      disabled
                      onChange={(selected) => {
                        setRegions(selected as Region[]);
                        setCountries((prev) =>
                          countries.every((c) =>
                            selected
                              .flatMap(
                                (region) => REGIONS_COUNTRIES[region as Region]
                              )
                              .includes(c)
                          )
                            ? prev
                            : []
                        );
                      }}
                      options={geographicRegion.enumValues.map((region) => ({
                        label: t(`common.regions.${region}`),
                        value: region,
                      }))}
                      placeholder="Select regions..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Countries</Label>
                    <MultiSelect
                      selected={countries}
                      onChange={onCountriesChange}
                      options={countryCode.enumValues.map((c) => ({
                        label: t(`common.countries.${c}`),
                        value: c,
                      }))}
                      placeholder="Select countries..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sectors</Label>
                    <MultiSelect
                      selected={sectors}
                      onChange={onSectorsChange}
                      options={SECTORS.map((s) => ({
                        label: t(`common.sectors.${s}`),
                        value: s,
                      }))}
                      placeholder="Select sectors..."
                    />
                  </div>
                  <div className="space-y-2">
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
                    <Label>Sub-sectors</Label>
                    <MultiSelect
                      selected={subSectors}
                      onChange={(selected) =>
                        setSubSectors(selected as SubSector[])
                      }
                      options={SUB_SECTORS.map((ss) => ({
                        label: t(`common.subSectors.${ss}`),
                        value: ss,
                      }))}
                      placeholder="Select sub-sectors..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Segments</Label>
                    <MultiSelect
                      selected={segments}
                      onChange={(selected) =>
                        setSegments(selected as Segment[])
                      }
                      options={segment.enumValues.map((s) => ({
                        label: t(`common.segments.${s}`),
                        value: s,
                      }))}
                      placeholder="Select segments..."
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="pressReleaseUrl">Press Release URL</Label>
                    <Input
                      type="url"
                      placeholder="https://example.com/blog/article-slug"
                      name="pressReleaseUrl"
                      id="pressReleaseUrl"
                      defaultValue={
                        mode === "edit"
                          ? deal?.pressReleaseUrl ?? undefined
                          : undefined
                      }
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card>
            <Collapsible
              open={expandedSections.assets}
              onOpenChange={() => toggleSection("assets")}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Assets
                    </div>
                    {expandedSections.assets ? (
                      <ChevronDown />
                    ) : (
                      <ChevronRight />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-4 space-y-4">
                  {assets.map(
                    ({
                      id,
                      name,
                      country,
                      capacity,
                      lifecycle,
                      maturity,
                      equity,
                    }) => (
                      <div key={id} className="border rounded-lg p-4 bg-white">
                        <input type="hidden" name="assetId" value={id} />
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {name}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {[
                                !!capacity && `${capacity}MW`,
                                lifecycle,
                                country,
                              ]
                                .filter(Boolean)
                                .join(" • ")}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry(setAssets, id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor={`asset-${id}-maturity`}
                              className="text-sm"
                            >
                              Maturity (Years)
                            </Label>
                            <Input
                              id={`asset-${id}-maturity`}
                              type="number"
                              min=""
                              name="assetMaturity"
                              value={maturity}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setAssets,
                                  id,
                                  "maturity",
                                  parseInt(value)
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`asset-${id}-equity`}
                              className="text-sm"
                            >
                              Equity Transacted (%)
                            </Label>
                            <Input
                              id={`equity-${id}-equity`}
                              type="number"
                              step={0.1}
                              min=""
                              max={100}
                              value={equity}
                              name="assetEquity"
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setAssets,
                                  id,
                                  "equityTransacted",
                                  parseFloat(value)
                                )
                              }
                              placeholder="e.g., 25.5"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <Label className="text-sm font-medium mb-2 block">
                      Add Project to Assets
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          options={projects
                            .filter((p) => !assets.some((a) => a.id === p.id))
                            .map((p) => ({ value: p.id, label: p.name }))}
                          value={selectedProject}
                          onChange={setSelectedProject}
                          placeholder="Select a project to add..."
                          searchPlaceholder="Search projects..."
                          emptyText="No projects found."
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addAsset}
                        disabled={!selectedProject}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Asset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card>
            <Collapsible
              open={expandedSections.companies}
              onOpenChange={() => toggleSection("companies")}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Companies
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
                  {dealCompanies.map(
                    ({
                      id,
                      name,
                      categories,
                      role,
                      commitment,
                      investorType,
                    }) => (
                      <div key={id} className="border rounded-lg p-4 bg-white">
                        <input type="hidden" name="companyId" value={id} />
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
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
                            onClick={() => removeEntry(setDealCompanies, id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm">Role</Label>
                            <input
                              type="hidden"
                              name="companyRole"
                              value={role}
                            />
                            <SearchableSelect
                              options={dealCompanyRole.enumValues.map((r) => ({
                                label: t(`companies.roles.deals.${r}`),
                                value: r,
                              }))}
                              value={role ?? ""}
                              onChange={(value) =>
                                updateEntry(setDealCompanies, id, "role", value)
                              }
                              placeholder="Select role..."
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`company-${id}-commitment`}
                              className="text-sm"
                            >
                              Commitment ($M)
                            </Label>
                            <Input
                              id={`company-${id}-commitment`}
                              name="companyCommitment"
                              type="number"
                              step={0.1}
                              min=""
                              value={commitment}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setDealCompanies,
                                  id,
                                  "commitment",
                                  value
                                )
                              }
                              placeholder="e.g., 150"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Investor Type</Label>
                            <input
                              type="hidden"
                              name="companyInvestorType"
                              value={investorType}
                            />
                            <SearchableSelect
                              options={financingInvestorType.enumValues.map(
                                (it) => ({ label: it, value: it })
                              )}
                              value={investorType ?? ""}
                              onChange={(value) =>
                                updateEntry(
                                  setDealCompanies,
                                  id,
                                  "investorType",
                                  value
                                )
                              }
                              placeholder="Select investor type..."
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <Label className="text-sm font-medium mb-2 block">
                      Add Company to Deal
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          options={companies
                            .filter(
                              (c) => !dealCompanies.some((dc) => dc.id === c.id)
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

          <Card>
            <Collapsible
              open={expandedSections.financials}
              onOpenChange={() => toggleSection("financials")}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-5 w-5" />
                      Deal Financials
                    </div>
                    {expandedSections.financials ? (
                      <ChevronDown />
                    ) : (
                      <ChevronRight />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-4 space-y-4">
                  {financials.map(
                    ({
                      year,
                      ebitda,
                      enterpriseValue,
                      debt,
                      cash,
                      revenue,
                    }) => (
                      <div
                        key={year}
                        className="border p-4 rounded-md space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEntry(setFinancials, year)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label
                              htmlFor={`financial-${year}-year`}
                              className="text-sm"
                            >
                              Year
                            </Label>
                            <Input
                              id={`financial-${year}-year`}
                              name="financialYear"
                              type="number"
                              min={2020}
                              max={new Date().getFullYear()}
                              value={year}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setFinancials,
                                  year,
                                  "year",
                                  parseInt(value),
                                  "year"
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`financial-${year}-enterpriseValue`}
                              className="text-sm"
                            >
                              Enterprise Value ($M)
                            </Label>
                            <Input
                              id={`financial-${year}-enterpriseValue`}
                              name="financialEnterpriseValue"
                              type="number"
                              step={0.1}
                              min=""
                              value={enterpriseValue}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setFinancials,
                                  year,
                                  "enterpriseValue",
                                  parseFloat(value),
                                  "year"
                                )
                              }
                              placeholder="e.g., 500"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`financial-${year}-ebitda`}
                              className="text-sm"
                            >
                              EBITDA ($M)
                            </Label>
                            <Input
                              id={`financial-${year}-ebitda`}
                              name="financialEbitda"
                              type="number"
                              step={0.1}
                              min={0.01}
                              value={ebitda}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setFinancials,
                                  year,
                                  "ebitda",
                                  parseFloat(value),
                                  "year"
                                )
                              }
                              placeholder="e.g., 75"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`financial-${year}-debt`}
                              className="text-sm"
                            >
                              Debt ($M)
                            </Label>
                            <Input
                              id={`financial-${year}-debt`}
                              name="financialDebt"
                              type="number"
                              step={0.1}
                              min=""
                              value={debt}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setFinancials,
                                  year,
                                  "debt",
                                  parseFloat(value),
                                  "year"
                                )
                              }
                              placeholder="e.g., 200"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`financial-${year}-cash`}
                              className="text-sm"
                            >
                              Cash ($M)
                            </Label>
                            <Input
                              id={`financial-${year}-cash`}
                              name="financialCash"
                              type="number"
                              step={0.1}
                              min=""
                              value={cash}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setFinancials,
                                  year,
                                  "cash",
                                  parseFloat(value),
                                  "year"
                                )
                              }
                              placeholder="e.g., 200"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`financial-${year}-revenue`}
                              className="text-sm"
                            >
                              Revenue ($M)
                            </Label>
                            <Input
                              id={`financial-${year}-revenue`}
                              name="financialRevenue"
                              type="number"
                              step={0.1}
                              value={revenue}
                              onChange={({ target: { value } }) =>
                                updateEntry(
                                  setFinancials,
                                  year,
                                  "revenue",
                                  parseFloat(value),
                                  "year"
                                )
                              }
                              placeholder="e.g., 200"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <Button type="button" onClick={addFinancial}>
                    <Plus className="mr-2 h-4 w-4" /> Add Financial Year
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

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
                      Deal Timeline
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
                  <div className="space-y-2">
                    <Label htmlFor="announcementDate">Announcement Date</Label>
                    <Input
                      type="date"
                      name="announcementDate"
                      id="announcementDate"
                      defaultValue={
                        mode === "edit"
                          ? deal?.announcementDate?.toLocaleDateString() ??
                            undefined
                          : undefined
                      }
                    />
                  </div>
                  {CompletedDatedInput}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

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
                      Deal Comments
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
                      placeholder="Summary"
                      name="description"
                      id="description"
                      rows={5}
                      defaultValue={
                        mode === "edit"
                          ? deal?.description ?? undefined
                          : undefined
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insights">Insights</Label>
                    <Textarea
                      placeholder="Insights"
                      name="insights"
                      id="insights"
                      rows={5}
                      defaultValue={
                        mode === "edit"
                          ? deal?.insights ?? undefined
                          : undefined
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="impacts">Impact</Label>
                    <Textarea
                      placeholder="Impact"
                      name="impacts"
                      id="impacts"
                      rows={5}
                      defaultValue={
                        mode === "edit" ? deal?.impacts ?? undefined : undefined
                      }
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {!!selectedDealType && (
            <Card>
              <Collapsible
                open={expandedSections.details}
                onOpenChange={() => toggleSection("details")}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer">
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Handshake className="h-5 w-5" />
                        Deal Details
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
                  <CardContent className="pt-4 space-y-4">
                    {selectedDealType === "merger_acquisition" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>M&A Type</Label>
                          <Select
                            name="maType"
                            value={selectedDealSubtype}
                            // required
                            // onValueChange={(value) =>
                            //   setSelectedDealSubtype(value as DealSubtype)
                            // }
                            disabled
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select M&A type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {DEAL_TYPES_SUBTYPES[selectedDealType].map(
                                (subtype) => (
                                  <SelectItem key={subtype} value={subtype}>
                                    {t(`deals.subtypes.${subtype}`)}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>M&A Structure</Label>
                          <Select
                            name="maStructure"
                            defaultValue={
                              mode === "edit"
                                ? deal?.mergerAcquisition?.structure ??
                                  undefined
                                : undefined
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select M&A structure..." />
                            </SelectTrigger>
                            <SelectContent>
                              {maStructure.enumValues.map((structure) => (
                                <SelectItem key={structure} value={structure}>
                                  {t(`deals.ma.structures.${structure}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Revenue Model</Label>
                          <Select
                            name="revenueModel"
                            defaultValue={
                              mode === "edit"
                                ? deal?.mergerAcquisition?.revenueModel ??
                                  undefined
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
                            placeholder="e.g. 20"
                            id="revenueModelDuration"
                            name="revenueModelDuration"
                            defaultValue={
                              mode === "edit"
                                ? deal?.mergerAcquisition
                                    ?.revenueModelDuration ?? undefined
                                : undefined
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Specifics</Label>
                          <input
                            type="hidden"
                            name="maSpecifics"
                            value={dealDetails?.maSpecifics}
                          />
                          <MultiSelect
                            options={maSpecifics.enumValues.map((specific) => ({
                              label: t(`deals.ma.specifics.${specific}`),
                              value: specific,
                            }))}
                            selected={dealDetails?.maSpecifics ?? []}
                            onChange={(selected) =>
                              setDealDetails((prev) => ({
                                ...prev,
                                maSpecifics: selected as MASpecifics[],
                              }))
                            }
                            placeholder="Select M&A specifics..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Financing Strategy</Label>
                          <input
                            type="hidden"
                            name="maFinancingStrategy"
                            value={dealDetails?.maFinancingStrategy}
                          />
                          <MultiSelect
                            options={dealFinancingType.enumValues.map(
                              (financingType) => ({
                                label: t(`deals.financing.types.${financingType}`),
                                value: financingType,
                              })
                            )}
                            selected={dealDetails?.maFinancingStrategy ?? []}
                            onChange={(selected) =>
                              setDealDetails((prev) => ({
                                ...prev,
                                maFinancingStrategy:
                                  selected as DealFinancingType[],
                              }))
                            }
                            placeholder="Select financing strategies..."
                          />
                        </div>
                        <div className="space-y-2 col-span-full">
                          <Label htmlFor="maStrategyRationale">
                            Strategy Rationale
                          </Label>
                          <Textarea
                            placeholder="Explain the strategy rationale for this M&A"
                            id="maStrategyRationale"
                            name="maStrategyRationale"
                            defaultValue={
                              mode === "edit"
                                ? deal?.mergerAcquisition?.strategyRationale ??
                                  undefined
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    )}
                    {selectedDealType === "financing" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="financingVehicle">
                            Investment Vehicle
                          </Label>
                          <Input
                            placeholder="Investment Vehicle"
                            name="financingVehicle"
                            id="financingVehicle"
                            defaultValue={
                              mode === "edit"
                                ? deal?.financing?.vehicle ?? undefined
                                : undefined
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Financing Objective</Label>
                          <Select
                            name="financingObjective"
                            defaultValue={
                              mode === "edit"
                                ? deal?.financing?.objective ?? undefined
                                : undefined
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select financing objective..." />
                            </SelectTrigger>
                            <SelectContent>
                              {financingObjective.enumValues.map(
                                (objective) => (
                                  <SelectItem key={objective} value={objective}>
                                    {t(`deals.financing.objectives.${objective}`)}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Financing Type</Label>
                          <input
                            type="hidden"
                            name="financingType"
                            value={dealDetails?.financingType}
                          />
                          <MultiSelect
                            options={dealFinancingType.enumValues.map((ft) => ({
                              label: t(`deals.financing.types.${ft}`),
                              value: ft,
                            }))}
                            selected={dealDetails?.financingType ?? []}
                            onChange={(selected) =>
                              setDealDetails((prev) => ({
                                ...prev,
                                financingType: selected as DealFinancingType[],
                              }))
                            }
                            placeholder="Select financing types..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Financing Subtype</Label>
                          <input
                            type="hidden"
                            name="financingSubtype"
                            value={dealDetails?.financingSubtype}
                          />
                          <MultiSelect
                            options={financingSubtype.enumValues.map((fs) => ({
                              label: t(`deals.financing.subtypes.${fs}`),
                              value: fs,
                            }))}
                            selected={dealDetails?.financingSubtype ?? []}
                            onChange={(selected) =>
                              setDealDetails((prev) => ({
                                ...prev,
                                financingSubtype:
                                  selected as FinancingSubtype[],
                              }))
                            }
                            placeholder="Select financing subtype..."
                          />
                        </div>
                      </div>
                    )}
                    {selectedDealType === "power_purchase_agreement" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>PPA Specific</Label>
                          <Select
                            name="ppaSpecific"
                            defaultValue={
                              mode === "edit"
                                ? deal?.powerPurchaseAgreement?.details?.toString()
                                : undefined
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select PPA term length..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key="false" value="">
                                Short-term
                              </SelectItem>
                              <SelectItem key="true" value="true">
                                Long-term
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ppaDuration">PPA Duration</Label>
                          <Input
                            placeholder="20 Years"
                            type="number"
                            name="ppaDuration"
                            id="ppaDuration"
                            defaultValue={
                              mode === "edit"
                                ? deal?.powerPurchaseAgreement?.duration ??
                                  undefined
                                : undefined
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ppaCapacity">
                            Capacity Off-taken (MW)
                          </Label>
                          <Input
                            placeholder="PPA Capacity"
                            type="number"
                            name="ppaCapacity"
                            id="ppaCapacity"
                            defaultValue={
                              mode === "edit"
                                ? deal?.powerPurchaseAgreement?.capacity ??
                                  undefined
                                : undefined
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ppaGeneratedPower">
                            Generated Power Offtaken (GWh/year)
                          </Label>
                          <Input
                            placeholder="e.g, 150 GWh/year"
                            type="number"
                            name="ppaGeneratedPower"
                            id="ppaGeneratedPower"
                            defaultValue={
                              mode === "edit"
                                ? deal?.powerPurchaseAgreement
                                    ?.generatedPower ?? undefined
                                : undefined
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Onsite/Offsite</Label>
                          <Select
                            name="onOffsite"
                            defaultValue={
                              mode === "edit"
                                ? deal?.powerPurchaseAgreement?.onOffSite?.toString()
                                : undefined
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select PPA On-/Off-site..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key="false" value="">
                                Offsite
                              </SelectItem>
                              <SelectItem key="true" value="true">
                                Onsite
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ppaSupplyStart">
                            PPA Supply Start
                          </Label>
                          <Input
                            type="date"
                            name="ppaSupplyStart"
                            id="ppaSupplyStart"
                            defaultValue={
                              mode === "edit"
                                ? deal?.powerPurchaseAgreement?.supplyStart?.toLocaleDateString() ??
                                  undefined
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}

          <div className="flex justify-start gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/deals")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Deal"}
            </Button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}
