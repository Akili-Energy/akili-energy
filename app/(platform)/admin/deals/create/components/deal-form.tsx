"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Briefcase,
  Handshake,
  Landmark,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { createDeal } from "@/app/actions/deals";
import type {
  AssetEntry,
  AssetLifecycle,
  CompanyEntry,
  Country,
  DealCompanyRole,
  DealFinancingType,
  DealSubtype,
  DealType,
  FinancialEntry,
  FinancingInvestorType,
  FinancingObjective,
  FinancingSubtype,
  MASpecifics,
  MAStructure,
  Region,
  Sector,
  Segment,
  SubSector,
  Technology,
} from "@/lib/types";
import {
  countryCode,
  dealType,
  geographicRegion,
  projectSector as sectorEnum,
  segment,
  projectSubSector,
  technology,
} from "@/lib/db/schema";
import {
  REGIONS_COUNTRIES,
  DEAL_TYPES_SUBTYPES,
  SECTORS_TECHNOLOGIES,
} from "@/lib/constants";

interface DealFormProps {
  companyOptions: Option[];
  projectOptions: Option[];
}

export function DealForm({ companyOptions, projectOptions }: DealFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [assetEntries, setAssetEntries] = useState<AssetEntry[]>([]);
  const [companyEntries, setCompanyEntries] = useState<CompanyEntry[]>([]);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(
    []
  );
  const [selectedProjectForAsset, setSelectedProjectForAsset] = useState("");
  const [selectedCompanyForDeal, setSelectedCompanyForDeal] = useState("");

  const [dealData, setDealData] = useState({
    update: "",
    type: "" as DealType | "",
    subtype: "" as DealSubtype | "",
    regions: [] as Region[],
    countries: [] as Country[],
    sectors: [] as Sector[],
    technologies: [] as Technology[],
    subSectors: [] as SubSector[],
    segments: [] as Segment[],
    amount: "",
    currency: "USD",
    pressReleaseUrl: "",
    announcementDate: "",
    completionDate: "",
    summary: "",
    insights: "",
    impacts: "",
  });

  const [maData, setMAData] = useState({
    structure: "" as MAStructure | "",
    specifics: [] as MASpecifics[],
    revenueModel: "",
    revenueModelDuration: "",
    financingStrategy: [] as DealFinancingType[],
    strategyRationale: "",
  });

  const [financingData, setFinancingData] = useState({
    vehicle: "",
    objective: "" as FinancingObjective,
    financing_type: [] as DealFinancingType[],
    financing_subtype: [] as FinancingSubtype[],
  });

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

  const addEntry = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    newEntry: T
  ) => {
    setter((prev) => [...prev, newEntry]);
  };

  const removeEntry = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string
  ) => {
    setter((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntry = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    field: keyof T,
    value: any
  ) => {
    setter((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addAssetEntry = () => {
    if (!selectedProjectForAsset) {
      toast({
        title: "Error",
        description: "Please select a project to add as an asset.",
        variant: "destructive",
      });
      return;
    }

    const project = projectOptions.find(
      (p) => p.value === selectedProjectForAsset
    );
    if (project) {
      addEntry(setAssetEntries, {
        id: project.value,
        name: project.label,
        maturity: 0,
        equityTransacted: 0,
        description: project.description,
      });
      setSelectedProjectForAsset("");
    }
  };

  const addCompanyEntry = () => {
    if (!selectedCompanyForDeal) {
      toast({
        title: "Error",
        description: "Please select a company to add.",
        variant: "destructive",
      });
      return;
    }

    const company = companyOptions.find(
      (c) => c.value === selectedCompanyForDeal
    );
    if (company) {
      addEntry(setCompanyEntries, {
        id: company.value,
        name: company.label,
        role: "",
        investorType: "",
        commitment: 0,
        description: company.description,
      });
      setSelectedCompanyForDeal("");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDeal({
        formData: dealData,
        assetEntries,
        companyEntries,
        financialEntries,
        maData,
        financingData,
      });

      toast({ title: "Success", description: "Deal created successfully." });
      router.push("/admin/deals");
    } catch (error: any) {
      console.error("Error creating deal:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="update">Deal Title *</Label>
                  <Input
                    id="update"
                    value={dealData.update}
                    onChange={(e) =>
                      setDealData({ ...dealData, update: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deal Type *</Label>
                  <Select
                    value={dealData.type}
                    onValueChange={(value: DealType) =>
                      setDealData({
                        ...dealData,
                        type: value,
                        subtype: !DEAL_TYPES_SUBTYPES[value].includes(
                          dealData.subtype as DealSubtype
                        )
                          ? dealData.subtype
                          : "",
                      })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(dealType.enumValues).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (Millions)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 150.5"
                    value={dealData.amount}
                    onChange={(e) =>
                      setDealData({ ...dealData, amount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Regions</Label>
                  <MultiSelect
                    selected={dealData.regions}
                    onChange={(selected) =>
                      setDealData({
                        ...dealData,
                        regions: selected as Region[],
                        countries: dealData.countries.every((c) =>
                          selected
                            .flatMap(
                              (region) => REGIONS_COUNTRIES[region as Region]
                            )
                            .includes(c)
                        )
                          ? dealData.countries
                          : [],
                      })
                    }
                    options={geographicRegion.enumValues.map((region) => ({
                      label: region,
                      value: region,
                    }))}
                    placeholder="Select regions..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Countries</Label>
                  <MultiSelect
                    selected={dealData.countries}
                    onChange={(selected) =>
                      setDealData({
                        ...dealData,
                        countries: selected as Country[],
                        regions: selected.every((c) =>
                          dealData.regions
                            .flatMap(
                              (region) => REGIONS_COUNTRIES[region as Region]
                            )
                            .includes(c as Country)
                        )
                          ? dealData.regions
                          : (Object.keys(REGIONS_COUNTRIES) as Region[]).filter(
                              (region) =>
                                selected.some((c) =>
                                  REGIONS_COUNTRIES[region].includes(
                                    c as Country
                                  )
                                )
                            ),
                      })
                    }
                    options={countryCode.enumValues.map((c) => ({
                      label: c,
                      value: c,
                    }))}
                    placeholder="Select countries..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sectors</Label>
                  <MultiSelect
                    selected={dealData.sectors}
                    onChange={(selected) =>
                      setDealData({
                        ...dealData,
                        sectors: selected as Sector[],
                        technologies: dealData.technologies.every((t) =>
                          selected
                            .flatMap((s) => SECTORS_TECHNOLOGIES[s as Sector])
                            .includes(t)
                        )
                          ? dealData.technologies
                          : [],
                      })
                    }
                    options={sectorEnum.enumValues.map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    placeholder="Select sectors..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <MultiSelect
                    selected={dealData.technologies}
                    onChange={(selected) =>
                      setDealData({
                        ...dealData,
                        technologies: selected as Technology[],
                        sectors: selected.every((t) =>
                          dealData.sectors
                            .flatMap((s) => SECTORS_TECHNOLOGIES[s as Sector])
                            .includes(t as Technology)
                        )
                          ? dealData.sectors
                          : (
                              Object.keys(SECTORS_TECHNOLOGIES) as Sector[]
                            ).filter((s) =>
                              selected.some((t) =>
                                (SECTORS_TECHNOLOGIES[s] ?? []).includes(
                                  t as Technology
                                )
                              )
                            ),
                      })
                    }
                    options={technology.enumValues.map((t) => ({
                      label: t,
                      value: t,
                    }))}
                    placeholder="Select technologies..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sub-sectors</Label>
                  <MultiSelect
                    selected={dealData.subSectors}
                    onChange={(selected) =>
                      setDealData({
                        ...dealData,
                        subSectors: selected as SubSector[],
                      })
                    }
                    options={projectSubSector.enumValues.map((ss) => ({
                      label: ss,
                      value: ss,
                    }))}
                    placeholder="Select sub-sectors..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Segments</Label>
                  <MultiSelect
                    selected={dealData.segments}
                    onChange={(selected) =>
                      setDealData({
                        ...dealData,
                        segments: selected as Segment[],
                      })
                    }
                    options={segment.enumValues.map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    placeholder="Select segments..."
                  />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label>Press Release URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={dealData.pressReleaseUrl}
                    onChange={(e) =>
                      setDealData({
                        ...dealData,
                        pressReleaseUrl: e.target.value,
                      })
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
                  {expandedSections.assets ? <ChevronDown /> : <ChevronRight />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-4 space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-sm font-medium mb-2 block">
                    Add Project to Assets
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={projectOptions.filter(
                          (p) => !assetEntries.some((a) => a.id === p.value)
                        )}
                        value={selectedProjectForAsset}
                        onChange={setSelectedProjectForAsset}
                        placeholder="Select a project to add..."
                        searchPlaceholder="Search projects..."
                        emptyText="No projects found."
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addAssetEntry}
                      disabled={!selectedProjectForAsset}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Asset
                    </Button>
                  </div>
                </div>
                {assetEntries.map((asset) => (
                  <div
                    key={asset.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {asset.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {asset.description}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntry(setAssetEntries, asset.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor={`asset-${asset.id}-maturity`}
                          className="text-sm"
                        >
                          Maturity Date
                        </Label>
                        <Input
                          id={`asset-${asset.id}-maturity`}
                          type="date"
                          value={asset.maturity}
                          onChange={(e) =>
                            updateEntry(
                              setAssetEntries,
                              asset.id,
                              "maturity",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`equity-${asset.id}`}
                          className="text-sm"
                        >
                          Equity Transacted (%)
                        </Label>
                        <Input
                          id={`equity-${asset.id}`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={asset.equityTransacted}
                          onChange={(e) =>
                            updateEntry(
                              setAssetEntries,
                              asset.id,
                              "equityTransacted",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 25.5"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-sm font-medium mb-2 block">
                    Add Company to Deal
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={companyOptions.filter(
                          (p) => !companyEntries.some((a) => a.id === p.value)
                        )}
                        value={selectedCompanyForDeal}
                        onChange={setSelectedCompanyForDeal}
                        searchPlaceholder="Search companies..."
                        emptyText="No companies found."
                        placeholder="Select a company to add..."
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addAssetEntry}
                      disabled={!selectedCompanyForDeal}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Company
                    </Button>
                  </div>
                </div>
                {companyEntries.map((company) => (
                  <div
                    key={company.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {company.company_name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {company.company_description}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompanyEntry(company.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor={`role-${company.id}`}
                          className="text-sm"
                        >
                          Role
                        </Label>
                        <SearchableSelect
                          options={roleOptions}
                          value={company.role}
                          onChange={(value) =>
                            updateCompanyEntry(company.id, "role", value)
                          }
                          placeholder="Select role..."
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`commitment-${company.id}`}
                          className="text-sm"
                        >
                          Commitment ($M)
                        </Label>
                        <Input
                          id={`commitment-${company.id}`}
                          type="number"
                          step="0.1"
                          min="0"
                          value={company.commitment}
                          onChange={(e) =>
                            updateCompanyEntry(
                              company.id,
                              "commitment",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 150"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`investor_type-${company.id}`}
                          className="text-sm"
                        >
                          Investor Type
                        </Label>
                        <SearchableSelect
                          options={investorTypeOptions}
                          value={company.investor_type}
                          onChange={(value) =>
                            updateCompanyEntry(
                              company.id,
                              "investor_type",
                              value
                            )
                          }
                          placeholder="Select type..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                {financialEntries.map((fin) => (
                  <div key={fin.id} className="border p-4 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <Input
                        className="w-32"
                        placeholder="Year"
                        type="number"
                        value={fin.year}
                        onChange={(e) =>
                          updateEntry(
                            setFinancialEntries,
                            fin.id,
                            "year",
                            e.target.value
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntry(setFinancialEntries, fin.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        type="number"
                        placeholder="Enterprise Value ($M)"
                        value={fin.enterpriseValue}
                        onChange={(e) =>
                          updateEntry(
                            setFinancialEntries,
                            fin.id,
                            "enterprise_value",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        type="number"
                        placeholder="EBITDA ($M)"
                        value={fin.ebitda}
                        onChange={(e) =>
                          updateEntry(
                            setFinancialEntries,
                            fin.id,
                            "ebitda",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Debt ($M)"
                        value={fin.debt}
                        onChange={(e) =>
                          updateEntry(
                            setFinancialEntries,
                            fin.id,
                            "debt",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addEntry(setFinancialEntries, {
                      year: new Date().getFullYear().toString(),
                      enterpriseValue: "",
                      ebitda: "",
                      debt: "",
                    })
                  }
                >
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
                  <Label>Announcement Date</Label>
                  <Input
                    type="date"
                    value={dealData.announcement_date}
                    onChange={(e) =>
                      setDealData({
                        ...dealData,
                        announcement_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Completion Date</Label>
                  <Input
                    type="date"
                    value={dealData.completion_date}
                    onChange={(e) =>
                      setDealData({
                        ...dealData,
                        completion_date: e.target.value,
                      })
                    }
                  />
                </div>
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
                  <Label>Summary</Label>
                  <Textarea
                    placeholder="Summary"
                    value={dealData.summary}
                    onChange={(e) =>
                      setDealData({ ...dealData, summary: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Insights</Label>
                  <Textarea
                    placeholder="Insights"
                    value={dealData.insights}
                    onChange={(e) =>
                      setDealData({ ...dealData, insights: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Impact</Label>
                  <Textarea
                    placeholder="Impact"
                    value={dealData.impacts}
                    onChange={(e) =>
                      setDealData({ ...dealData, impacts: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {dealData.dealType && (
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
                  {dealData.dealType === "merger_acquisition" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>M&A Structure (Subtype)</Label>
                        <Select
                          value={maData.structure}
                          onValueChange={(value) =>
                            setMAData({ ...maData, structure: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="M&A Structure..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asset">Asset</SelectItem>
                            <SelectItem value="ma_corporate">
                              Corporate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Revenue Model</Label>
                        <Input
                          placeholder="Revenue Model"
                          value={maData.revenueModel}
                          onChange={(e) =>
                            setMAData({
                              ...maData,
                              revenueModel: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Revenue Model Duration (Years)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 20"
                          value={maData.revenue_model_duration}
                          onChange={(e) =>
                            setMAData({
                              ...maData,
                              revenue_model_duration: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Specifics</Label>
                        <MultiSelect
                          options={[
                            {
                              label: "Majority Stake",
                              value: "majority_stake",
                            },
                            {
                              label: "Minority Stake",
                              value: "minority_stake",
                            },
                          ]}
                          selected={maData.specifics}
                          onChange={(selected) =>
                            setMAData({ ...maData, specifics: selected })
                          }
                          placeholder="Specifics..."
                        />
                      </div>
                      <div className="space-y-2 col-span-full">
                        <Label>Financing Strategy</Label>
                        <MultiSelect
                          options={[
                            { label: "Debt", value: "debt" },
                            { label: "Equity", value: "equity" },
                          ]}
                          selected={maData.financing_strategy}
                          onChange={(selected) =>
                            setMAData({
                              ...maData,
                              financing_strategy: selected,
                            })
                          }
                          placeholder="Financing Strategy..."
                        />
                      </div>
                      <div className="space-y-2 col-span-full">
                        <Label>Strategy Rationale</Label>
                        <Textarea
                          placeholder="Strategy Rationale"
                          value={maData.strategy_rationale}
                          onChange={(e) =>
                            setMAData({
                              ...maData,
                              strategy_rationale: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {dealData.dealType === "financing" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Investment Vehicle</Label>
                        <Input
                          placeholder="Investment Vehicle"
                          value={financingData.vehicle}
                          onChange={(e) =>
                            setFinancingData({
                              ...financingData,
                              vehicle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Financing Objective</Label>
                        <Select
                          value={financingData.objective}
                          onValueChange={(value) =>
                            setFinancingData({
                              ...financingData,
                              objective: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Objective..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asset">Asset</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="government">
                              Government
                            </SelectItem>
                            <SelectItem value="cleantech">Cleantech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Financing Type</Label>
                        <MultiSelect
                          options={[
                            { label: "Debt", value: "debt" },
                            { label: "Equity", value: "equity" },
                            { label: "Grant", value: "grant" },
                          ]}
                          selected={financingData.financing_type}
                          onChange={(selected) =>
                            setFinancingData({
                              ...financingData,
                              financing_type: selected,
                            })
                          }
                          placeholder="Financing Type..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Financing Subtype</Label>
                        <MultiSelect
                          options={[
                            {
                              label: "Project Finance",
                              value: "project_finance",
                            },
                            { label: "Loan", value: "loan" },
                          ]}
                          selected={financingData.financing_subtype}
                          onChange={(selected) =>
                            setFinancingData({
                              ...financingData,
                              financing_subtype: selected,
                            })
                          }
                          placeholder="Financing Subtype..."
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/deals")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Deal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
