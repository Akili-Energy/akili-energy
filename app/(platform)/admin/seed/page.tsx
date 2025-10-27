"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Save,
  Trash2,
  Plus,
  Info,
  Database,
  Building,
  Briefcase,
  Factory,
  Handshake,
  Link,
  Target,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  companyActivity,
  companyClassification,
  companySize,
  countryCode,
  dealFinancingType,
  dealType,
  financingInvestorType,
  financingObjective,
  financingSubtype,
  fundraisingStatus,
  maSpecifics,
  maStatus,
  maStructure,
  partnershipObjective,
  projectCompanyRole,
  projectContractType,
  projectMilestone,
  projectStage,
  projectTenderObjective,
  revenueModel,
  companySector,
  projectSector,
  segment,
  projectSubSector,
  companySubSector,
  technology,
  projectStatus,
  companyOperatingStatus,
} from "@/lib/db/schema";
import {
  fetchProjects,
  fetchCompanies,
  fetchDeals,
  seedDatabase,
} from "@/app/actions/actions";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  type AssetLifecycle,
  type CompanySubSector,
  type Country,
  type DealAsset,
  type DealCompany,
  type NewCompany,
  type NewDeal,
  type NewFinancing,
  type NewJointVenture,
  type NewMergerAcquisition,
  type NewPowerPurchaseAgreement,
  type NewProject,
  type NewProjectCompany,
  type NewProjectProposal,
  type NewProjectUpdateDetail,
  type ProjectCompanyRole,
  PROJECT_FINANCING_STRATEGIES,
  type ProjectFinancingStrategy,
  type ProjectSubSector,
  PROPOSAL_EVALUATION_CRITERIA,
  type ProposalEvaluationCriteria,
  type Sector,
  type SubSector,
  type Technology,
  type DealType,
  ProjectSector,
  CompanySector,
} from "@/lib/types";
import { isValidUrl } from "@/lib/utils";
import { COUNTRIES_ISO_3166_CODE } from "@/lib/constants";
import { useLanguage } from "@/components/language-context";
import Image from "next/image";

/**
 * Converts a full country name (in English, French, or common variations) to its ISO 3166-1 alpha-2 code.
 * @param countryName The full name of the country.
 * @returns The two-letter country code or undefined if not found.
 */
export function convertCountryToCode(countryName: string): Country | undefined {
  if (!countryName) return undefined;

  // Normalize the input name for matching
  const cleanedName = countryName.trim().toLowerCase();
  const code = COUNTRIES_ISO_3166_CODE[cleanedName];

  // Final check to ensure the code is a valid enum member
  if (code && countryCode.enumValues.includes(code)) {
    return code;
  }

  // Fallback for direct code match (e.g., if "ZA" is passed instead of "South Africa")
  if (countryCode.enumValues.includes(countryName.toUpperCase() as Country)) {
    return countryName.toUpperCase() as Country;
  }

  return undefined;
}

/**
 * Converts an array of full country names to an array of unique ISO 3166-1 alpha-2 codes.
 * @param countryNames An array of full country names.
 * @returns An array of unique two-letter country codes.
 */
export function convertCountriesToCodes(countryNames: string[]): Country[] {
  if (!countryNames || countryNames.length === 0) return [];

  const codes = countryNames
    .map(convertCountryToCode)
    .filter((code): code is Country => !!code); // Filter out any undefined results

  return [...new Set(codes)]; // Return only unique codes
}

type ModelWithId<T> = T & { id: string };
type BaseModel<T> = ModelWithId<T> & {
  sectors?: Sector[];
  technologies?: Technology[];
  subSectors?: SubSector[];
  countries?: Country[];
};
type NewDealAsset = ModelWithId<DealAsset> & {
  dealName: string;
  assetName: string;
};
type NewDealCompany = ModelWithId<DealCompany> & {
  dealName: string;
  companyName: string;
};

type Project = NewProject &
  Omit<NewProjectUpdateDetail & NewProjectProposal, "projectId">;

interface DataRow {
  id: string;
  [key: string]: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  table: string;
  rowId: string;
}

interface TableData<T extends Record<string, any>> {
  name: string;
  displayName: string;
  icon: React.ReactNode;
  data: T[];
  columns: FieldConfig<Extract<keyof T, string>>[];
  primaryKey: string;
  isRelationship?: boolean;
}

interface FieldConfig<T extends string> {
  key: T;
  label: string;
  type:
    | "text"
    | "select"
    | "number"
    | "date"
    | "url"
    | "textarea"
    | "boolean"
    | "multiselect"
    | "geography"
    | "json"
    | "image"
    | "link";
  required?: boolean;
  tooltip?: string;
  options?: string[] | { value: string; label: string }[];
  placeholder?: string;
  readonly?: boolean;
  hidden?: boolean;
  linkTo?: "deals" | "projects" | "companies"; // For relationship links
  dictionary?: string;
  id?: boolean;
}

interface Sponsor {
  name: string;
  percentageOwnership?: number;
  equityAmount?: number;
  details?: string;
}

interface InitialData {
  deals: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  projects: { id: string; name: string }[];
}

const DATA_TYPES = {
  deals: "Deals",
  projects: "Projects",
  companies: "Companies",
};

const PROJECT_TYPES = {
  update: "Project Updates",
  proposal: "Project Proposals",
};

const ITEMS_PER_PAGE = 25;

const INVALID_VALUES = [
  null,
  undefined,
  "",
  " ",
  "na",
  "n.a",
  "undisclosed",
  "Undisclosed",
  "-",
  "#NAME?",
];

function toArray(data: string) {
  return (
    data
      ?.trim()
      .toLowerCase()
      .split(";")
      .map((s) => s.trim().replaceAll(/\s+/g, "_").replaceAll(/[/-]/g, "_")) ||
    []
  );
}

export default function BulkUploadPage() {
  const { t } = useLanguage();
  const [selectedDataType, setSelectedDataType] = useState<string>("");
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  //   const [uploadedData, setUploadedData] = useState<UploadData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [editingCell, setEditingCell] = useState<{
    table: string;
    row: number;
    field: string;
  } | null>(null);
  const [tableData, setTableData] = useState<TableData<any>[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [initialData, setInitialData] = useState<InitialData>({
    deals: [],
    companies: [],
    projects: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  // Load reference data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Highlight effect
  useEffect(() => {
    if (highlightedRow) {
      const timer = setTimeout(() => setHighlightedRow(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedRow]);

  useEffect(() => {
    if (tableData.length > 0) {
      validateData(tableData);
    }
  }, [tableData]);

  const loadInitialData = async () => {
    try {
      const projects = await fetchProjects();
      const companies = await fetchCompanies();
      const deals = await fetchDeals();
      setInitialData({ projects, companies, deals });
    } catch (error) {
      console.error("Failed to load reference data:", error);
    }
  };

  function filterArray<T>(arr: string[], set: T[]): T[] {
    return arr.filter((el) => set.includes(el as T)) as T[];
  }

  function parseEnum<T>(value: string, enumValues: T[]): T | undefined {
    if (enumValues.includes(value as T)) {
      return value as T;
    }
    return undefined;
  }

  function parseNumber(n: number) {
    return isNaN(n) ? undefined : n;
  }

  function parseDate(date: Date) {
    return isNaN(date.valueOf()) ? undefined : date;
  }

  function parseTechnologies(row: Record<string, string>) {
    return filterArray(
      row.Technology?.split(";").map((s: string) =>
        s
          .trim()
          .toLowerCase()
          .replace("solar pv", "photovoltaic")
          .replace("wind onshore", "onshore_wind")
          .replace("wind offshore", "offshore_wind")
          .replaceAll(/\s+/g, "_")
          .replaceAll("-", "_")
          .replace("pv", "photovoltaic")
          .replace("csp", "concentrated_solar_power")
          .replace("shs", "solar_home_systems")
      ) || [],
      technology.enumValues
    );
  }

  function parseSectors(
    row: Record<string, string>,
    sectors: Sector[] = companySector.enumValues,
    fieldName = "Sector"
  ) {
    return filterArray(
      row[fieldName]
        ?.trim()
        .toLowerCase()
        .split(";")
        .map((s: string) =>
          s
            .trim()
            .replaceAll(/\s*&\s*/g, "")
            .replaceAll(/\s+/g, "_")
            .replaceAll("utility", "utilities")
            .replaceAll("hospitality", "real_estate")
            .replaceAll("telco", "telecom")
        ) || [],
      sectors
    );
  }

  function parseSubSectors(
    row: Record<string, string>,
    subSectors: SubSector[] = projectSubSector.enumValues,
    fieldName = "Sub-sector"
  ) {
    return filterArray(
      row[fieldName]
        ?.trim()
        .toLowerCase()
        .split(";")
        .map((s: string) =>
          s
            .trim()
            .replaceAll("c&i", "commercial_industrial")
            .replaceAll("dre", "distributed_renewable")
            .replaceAll("-", "_")
            .replaceAll(/\s+/g, "_")
        ) || [],
      subSectors
    );
  }

  function parseSegments(row: Record<string, string>) {
    return filterArray(toArray(row.Segment), segment.enumValues);
  }

  function parseRevenueModel(
    row: Record<string, string>,
    fieldName = "Revenue Model (Year)"
  ) {
    return {
      revenueModel: parseEnum(
        row[fieldName]
          ?.toLowerCase()
          .replace(/\s*\([^)]*\)/, "")
          .replaceAll(/\s+/g, "_")
          .replaceAll("-", "_")
          .replace("ppa", "power_purchase_agreement")
          .trim(),
        revenueModel.enumValues
      ),
      revenueModelDuration: parseNumber(
        parseInt(row[fieldName]?.match(/\((\d+)[^)]*\)/)?.[1] || "")
      ),
    };
  }

  function parseProjectMilestone(row: Record<string, string>) {
    return row["Project milestone"];
    // return parseEnum(
    //   row["Project milestone"]
    //     ?.toLowerCase()
    //     .replaceAll(/[-/]/g, "_")
    //     .replaceAll(/\s+/g, "_"),
    //   projectMilestone.enumValues
    // );
  }

  // Generate kebab-case ID from name
  const generateId = (name: string, prefix = "") => {
    const kebab = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return prefix ? `${prefix}-${kebab}` : kebab;
  };

  // Parse comma-separated values with numbers
  const parseCommaSeparatedWithNumbers = (
    text: string
  ): { names: string[]; numbers: number[] } => {
    if (!text) return { names: [], numbers: [] };

    // Extract all numbers with optional % or other suffixes
    const numberMatches = text.match(/(\d+(?:\.\d+)?)\s*%?/g) || [];
    const extractedNumbers = numberMatches.map((match) =>
      Number.parseFloat(match.replace(/[^\d.]/g, ""))
    );

    // Extract names by removing numbers and cleaning up
    const cleanText = text
      .replace(/\([^)]*\)/g, "")
      .replace(/\d+(?:\.\d+)?\s*%?/g, "");
    const extractedNames = cleanText
      .split(";")
      .map((name) => name.trim())
      .filter(Boolean);

    return {
      names: extractedNames,
      numbers: extractedNumbers,
    };
  };

  function parseSponsor(input: string) {
    const sponsor: Sponsor = { name: "" };

    // Match all (...) groups
    const parenMatches = [...input.matchAll(/\(([^)]+)\)/g)].map((m) =>
      m[1].trim()
    );

    // Extract base name (remove (...) chunks)
    sponsor.name = input.replace(/\(.*?\)/g, "").trim();

    for (const content of parenMatches) {
      const cleaned = content.replace(/\s+/g, " ").trim();

      // Combo: "$123.45/100%" or "$123.45 / 100%"
      const comboMatch = cleaned.match(
        /\$([\d,]+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)%/
      );
      if (comboMatch) {
        sponsor.equityAmount = parseFloat(comboMatch[1].replace(/,/g, ""));
        sponsor.percentageOwnership = Math.round(parseFloat(comboMatch[2]));
        continue;
      }

      // Equity only: "$123.45"
      const equityMatch = cleaned.match(/\$([\d,]+(?:\.\d+)?)/);
      if (equityMatch) {
        sponsor.equityAmount = parseFloat(equityMatch[1].replace(/,/g, ""));
        continue;
      }

      // Percentage only: "50%" or "/25%" or "%100"
      const percMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*%/);
      if (percMatch) {
        sponsor.percentageOwnership = Math.round(parseFloat(percMatch[1]));
        continue;
      }

      // Ignore junk like "/ %"
      if (cleaned === "/" || cleaned === "/ %" || cleaned === "%") {
        continue;
      }

      // Otherwise it's other details
      if (cleaned) {
        sponsor.details = cleaned;
      }
    }

    return sponsor;
  }

  // Parse M&A data into multiple tables
  const parseMAData = (data: DataRow[]): TableData<Record<string, any>>[] => {
    type MergerAcquisitionDeal = Omit<NewDeal, "type" | "subtype"> &
      BaseModel<{
        type: "merger_acquisition";
        subtype: "asset" | "ma_corporate";
      }> &
      Omit<NewMergerAcquisition, "dealId">;
    const companyRoles = [
      "acquisition_target",
      "offtaker",
      "buyer",
      "seller",
      "technical_advisor",
      "financial_advisor",
      "legal_advisor",
      "lead_arranger",
    ] as const;
    type MergerAcquisitionCompany = Omit<NewDealCompany, "role"> & {
      role: (typeof companyRoles)[number];
    };

    const tables: TableData<any>[] = [];
    const dealsData: MergerAcquisitionDeal[] = [];
    const dealsAssetsData: NewDealAsset[] = [];
    const dealsCompaniesData: MergerAcquisitionCompany[] = [];
    const projectsData: BaseModel<Project>[] = [];
    const companiesData: BaseModel<NewCompany>[] = [];

    data.forEach((row, index) => {
      const dealId = generateId(row["Deal update"] || `deal-${index}`, "deal");

      const subtype =
        row["Deal Type"].toLowerCase() === "corporate"
          ? "ma_corporate"
          : "asset";
      const isCorporateMA = subtype === "ma_corporate";

      const countries = convertCountriesToCodes(
        row.Country?.split(";").map((s: string) => s.trim()) || []
      );
      const sectors = parseSectors(
        row,
        (isCorporateMA ? companySector : projectSector).enumValues
      );
      const subSectors = parseSubSectors(
        row,
        isCorporateMA
          ? companySubSector.enumValues
          : projectSubSector.enumValues
      );
      const technologies = parseTechnologies(row);
      const location: [number, number] | undefined =
        row.Latitude && row.Longitude
          ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
          : undefined;

      // Main deals table (non-cross-referenced data)
      dealsData.push({
        id: dealId,
        update: row["Deal update"],
        type: "merger_acquisition",
        subtype,
        amount: parseNumber(parseFloat(row["Deal value ($ million)"])),
        date: row["Deal Date"]
          ? parseDate(new Date(row["Deal Date"]))
          : undefined,
        announcementDate: row["Announced Date"]
          ? parseDate(new Date(row["Announced Date"]))
          : null,
        completionDate: row["Completed Date"]
          ? parseDate(new Date(row["Completed Date"]))
          : null,
        // onOffGrid: row["On-grid/Off-grid"]?.toLowerCase().includes("on-grid"),
        countries,
        specifics: filterArray(
          toArray(row["Deal Specifics"]),
          maSpecifics.enumValues
        ),
        insights: row.Insights,
        pressReleaseUrl: row["Press Release"]
          ? row["Press Release"]
          : undefined,
        status: parseEnum(row.Status.toLowerCase(), maStatus.enumValues),
        structure: parseEnum(
          row["Deal Structure"]?.trim().toLowerCase().replaceAll(/\s+/g, "_"),
          maStructure.enumValues
        ),
        financingStrategy: filterArray(
          toArray(row["Financing strategy"]),
          dealFinancingType.enumValues
        ),
        strategyRationale: row["Strategy Rationale"],
        ...parseRevenueModel(row, "Revenue Model (Years)"),
      });

      // Parse acquisition targets (deals_assets)
      if (row["Acquisition target"]) {
        const { names: targets } = parseCommaSeparatedWithNumbers(
          row["Acquisition target"]
        );

        switch (subtype) {
          case "ma_corporate":
            targets.forEach((target, i) => {
              const companyId = generateId(target, "company");

              // Add to deals_companies relationship table
              dealsCompaniesData.push({
                id: `${dealId}-${companyId}-acquisition_target`,
                dealId,
                dealName: row["Deal update"],
                companyId: companyId,
                companyName: target,
                role: "acquisition_target",
                equityTransactedPercentage:
                  parseCommaSeparatedWithNumbers(row["Equity transacted"])
                    ?.numbers[i] || null,
              });

              // Add to companies table if not exists
              if (
                ![...companiesData, ...initialData.companies].find(
                  ({ id, name }) =>
                    id === companyId ||
                    name.toLowerCase() === target.toLowerCase()
                )
              ) {
                companiesData.push({
                  id: companyId,
                  name: target,
                  hqCountry: countries[i],
                  countries,
                  hqLocation: location,
                  sectors: sectors as CompanySector[],
                  technologies,
                  subSectors: subSectors as CompanySubSector[],
                });
              }
            });
            break;
          case "asset":
            const { numbers: maturities } = parseCommaSeparatedWithNumbers(
              row["Asset Maturity(Years)"]
            );
            const { numbers: equityPercentages } =
              parseCommaSeparatedWithNumbers(row["Equity transacted"]);
            const lifecycle = filterArray(
              row["Asset Lifecycle"]
                ?.toLowerCase()
                .split(";")
                .map((s: string) =>
                  s
                    .trim()
                    .replace("rtb", "ready_to_build")
                    .replaceAll(/\s+/g, "_")
                ) || [],
              projectStage.enumValues
            );
            const { names: storageCapacities } = parseCommaSeparatedWithNumbers(
              row["Co-located storage capacity"]
            );
            const { numbers: assetCapacities } = parseCommaSeparatedWithNumbers(
              row["Total Asset capacity (MW)"]
            );

            targets.forEach((target, i) => {
              const projectId = generateId(target, "project");

              // Add to deals_assets relationship table
              dealsAssetsData.push({
                id: `${dealId}-${projectId}`,
                dealId,
                dealName: row["Deal update"],
                assetId: projectId,
                assetName: target,
                maturity: Math.round(maturities[i]) || null,
                equityTransactedPercentage: equityPercentages[i] || null,
              });

              // Add to projects table if not exists
              if (
                ![...projectsData, ...initialData.projects].find(
                  ({ id, name }) =>
                    id === projectId ||
                    name.toLowerCase() === target.toLowerCase()
                )
              ) {
                const stage = lifecycle[i]
                  ?.toLowerCase()
                  .replaceAll(/\s+/g, "_");
                projectsData.push({
                  id: projectId,
                  name: target,
                  stage: projectStage.enumValues.includes(stage as any)
                    ? (stage as AssetLifecycle)
                    : null,
                  colocatedStorageCapacity: storageCapacities[i],
                  country: countries[i],
                  sectors,
                  technologies,
                  subSectors: subSectors as ProjectSubSector[],
                  segments: parseSegments(row),
                  plantCapacity: assetCapacities[i],
                  onOffGrid: row["On-grid/Off-grid"]
                    ?.split(";")
                    .map((s: string) =>
                      s.trim().toLowerCase().includes("on-grid")
                    )[i],
                  location,
                });
              }
            });
            break;
          default:
            break;
        }
      }

      // Parse company relationships
      const companyRoles = [
        { field: "Buyer(s)", role: "buyer", category: row["Buyer category"] },
        {
          field: "Seller(s)",
          role: "seller",
          category: row["Seller category"],
        },
        { field: "Financial Advisors", role: "financial_advisor" },
        { field: "Technical Advisors", role: "technical_advisor" },
        { field: "Legal Advisors", role: "legal_advisor" },
        { field: "Lead arrangers", role: "lead_arranger" },
        { field: "Off-taker", role: "offtaker" },
      ];

      companyRoles.forEach(({ field, role, category }, i) => {
        if (row[field]) {
          const companies = row[field]?.split(";").map((c: string) => c.trim());
          companies.forEach((name) => {
            const companyName =
              role === "buyer"
                ? name.replace(name.match(/\((.*?)\)/)?.[0] ?? "", "")
                : name;
            const companyId = generateId(companyName, "company");

            // Add to deals_companies relationship table
            dealsCompaniesData.push({
              id: `${dealId}-${companyId}-${role}`,
              dealId: dealId,
              dealName: row["Deal update"],
              companyId: companyId,
              companyName: companyName,
              role: role as MergerAcquisitionCompany["role"],
              details: name.match(/\((.*?)\)/)?.[1],
            });

            // Add to companies table if not exists
            if (!companiesData.find((c) => c.id === companyId)) {
              companiesData.push({
                id: companyId,
                name: companyName,
                classification:
                  category && category.length
                    ? [
                        filterArray(
                          category
                            .trim()
                            .toLowerCase()
                            .split(";")
                            .map((s: string) =>
                              s
                                .trim()
                                .replace("ipp", "independent_power_producer")
                                .replace(
                                  "dfi",
                                  "development_finance_institution"
                                )
                                .replaceAll(/\s+/g, "_")
                            ) ?? [],
                          companyClassification.enumValues
                        )[i],
                      ].filter(Boolean)
                    : [],
                countries,
              });
            }
          });
        }
      });
    });

    // Define table structures
    tables.push({
      name: "deals",
      displayName: "Deals",
      icon: <Briefcase className="h-4 w-4" />,
      data: dealsData,
      columns: [
        {
          key: "update",
          label: "Deal Update",
          type: "text",
          required: true,
          id: true,
        },
        {
          key: "subtype",
          label: "Deal Subtype",
          type: "select",
          options: ["asset", "ma_corporate"],
          required: true,
        },
        { key: "amount", label: "Deal Value (USD Million)", type: "number" },
        { key: "date", label: "Deal Date", type: "date" },
        {
          key: "countries",
          label: "Countries",
          type: "multiselect",
          options: countryCode.enumValues.map((c) => ({
            label: t(`common.countries.${c}`),
            value: c,
          })),
          dictionary: "common",
        },
        { key: "announcementDate", label: "Announcement Date", type: "date" },
        { key: "completionDate", label: "Completion Date", type: "date" },
        { key: "onOffGrid", label: "On Grid", type: "boolean" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: maStatus.enumValues,
        },
        {
          key: "revenueModel",
          label: "Revenue Model",
          type: "select",
          options: revenueModel.enumValues,
        },
        {
          key: "revenueModelDuration",
          label: "Duration (Years)",
          type: "number",
        },
        {
          key: "structure",
          label: "Deal Structure",
          type: "select",
          options: maStructure.enumValues,
        },
        {
          key: "specifics",
          label: "Deal Specifics",
          type: "multiselect",
          options: maSpecifics.enumValues,
        },
        {
          key: "financingStrategy",
          label: "Financing Strategy",
          type: "multiselect",
          options: dealFinancingType.enumValues,
        },
        {
          key: "strategyRationale",
          label: "Strategic Rationale",
          type: "textarea",
        },
        { key: "insights", label: "Insights", type: "textarea" },
        { key: "pressReleaseUrl", label: "Press Release URL", type: "url" },
      ],
      primaryKey: "id",
    } as TableData<MergerAcquisitionDeal>);

    tables.push({
      name: "deals_assets",
      displayName: "Deal Assets",
      icon: <Target className="h-4 w-4" />,
      data: dealsAssetsData,
      columns: [
        {
          key: "dealName",
          label: "Deal",
          type: "link",
          linkTo: "deals",
          //   readonly: true,
        },
        {
          key: "assetName",
          label: "Asset",
          type: "link",
          linkTo: "projects",
          //   readonly: true,
        },
        { key: "maturity", label: "Asset Maturity (Years)", type: "number" },
        {
          key: "equityTransactedPercentage",
          label: "Equity Transacted (%)",
          type: "number",
        },
      ],
      primaryKey: "id",
      isRelationship: true,
    } as TableData<NewDealAsset>);

    tables.push({
      name: "deals_companies",
      displayName: "Deal Companies",
      icon: <Handshake className="h-4 w-4" />,
      data: dealsCompaniesData,
      columns: [
        {
          key: "dealName",
          label: "Deal",
          type: "link",
          linkTo: "deals",
          readonly: true,
        },
        {
          key: "companyName",
          label: "Company",
          type: "link",
          linkTo: "companies",
          readonly: true,
        },
        {
          key: "role",
          label: "Role",
          type: "select",
          options: [...companyRoles],
        },
        {
          key: "details",
          label: "Details",
          type: "text",
        },
      ],
      primaryKey: "id",
      isRelationship: true,
    } as TableData<NewDealCompany>);

    tables.push({
      name: "projects",
      displayName: "Projects",
      icon: <Factory className="h-4 w-4" />,
      data: projectsData,
      columns: [
        {
          key: "name",
          label: "Project Name",
          type: "text",
          required: true,
          id: true,
        },
        {
          key: "country",
          label: "Country",
          type: "select",
          options: countryCode.enumValues.map((c) => ({
            label: t(`common.countries.${c}`),
            value: c,
          })),
          dictionary: "common",
        },
        {
          key: "sectors",
          label: "Sectors",
          type: "multiselect",
          options: projectSector.enumValues,
          dictionary: "common",
        },
        {
          key: "technologies",
          label: "Technologies",
          type: "multiselect",
          options: technology.enumValues,
          dictionary: "common",
        },
        {
          key: "subSectors",
          label: "Sub-sectors",
          type: "multiselect",
          options: projectSubSector.enumValues,
          dictionary: "common",
        },
        {
          key: "segments",
          label: "Segments",
          type: "multiselect",
          options: segment.enumValues,
          dictionary: "common",
        },
        {
          key: "stage",
          label: "Project Stage",
          type: "select",
          options: projectStage.enumValues,
        },
        {
          key: "colocatedStorageCapacity",
          label: "Co-located Storage Capacity (MW/MWh)",
          type: "text",
          // type: "number",
        },
        { key: "onOffGrid", label: "On Grid", type: "boolean" },
        { key: "plantCapacity", label: "Plant Capacity (MW)", type: "number" },
        {
          key: "location",
          label: "Location (Latitude, Longitude)",
          type: "geography",
        },
      ],
      primaryKey: "id",
    } as TableData<BaseModel<Project>>);

    tables.push({
      name: "companies",
      displayName: "Companies",
      icon: <Building className="h-4 w-4" />,
      data: companiesData,
      columns: [
        {
          key: "name",
          label: "Company Name",
          type: "text",
          required: true,
          id: true,
        },
        {
          key: "hqCountry",
          label: "HQ Country",
          type: "select",
          options: countryCode.enumValues.map((c) => ({
            label: t(`common.countries.${c}`),
            value: c,
          })),
          dictionary: "common",
        },
        {
          key: "countries",
          label: "Operating Countries",
          type: "multiselect",
          options: countryCode.enumValues.map((c) => ({
            label: t(`common.countries.${c}`),
            value: c,
          })),
          dictionary: "common",
        },
        {
          key: "sectors",
          label: "Sectors",
          type: "multiselect",
          options: companySector.enumValues,
          dictionary: "common",
        },
        {
          key: "technologies",
          label: "Technologies",
          type: "multiselect",
          options: technology.enumValues,
          dictionary: "common",
        },
        {
          key: "subSectors",
          label: "Sub-sectors",
          type: "multiselect",
          options: companySubSector.enumValues,
          dictionary: "common",
        },
        {
          key: "classification",
          label: "Classification",
          type: "multiselect",
          options: companyClassification.enumValues,
        },
        {
          key: "hqLocation",
          label: "Location (Latitude, Longitude)",
          type: "geography",
        },
      ],
      primaryKey: "id",
    } as TableData<BaseModel<NewCompany>>);

    return tables;
  };

  // Parse other deal types (financing, PPA, JV, project updates)
  const parseFinancingData = (data: DataRow[]): TableData<any>[] => {
    const financingTypes = ["debt", "equity", "grant"] as const;
    const companyRoles = ["financing", "investor", "advisor"] as const;
    type FinancingDeal = Omit<NewDeal, "type" | "subtype"> &
      BaseModel<{
        type: "financing";
        subtype?: (typeof financingTypes)[number];
      }> &
      Omit<NewFinancing, "dealId">;
    type FinancingCompany = Omit<NewDealCompany, "role"> & {
      role: (typeof companyRoles)[number];
    };

    const dealsData: FinancingDeal[] = [];
    const dealsAssetsData: NewDealAsset[] = [];
    const dealsCompaniesData: FinancingCompany[] = [];
    const projectsData: BaseModel<Project>[] = [];
    const companiesData: BaseModel<NewCompany>[] = [];

    data.forEach((row, index) => {
      const dealId = generateId(row["Deal update"] || `deal-${index}`, "deal");
      const companyId = generateId(
        row.Company || `company-${index}`,
        "company"
      );
      const projectId = generateId(
        row["Project name"] || `project-${index}`,
        "project"
      );

      const countries = convertCountriesToCodes(
        row["Country of primary operations"]
          ?.split(";")
          .map((s: string) => s.trim()) ?? []
      );
      const country = convertCountryToCode(row["Company Headquarter"]?.trim());

      dealsData.push({
        id: dealId,
        update: row["Deal update"],
        type: "financing",
        subtype: parseEnum(row["Financing type"]?.toLowerCase(), [
          ...financingTypes,
        ]),
        amount: parseNumber(
          parseFloat(row["Amount ($ million)"].replaceAll(",", "."))
        ),
        date: row["Deal Date"]
          ? parseDate(new Date(row["Deal Date"]))
          : undefined,
        insights: row["Deal comments"],
        pressReleaseUrl: row["Press Release"]
          ? row["Press Release"]
          : undefined,
        countries: country ? [...countries, country] : countries,
        vehicle: row["Investment vehicle"],
        status: parseEnum(
          row["Fundraising status"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          fundraisingStatus.enumValues
        ),
        objective: parseEnum(
          row["Financing objective"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          financingObjective.enumValues
        ),
        financingType: filterArray(
          toArray(row["Financing type"]),
          dealFinancingType.enumValues
        ),
        financingSubtype: filterArray(
          toArray(row["Financing Subtype"].replaceAll("/", ";")),
          financingSubtype.enumValues
        ),
      });

      const technologies = parseTechnologies(row);

      // Link deal to project if it's an asset financing
      if (row["Project name"]) {
        dealsAssetsData.push({
          id: `${dealId}-${projectId}`,
          dealId,
          dealName: row["Deal update"],
          assetId: projectId,
          assetName: row["Project name"],
          maturity: 0,
          equityTransactedPercentage: 0,
        });
        if (
          ![...projectsData, ...initialData.projects].find(
            (p) =>
              p.id === projectId ||
              p.name.toLowerCase() === row["Project name"].toLowerCase()
          )
        ) {
          projectsData.push({
            id: projectId,
            name: row["Project name"],
            technologies,
            segments: parseSegments(row),
            plantCapacity: parseNumber(parseFloat(row["Asset capacity (MW)"])),
            sectors: parseSectors(
              row,
              projectSector.enumValues,
              "Main sector"
            ) as ProjectSector[],
            subSectors: parseSubSectors(
              row,
              projectSubSector.enumValues
            ) as ProjectSubSector[],
            stage: parseEnum(
              row["Project lifecycle"]
                ?.toLowerCase()
                .replace("rtb", "ready_to_build")
                .replaceAll(/\s+/g, "_"),
              projectStage.enumValues
            ),
            onOffGrid:
              row["On grid/off-grid"]
                ?.toLowerCase()
                .replace("-", " ")
                .trim() === "on grid",
            // colocatedStorageCapacity: parseNumber(
            //   parseFloat(row["Co-located storage capacity"])
            // ),
            colocatedStorageCapacity: row["Co-located storage capacity"],
          });
        }
      }

      // Link deal to the company being financed
      if (row["Company"]) {
        dealsCompaniesData.push({
          id: `${dealId}-${companyId}-financing`,
          dealId,
          dealName: row["Deal update"],
          companyId,
          companyName: row.Company,
          role: "financing",
        });
        if (
          ![...companiesData, ...initialData.companies].find(
            (c) =>
              c.id === companyId ||
              c.name.toLowerCase() === row["Company"].toLowerCase()
          )
        ) {
          companiesData.push({
            id: companyId,
            name: row["Company"],
            hqCountry: country,
            countries,
            hqLocation:
              row.Latitude && row.Longitude
                ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
                : undefined,
            sectors: parseSectors(
              row,
              companySector.enumValues,
              "Main sector"
            ) as CompanySector[],
            technologies,
            subSectors: parseSubSectors(
              row,
              companySubSector.enumValues
            ) as CompanySubSector[],
          });
        }
      }

      // Link investors
      if (row["Investment companies"]) {
        const { numbers: commitments } = parseCommaSeparatedWithNumbers(
          row["Commitments by Lenders"]
        );
        row["Investment companies"]
          .split(";")
          .forEach((investorName: string, i) => {
            const investorId = generateId(investorName.trim(), "company");
            dealsCompaniesData.push({
              id: `${dealId}-${investorId}-investor`,
              dealId,
              dealName: row["Deal update"],
              companyId: investorId,
              companyName: investorName.trim(),
              role: "investor",
              investorType: parseEnum(
                row["Investor Type"]
                  ?.toLowerCase()
                  .replace("dfi", "development_finance_institution")
                  .replaceAll(/^pe$/gmi, "private_equity")
                  .replaceAll(/\s+/g, "_"),
                financingInvestorType.enumValues
              ),
              commitment: commitments[i],
            });
            if (
              ![...companiesData, ...initialData.companies].find(
                (c) =>
                  c.id === investorId ||
                  c.name.toLowerCase() === investorName.trim().toLowerCase()
              )
            ) {
              companiesData.push({ id: investorId, name: investorName.trim() });
            }
          });
      }

      // Link advisors
      if (row["Advisors"]) {
        row["Advisors"].split(";").forEach((advisorName: string, i) => {
          const advisorId = generateId(advisorName.trim(), "company");
          dealsCompaniesData.push({
            id: `${dealId}-${advisorId}-advisor`,
            dealId,
            dealName: row["Deal update"],
            companyId: advisorId,
            companyName: advisorName.trim(),
            role: "advisor",
          });
          if (
            ![...companiesData, ...initialData.companies].find(
              (c) =>
                c.id === advisorId ||
                c.name.toLowerCase() === advisorName.trim().toLowerCase()
            )
          ) {
            companiesData.push({ id: advisorId, name: advisorName.trim() });
          }
        });
      }
    });

    return [
      {
        name: "deals",
        displayName: "Financing Deals",
        icon: <Briefcase className="h-4 w-4" />,
        data: dealsData,
        columns: [
          {
            key: "update",
            label: "Deal Update",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "subtype",
            label: "Fundraising Deal Subtype",
            type: "select",
            options: [...financingTypes],
          },
          { key: "amount", label: "Amount ($M)", type: "number" },
          {
            key: "countries",
            label: "Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          { key: "onOffGrid", label: "On Grid", type: "boolean" },
          { key: "vehicle", label: "Investment Vehicle", type: "text" },
          {
            key: "objective",
            label: "Financing Objective",
            type: "select",
            options: financingObjective.enumValues,
          },
          {
            key: "status",
            label: "Fundraising Status",
            type: "select",
            options: fundraisingStatus.enumValues,
          },
          {
            key: "financingType",
            label: "Financing Type",
            type: "multiselect",
            options: dealFinancingType.enumValues,
          },
          {
            key: "financingSubtype",
            label: "Financing Subtype",
            type: "multiselect",
            options: financingSubtype.enumValues,
          },
          { key: "date", label: "Deal Date", type: "date" },
          { key: "insights", label: "Deal Comments", type: "textarea" },
          { key: "pressReleaseUrl", label: "Press Release URL", type: "url" },
        ],
        primaryKey: "id",
      } as TableData<FinancingDeal>,
      {
        name: "deals_assets",
        displayName: "Deal Assets",
        icon: <Target className="h-4 w-4" />,
        data: dealsAssetsData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            //   readonly: true,
          },
          {
            key: "assetName",
            label: "Asset",
            type: "link",
            linkTo: "projects",
            //   readonly: true,
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<NewDealAsset>,
      {
        name: "deals_companies",
        displayName: "Deal Companies",
        icon: <Handshake className="h-4 w-4" />,
        data: dealsCompaniesData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            readonly: true,
          },
          {
            key: "companyName",
            label: "Company",
            type: "link",
            linkTo: "companies",
            readonly: true,
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: [...companyRoles],
          },
          {
            key: "investorType",
            label: "Investor Type",
            type: "select",
            options: financingInvestorType.enumValues,
          },
          {
            key: "commitment",
            label: "Commitment",
            type: "number",
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<FinancingCompany>,
      {
        name: "projects",
        displayName: "Projects",
        icon: <Factory className="h-4 w-4" />,
        data: projectsData,
        columns: [
          {
            key: "name",
            label: "Project Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "country",
            label: "Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: projectSector.enumValues,
            dictionary: "common",
          },
          {
            key: "technologies",
            label: "Technologies",
            type: "multiselect",
            options: technology.enumValues,
            dictionary: "common",
          },
          
          {
            key: "subSectors",
            label: "Sub-sectors",
            type: "multiselect",
            options: projectSubSector.enumValues,
            dictionary: "common",
          },
          {
            key: "segments",
            label: "Segments",
            type: "multiselect",
            options: segment.enumValues,
          },
          {
            key: "stage",
            label: "Project Stage",
            type: "select",
            options: projectStage.enumValues,
          },
          {
            key: "colocatedStorageCapacity",
            label: "Co-located Storage Capacity (MW/MWh)",
            type: "text",
            // type: "number",
          },
          { key: "onOffGrid", label: "On Grid", type: "boolean" },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<Project>>,
      {
        name: "companies",
        displayName: "Companies",
        icon: <Building className="h-4 w-4" />,
        data: companiesData,
        columns: [
          {
            key: "name",
            label: "Company Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "hqCountry",
            label: "HQ Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "countries",
            label: "Operating Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: companySector.enumValues,
            dictionary: "common",
          },
          {
            key: "technologies",
            label: "Technologies",
            type: "multiselect",
            options: technology.enumValues,
            dictionary: "common",
          },
          {
            key: "subSectors",
            label: "Sub-sectors",
            type: "multiselect",
            options: companySubSector.enumValues,
            dictionary: "common",
          },
          {
            key: "classification",
            label: "Classification",
            type: "multiselect",
            options: companyClassification.enumValues,
          },
          {
            key: "hqLocation",
            label: "HQ Location (Latitude, Longitude)",
            type: "geography",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<NewCompany>>,
    ].filter((table) => table.data.length > 0);
  };

  const parsePPAData = (data: DataRow[]): TableData<any>[] => {
    const ppaTypes = ["utility", "ppa_corporate"] as const;
    const companyRoles = [
      "supplier",
      "grid_operator",
      "advisor",
      "offtaker",
    ] as const;

    type PPADeal = Omit<NewDeal, "type" | "subtype"> &
      BaseModel<{
        type: "power_purchase_agreement";
        subtype: (typeof ppaTypes)[number];
      }> &
      Omit<NewPowerPurchaseAgreement, "dealId">;
    type PPACompany = Omit<NewDealCompany, "role"> & {
      role: (typeof companyRoles)[number];
    };

    const dealsData: PPADeal[] = [];
    const dealsAssetsData: NewDealAsset[] = [];
    const dealsCompaniesData: PPACompany[] = [];
    const projectsData: BaseModel<Project>[] = [];
    const companiesData: BaseModel<NewCompany>[] = [];

    data.forEach((row, index) => {
      const dealId = generateId(row["Deal update"] || `deal-${index}`, "deal");
      const projectId = generateId(
        row["Asset Name Involved"] || `project-${index}`,
        "project"
      );

      const countries = convertCountriesToCodes(
        row.Country?.split(";").map((s: string) => s.trim()) || []
      );
      const location: [number, number] | undefined =
        row.Latitude && row.Longitude
          ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
          : undefined;

      dealsData.push({
        id: dealId,
        update: row["Deal update"],
        type: "power_purchase_agreement",
        subtype:
          row.Category?.toLowerCase() === "corporate"
            ? "ppa_corporate"
            : "utility",
        date: row["Announcement date"]
          ? parseDate(new Date(row["Announcement date"]))
          : undefined,
        announcementDate: row["Announcement date"]
          ? parseDate(new Date(row["Announcement date"]))
          : undefined,
        duration: parseNumber(parseInt(row["Duration (Years)"])),
        details: row["PPA"]?.toLowerCase().includes("long"),
        capacity: parseNumber(parseFloat(row["Capacity offtaken (MW)"])),
        generatedPower: parseNumber(
          parseFloat(row["Generated Power Offtaken (GWh/Yr)"])
        ),
        onOffSite: row["Onsite/Offsite PPA"]?.toLowerCase() === "onsite",
        assetOperationalDate: row["Asset Operational date"]
          ? parseDate(new Date(row["Asset Operational date"]))
          : undefined,
        supplyStart: row["Supply start Date"]
          ? parseDate(new Date(row["Supply start Date"]))
          : undefined,
        impacts: row.Impacts,
        insights: row.Insights,
        pressReleaseUrl: row["Press Release"]
          ? row["Press Release"]
          : undefined,
        countries,
      });

      if (row["Asset Name Involved"]) {
        dealsAssetsData.push({
          id: `${dealId}-${projectId}`,
          dealId,
          dealName: row["Deal update"],
          assetId: projectId,
          assetName: row["Asset Name Involved"],
        });
        if (
          ![...projectsData, ...initialData.projects].find(
            (p) =>
              p.id === projectId ||
              p.name.toLowerCase() === row["Asset Name Involved"].toLowerCase()
          )
        ) {
          projectsData.push({
            id: projectId,
            name: row["Asset Name Involved"],
            stage: parseEnum(
              row["Asset Life-Cycle"]?.toLowerCase().replaceAll(/\s+/g, "_"),
              projectStage.enumValues
            ),
            sectors: parseSectors(
              row,
              projectSector.enumValues
            ) as ProjectSector[],
            technologies: parseTechnologies(row),
            country: countries.length ? countries[0] : undefined,
            location,
          });
        }
      }

      if (row["Offtaker"]) {
        const companyId = generateId(row["Offtaker"].trim(), "company");
        dealsCompaniesData.push({
          id: `${dealId}-${companyId}-offtaker`,
          dealId,
          dealName: row["Deal update"],
          companyId,
          companyName: row["Offtaker"].trim(),
          role: "offtaker",
        });
        if (
          ![...companiesData, ...initialData.companies].find(
            (c) =>
              c.id === companyId ||
              c.name.toLowerCase() === row["Offtaker"].trim().toLowerCase()
          )
        )
          companiesData.push({
            id: companyId,
            name: row["Offtaker"].trim(),
            sectors: parseSectors(
              row,
              companySector.enumValues,
              "Offtaker sector"
            ) as CompanySector[],
            countries,
          });
      }

      if (row["Supplier (s)"]) {
        row["Supplier (s)"].split(";").forEach((name: string) => {
          const companyId = generateId(name.trim(), "company");
          dealsCompaniesData.push({
            id: `${dealId}-${companyId}-supplier`,
            dealId,
            dealName: row["Deal update"],
            companyId,
            companyName: name.trim(),
            role: "supplier",
          });
          if (
            ![...companiesData, ...initialData.companies].find(
              (c) =>
                c.id === companyId ||
                c.name.toLowerCase() === name.trim().toLowerCase()
            )
          )
            companiesData.push({ id: companyId, name: name.trim(), countries });
        });
      }

      if (row["Grid Operator"]) {
        row["Grid Operator"].split(";").forEach((name: string) => {
          const companyId = generateId(name.trim(), "company");
          dealsCompaniesData.push({
            id: `${dealId}-${companyId}-grid_operator`,
            dealId,
            dealName: row["Deal update"],
            companyId,
            companyName: name.trim(),
            role: "grid_operator",
          });
          if (
            ![...companiesData, ...initialData.companies].find(
              (c) =>
                c.id === companyId ||
                c.name.toLowerCase() === name.trim().toLowerCase()
            )
          )
            companiesData.push({ id: companyId, name: name.trim(), countries });
        });
      }

      if (row["Advisors"]) {
        row["Advisors"].split(";").forEach((name: string) => {
          const companyId = generateId(name.trim(), "company");
          dealsCompaniesData.push({
            id: `${dealId}-${companyId}-advisor`,
            dealId,
            dealName: row["Deal update"],
            companyId,
            companyName: name.trim(),
            role: "advisor",
          });
          if (
            ![...companiesData, ...initialData.companies].find(
              (c) =>
                c.id === companyId ||
                c.name.toLowerCase() === name.trim().toLowerCase()
            )
          )
            companiesData.push({ id: companyId, name: name.trim(), countries });
        });
      }
    });

    return [
      {
        name: "deals",
        displayName: "PPA Deals",
        icon: <Briefcase className="h-4 w-4" />,
        data: dealsData,
        columns: [
          { key: "update", label: "Deal Update", type: "text" },
          {
            key: "countries",
            label: "Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "subtype",
            label: "PPA Category",
            type: "select",
            options: [...ppaTypes],
          },
          { key: "duration", label: "Duration (Yrs)", type: "number" },
          { key: "capacity", label: "Capacity Offtaken (MW)", type: "number" },
          { key: "details", label: "Long-term PPA?", type: "boolean" },
          {
            key: "generatedPower",
            label: "Generated Power Offtaken (GWh/Yr)",
            type: "number",
          },
          { key: "announcementDate", label: "Announcement Date", type: "date" },
          { key: "supplyStart", label: "Supply Start Date", type: "date" },
          {
            key: "assetOperationalDate",
            label: "Asset Operational date",
            type: "date",
          },
          { key: "impacts", label: "Impacts", type: "textarea" },
          { key: "insights", label: "Insights", type: "textarea" },
          { key: "pressReleaseUrl", label: "Press Release", type: "url" },
        ],
        primaryKey: "id",
      } as TableData<PPADeal>,
      {
        name: "deals_assets",
        displayName: "Deal Assets",
        icon: <Target className="h-4 w-4" />,
        data: dealsAssetsData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            //   readonly: true,
          },
          {
            key: "assetName",
            label: "Asset",
            type: "link",
            linkTo: "projects",
            //   readonly: true,
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<NewDealAsset>,
      {
        name: "deals_companies",
        displayName: "Deal Companies",
        icon: <Handshake className="h-4 w-4" />,
        data: dealsCompaniesData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            readonly: true,
          },
          {
            key: "companyName",
            label: "Company",
            type: "link",
            linkTo: "companies",
            readonly: true,
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: [...companyRoles],
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<PPACompany>,
      {
        name: "projects",
        displayName: "Projects",
        icon: <Factory className="h-4 w-4" />,
        data: projectsData,
        columns: [
          {
            key: "name",
            label: "Project Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "country",
            label: "Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: projectSector.enumValues,
            dictionary: "common",
          },
          {
            key: "technologies",
            label: "Technologies",
            type: "multiselect",
            options: technology.enumValues,
            dictionary: "common",
          },
          {
            key: "stage",
            label: "Project Stage",
            type: "select",
            options: projectStage.enumValues,
          },
          {
            key: "location",
            label: "Location (Latitude, Longitude)",
            type: "geography",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<Project>>,
      {
        name: "companies",
        displayName: "Companies",
        icon: <Building className="h-4 w-4" />,
        data: companiesData,
        columns: [
          {
            key: "name",
            label: "Company Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "countries",
            label: "Operating Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: companySector.enumValues,
            dictionary: "common",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<NewCompany>>,
    ].filter((table) => table.data.length > 0);
  };

  const parseJVData = (data: DataRow[]): TableData<any>[] => {
    const jvTypes = [
      "joint_venture",
      "strategic_partnership_agreement",
      "strategic_collaboration",
    ] as const;
    const companyRoles = ["joint_venture"] as const;

    type JointVentureDeal = Omit<NewDeal, "type" | "subtype"> &
      BaseModel<{ type: "joint_venture"; subtype?: (typeof jvTypes)[number] }> &
      Omit<NewJointVenture, "dealId">;
    type JointVentureCompany = Omit<NewDealCompany, "role"> & {
      role: (typeof companyRoles)[number];
    };
    const dealsData: JointVentureDeal[] = [];
    const dealsAssetsData: NewDealAsset[] = [];
    const dealsCompaniesData: JointVentureCompany[] = [];
    const projectsData: BaseModel<Project>[] = [];
    const companiesData: BaseModel<NewCompany>[] = [];

    data.forEach((row, index) => {
      const dealId = generateId(row["Deal update"] || `deal-${index}`, "deal");

      const countries = convertCountriesToCodes(
        row.Country?.split(";").map((s: string) => s.trim()) || []
      );
      const onOffGrid =
        row["On grid/ Off-grid"]?.toLowerCase().replace("-", " ").trim() ===
        "on grid";
      const location: [number, number] | undefined =
        row.Latitude && row.Longitude
          ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
          : undefined;

      dealsData.push({
        id: dealId,
        update: row["Deal update"],
        type: "joint_venture",
        subtype: parseEnum(
          row["Deal type"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          [...jvTypes]
        ),
        amount: parseNumber(parseFloat(row["Amount (million $)"])),
        date: row["Announcement Date"]
          ? parseDate(new Date(row["Announcement Date"]))
          : undefined,
        announcementDate: row["Announcement Date"]
          ? parseDate(new Date(row["Announcement Date"]))
          : undefined,
        description: row["Deals summary"],
        partnershipObjectives: filterArray(
          toArray(row["Partnership objective"]),
          partnershipObjective.enumValues
        ),
        // onOffGrid,
        pressReleaseUrl: row["Press Release"]
          ? row["Press Release"]
          : undefined,
      });

      if (row["Assets name"]) {
        const projectId = generateId(row["Assets name"], "project");
        dealsAssetsData.push({
          id: `${dealId}-${projectId}`,
          dealId,
          dealName: row["Deal update"],
          assetId: projectId,
          assetName: row["Assets name"],
        });
        if (
          ![...projectsData, ...initialData.projects].find(
            (p) =>
              p.id === projectId ||
              p.name.toLowerCase() === row["Assets name"].toLowerCase()
          )
        ) {
          projectsData.push({
            id: projectId,
            name: row["Assets name"],
            sectors: parseSectors(
              row,
              projectSector.enumValues
            ) as ProjectSector[],
            technologies: parseTechnologies(row),
            segments: parseSegments(row),
            plantCapacity: parseNumber(parseFloat(row["Asset Capacity (MW)"])),
            stage: parseEnum(
              (row["Asset life-cycle"]
                ? row["Asset life-cycle"]
                : row["Development stage"]
              )
                ?.toLowerCase()
                .replace("rtb", "ready_to_build")
                .replaceAll(/\s+/g, "_"),
              projectStage.enumValues
            ),
            onOffGrid,
            country: countries.length ? countries[0] : undefined,
            location,
          });
        }
      }

      if (row["Companies in the deal"]) {
        row["Companies in the deal"]
          .split(";")
          .forEach((name: string, i: number) => {
            const companyId = generateId(name.trim(), "company");
            dealsCompaniesData.push({
              id: `${dealId}-${companyId}-joint_venture`,
              dealId,
              dealName: row["Deal update"],
              companyId,
              companyName: name.trim(),
              role: "joint_venture",
            });
            if (
              ![...companiesData, ...initialData.companies].find(
                (c) =>
                  c.id === companyId ||
                  c.name.toLowerCase() === name.trim().toLowerCase()
              )
            ) {
              companiesData.push({
                id: companyId,
                name: name.trim(),
                countries,
                hqCountry:
                  countries.length > i
                    ? countries[i]
                    : countries.length
                    ? countries[0]
                    : undefined,
                hqLocation: location,
              });
            }
          });
      }
    });

    return [
      {
        name: "deals",
        displayName: "JV Deals",
        icon: <Briefcase className="h-4 w-4" />,
        data: dealsData,
        columns: [
          { key: "update", label: "Deal Update", type: "text" },
          {
            key: "subtype",
            label: "JV Deal Subtype",
            type: "select",
            options: [...jvTypes],
          },
          {
            key: "countries",
            label: "Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          { key: "amount", label: "Amount ($M)", type: "number" },
          {
            key: "partnershipObjectives",
            label: "Objectives",
            type: "multiselect",
            options: partnershipObjective.enumValues,
          },
          { key: "announcementDate", label: "Announcement Date", type: "date" },
          { key: "description", label: "Summary", type: "textarea" },
          { key: "pressReleaseUrl", label: "Press Release URL", type: "url" },
        ],
        primaryKey: "id",
      } as TableData<JointVentureDeal>,
      {
        name: "deals_assets",
        displayName: "Deal Assets",
        icon: <Target className="h-4 w-4" />,
        data: dealsAssetsData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            //   readonly: true,
          },
          {
            key: "assetName",
            label: "Asset",
            type: "link",
            linkTo: "projects",
            //   readonly: true,
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<NewDealAsset>,
      {
        name: "deals_companies",
        displayName: "Deal Companies",
        icon: <Handshake className="h-4 w-4" />,
        data: dealsCompaniesData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            readonly: true,
          },
          {
            key: "companyName",
            label: "Company",
            type: "link",
            linkTo: "companies",
            readonly: true,
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: [...companyRoles],
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<JointVentureCompany>,
      {
        name: "projects",
        displayName: "Projects",
        icon: <Factory className="h-4 w-4" />,
        data: projectsData,
        columns: [
          {
            key: "name",
            label: "Project Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "country",
            label: "Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: projectSector.enumValues,
            dictionary: "common",
          },
          {
            key: "technologies",
            label: "Technologies",
            type: "multiselect",
            options: technology.enumValues,
            dictionary: "common",
          },
          {
            key: "segments",
            label: "Segments",
            type: "multiselect",
            options: segment.enumValues,
            dictionary: "common",
          },
          {
            key: "stage",
            label: "Project Stage",
            type: "select",
            options: projectStage.enumValues,
          },
          { key: "onOffGrid", label: "On Grid ?", type: "boolean" },
          {
            key: "location",
            label: "Location (Latitude, Longitude)",
            type: "geography",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<Project>>,
      {
        name: "companies",
        displayName: "Companies",
        icon: <Building className="h-4 w-4" />,
        data: companiesData,
        columns: [
          {
            key: "name",
            label: "Company Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "hqCountry",
            label: "HQ Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "countries",
            label: "Operating Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "classification",
            label: "Classification",
            type: "multiselect",
            options: companyClassification.enumValues,
          },
          {
            key: "hqLocation",
            label: "HQ Location (Latitude, Longitude)",
            type: "geography",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<NewCompany>>,
    ].filter((table) => table.data.length > 0);
  };

  const parseProjectUpdateData = (data: DataRow[]): TableData<any>[] => {
    const projectDealTypes = [
      "early_stage",
      "late_stage",
      "ready_to_build",
      "in_construction",
      "operational",
      "proposal",
    ] as const;

    type ProjectUpdateDeal = Omit<NewDeal, "type" | "subtype"> &
      BaseModel<{
        type: "project_update";
        subtype?: (typeof projectDealTypes)[number];
      }>;
    const dealsData: ProjectUpdateDeal[] = [];
    const projectsData: BaseModel<Project>[] = [];
    const dealsAssetsData: NewDealAsset[] = [];
    const projectsCompaniesData: (ModelWithId<NewProjectCompany> & {
      projectName: string;
      companyName: string;
    })[] = [];
    const companiesData: BaseModel<NewCompany>[] = [];

    data.forEach((row, index) => {
      const dealId = generateId(row["Deal update"] || `deal-${index}`, "deal");
      const projectId = generateId(
        row["Project Name"] || `project-${index}`,
        "project"
      );

      const countries = convertCountriesToCodes(
        row.Country?.split(";").map((s: string) => s.trim()) || []
      );
      const onOffGrid =
        row["On grid/Off grid"]?.toLowerCase().replace("-", " ").trim() ===
        "on grid";

      dealsData.push({
        id: dealId,
        update: row["Deal update"],
        type: "project_update",
        subtype: parseEnum(
          row["Project stage"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          [...projectDealTypes]
        ),
        countries,
        date: row.Date ? parseDate(new Date(row.Date)) : undefined,
        insights: row["Insights/Comments"],
        impacts: row.Impacts,
        // onOffGrid,
        pressReleaseUrl: row["Press Release"]
          ? row["Press Release"]
          : undefined,
      });

      const {
        names: financingStrategyNames,
        numbers: financingStrategyValues,
      } = parseCommaSeparatedWithNumbers(row["Financing strategy"] || "");
      const {
        names: evaluationCriteriaNames,
        numbers: evaluationCriteriaValues,
      } = parseCommaSeparatedWithNumbers(row["Evaluation criteria"] || "");

      projectsData.push({
        id: projectId,
        name: row["Project Name"],
        country: countries.length ? countries[0] : undefined,
        sectors: parseSectors(row, projectSector.enumValues) as ProjectSector[],
        technologies: parseTechnologies(row),
        subSectors: parseSubSectors(row) as ProjectSubSector[],
        segments: parseSegments(row),
        investmentCosts: parseNumber(
          parseFloat(row["Project Investment ($ million)"])
        ),
        plantCapacity: parseNumber(parseFloat(row["Plant capacity (MW)"])),
        stage: parseEnum(
          row["Project stage"]
            ?.toLowerCase()
            .replace("rtb", "ready_to_build")
            .replaceAll(/\s+/g, "_"),
          projectStage.enumValues
        ),
        milestone: parseProjectMilestone(row),
        status: parseEnum(
          row["Project status"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          projectStatus.enumValues
        ),
        ...parseRevenueModel(row),
        onOffGrid,
        onOffShore: row["Onshore/Offshore"]?.toLowerCase().includes("onshore"),
        financingStrategy: financingStrategyNames.reduce((acc, key, i) => {
          const parsedKey = parseEnum(key.toLowerCase().trim(), [
            ...PROJECT_FINANCING_STRATEGIES,
          ]);
          if (parsedKey) {
            acc[parsedKey] = financingStrategyValues[i];
          }
          return acc;
        }, {} as ProjectFinancingStrategy),
        contractType: filterArray(
          toArray(row["Contract type"]),
          projectContractType.enumValues
        ),
        colocatedStorage: row["Co-located storage"]?.toLowerCase() === "yes",
        colocatedStorageCapacity: row["Co-located storage capacity"],
        // colocatedStorageCapacity: parseNumber(
        //   parseFloat(row["Co-located storage capacity"])
        // ),
        fundingSecured: row["Financing secured"]?.toLowerCase() === "yes",
        impacts: row.Impacts,
        insights: row["Insights/Comments"],
        features: row.Features,
        constructionStart: row["Start Construction date"]
          ? parseDate(new Date(row["Start Construction date"]))
          : undefined,
        operationalDate: row["Operational date"]
          ? parseDate(new Date(row["Operational date"]))
          : undefined,
        location:
          row.Latitude && row.Longitude
            ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
            : undefined,
        transmissionInfrastructureDetails:
          row["Transmission infrastructure details"],
        ppaSigned: row["PPA Signed"]?.toLowerCase() === "yes",
        financialClosingDate: row["FInancial Close date"]
          ? parseDate(new Date(row["FInancial Close date"]))
          : undefined,
        eiaApproved: row["EIA approval received"]?.toLowerCase() === "yes",
        gridConnectionApproved:
          row["Grid connection approved"]?.toLowerCase() === "yes",
        tenderObjective: parseEnum(
          row["Tender objective"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          projectTenderObjective.enumValues
        ),
        bidSubmissionDeadline: row["Bid submission deadline"]
          ? parseDate(new Date(row["Bid submission deadline"]))
          : undefined,
        bidsReceived: parseNumber(parseInt(row["Nber of bids received"])),
        winningBid: parseNumber(parseFloat(row["Winning bid price"])),
        evaluationCriteria: evaluationCriteriaNames.reduce((acc, key, i) => {
          const parsedKey = parseEnum(key.toLowerCase().trim(), [
            ...PROPOSAL_EVALUATION_CRITERIA,
          ]);
          if (parsedKey) {
            acc[parsedKey] = evaluationCriteriaValues[i];
          }
          return acc;
        }, {} as ProposalEvaluationCriteria),
      });

      dealsAssetsData.push({
        id: `${dealId}-${projectId}`,
        dealId,
        dealName: row["Deal update"],
        assetId: projectId,
        assetName: row["Project Name"],
      });

      const companyRoles: { field: string; role: ProjectCompanyRole }[] = [
        { field: "Grid Operator", role: "grid_operator" },
        { field: "SPV", role: "special_purpose_vehicle" },
        { field: "Sponsors", role: "sponsor" },
        { field: "Lenders", role: "lender" },
        { field: "Advisors", role: "advisor" },
        { field: "Contractor (EPC)", role: "contractor" },
        { field: "O&M", role: "operations_maintenance" },
        { field: "Equipment Supplier", role: "equipment_supplier" },
        { field: "Procurement officer", role: "procurement_officer" },
        { field: "Winner of the tender", role: "tender_winner" },
      ];
      companyRoles.forEach(({ field, role }) => {
        if (row[field]) {
          row[field].split(";").forEach((name: string) => {
            const sponsor = role === "sponsor" ? parseSponsor(name) : {};
            const companyName = (
              role === "sponsor" ? (sponsor as Sponsor)?.name : name
            ).trim();
            const companyId = generateId(companyName, "company");
            projectsCompaniesData.push({
              id: `${projectId}-${companyId}-${role}`,
              projectId,
              projectName: row["Project Name"],
              companyId,
              companyName,
              role,
              ...sponsor,
            });
            if (
              ![...companiesData, ...initialData.companies].find(
                (c) =>
                  c.id === companyId ||
                  c.name.toLowerCase() === name.trim().toLowerCase() ||
                  c.name.toLowerCase() === companyName.toLowerCase()
              )
            ) {
              let company: BaseModel<NewCompany> = {
                id: companyId,
                name: companyName,
              };
              if (role === "sponsor") {
                company = {
                  ...company,
                  countries,
                };
              }
              companiesData.push(company);
            }
          });
        }
      });
    });

    return [
      {
        name: "deals",
        displayName: "Project Updates (Deals)",
        icon: <Briefcase className="h-4 w-4" />,
        data: dealsData,
        columns: [
          { key: "update", label: "Deal Update", type: "text" },
          {
            key: "subtype",
            label: "Project Stage",
            type: "select",
            options: [...projectDealTypes],
            dictionary: "common",
          },
          {
            key: "countries",
            label: "Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          { key: "onOffGrid", label: "On Grid", type: "boolean" },
          { key: "date", label: "Deal Date", type: "date" },
          { key: "insights", label: "Insights/Comments", type: "textarea" },
          { key: "impacts", label: "Impacts", type: "textarea" },
          { key: "pressReleaseUrl", label: "Press Release URL", type: "url" },
        ],
        primaryKey: "id",
      } as TableData<ProjectUpdateDeal>,
      {
        name: "projects",
        displayName: "Projects",
        icon: <Factory className="h-4 w-4" />,
        data: projectsData,
        columns: [
          {
            key: "name",
            label: "Project Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "country",
            label: "Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "stage",
            label: "Project Stage",
            type: "select",
            options: projectStage.enumValues,
          },
          {
            key: "plantCapacity",
            label: "Plant Capacity (MW)",
            type: "number",
          },
          {
            key: "investmentCosts",
            label: "Investment ($M)",
            type: "number",
          },
          {
            key: "milestone",
            label: "Project Milestone",
            type: "text",
            // type: "select",
            // options: projectMilestone.enumValues,
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: projectStatus.enumValues,
          },
          {
            key: "revenueModel",
            label: "Revenue Model",
            type: "select",
            options: revenueModel.enumValues,
          },
          {
            key: "revenueModelDuration",
            label: "Revenue Model Duration (Yrs)",
            type: "number",
          },
          {
            key: "contractType",
            label: "Contract Type",
            type: "multiselect",
            options: projectContractType.enumValues,
          },
          { key: "onOffGrid", label: "On Grid", type: "boolean" },
          { key: "onOffShore", label: "Onshore", type: "boolean" },
          {
            key: "colocatedStorage",
            label: "Co-located Storage",
            type: "boolean",
          },
          {
            key: "colocatedStorageCapacity",
            label: "Co-located Storage Capacity (MW/MWh)",
            type: "text",
            // type: "number",
          },
          {
            key: "financingStrategy",
            label: "Financing Strategy (Debt/Equity/Grant %)",
            type: "json",
            tooltip: "Debt (70%), Equity(30%)",
          },
          { key: "fundingSecured", label: "Funding Secured", type: "boolean" },
          {
            key: "transmissionInfrastructureDetails",
            label: "Transmission Details",
            type: "textarea",
          },
          { key: "ppaSigned", label: "PPA Signed", type: "boolean" },
          { key: "eiaApproved", label: "EIA Approved", type: "boolean" },
          {
            key: "gridConnectionApproved",
            label: "Grid Connection Approved",
            type: "boolean",
          },
          {
            key: "financialClosingDate",
            label: "Financial Close Date",
            type: "date",
          },
          {
            key: "constructionStart",
            label: "Construction Start",
            type: "date",
          },
          { key: "operationalDate", label: "Operational Date", type: "date" },
          {
            key: "proposal.tenderObjective",
            label: "Tender Objective",
            type: "select",
            options: projectTenderObjective.enumValues,
          },
          {
            key: "bidSubmissionDeadline",
            label: "Bid Submission Deadline",
            type: "date",
          },
          {
            key: "evaluationCriteria",
            label: "Evaluation Criteria (Technical/Financial %)",
            type: "json",
            tooltip: "Technical (80%), Financial (20%)",
          },
          {
            key: "bidsReceived",
            label: "Number of Bids Received",
            type: "number",
          },
          {
            key: "winningBid",
            label: "Winning Bid Price ($/kWh)",
            type: "number",
          },
          { key: "description", label: "Project Summary", type: "textarea" },
          { key: "features", label: "Features", type: "text" },
          { key: "insights", label: "Insights/Comments", type: "textarea" },
          { key: "impacts", label: "Impacts", type: "textarea" },
          {
            key: "location",
            label: "Location (Latitude, Longitude)",
            type: "geography",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<Project>>,
      {
        name: "deals_assets",
        displayName: "Deal Assets",
        icon: <Target className="h-4 w-4" />,
        data: dealsAssetsData,
        columns: [
          {
            key: "dealName",
            label: "Deal",
            type: "link",
            linkTo: "deals",
            //   readonly: true,
          },
          {
            key: "assetName",
            label: "Asset",
            type: "link",
            linkTo: "projects",
            //   readonly: true,
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<NewDealAsset>,
      {
        name: "projects_companies",
        displayName: "Project Companies",
        icon: <Handshake className="h-4 w-4" />,
        data: projectsCompaniesData,
        columns: [
          {
            key: "projectName",
            label: "Project",
            type: "link",
            linkTo: "projects",
            readonly: true,
          },
          {
            key: "companyName",
            label: "Company",
            type: "link",
            linkTo: "companies",
            readonly: true,
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: projectCompanyRole.enumValues,
          },
          {
            key: "equityAmount",
            label: "Equity Amount ($M)",
            type: "number",
          },
          {
            key: "percentageOwnership",
            label: "Percentage Ownership (%)",
            type: "number",
          },
          {
            key: "details",
            label: "Details",
            type: "text",
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<NewProjectCompany>,
      {
        name: "companies",
        displayName: "Companies",
        icon: <Building className="h-4 w-4" />,
        data: companiesData,
        columns: [
          {
            key: "name",
            label: "Company Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "countries",
            label: "Operating Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "classification",
            label: "Classification",
            type: "multiselect",
            options: companyClassification.enumValues,
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<NewCompany>>,
    ].filter((table) => table.data.length > 0);
  };

  const parseProjectData = (data: DataRow[]): TableData<any>[] => {
    const projectsData: BaseModel<Project>[] = [];
    const projectsCompaniesData: (ModelWithId<NewProjectCompany> & {
      projectName: string;
      companyName: string;
    })[] = [];
    const companiesData: BaseModel<NewCompany>[] = [];

    data.forEach((row, index) => {
      const projectId = generateId(
        row["Project Name"] || `project-${index}`,
        "project"
      );

      const countries = convertCountriesToCodes(
        row.Country?.split(";").map((s: string) => s.trim()) || []
      );

      const {
        names: financingStrategyNames,
        numbers: financingStrategyValues,
      } = parseCommaSeparatedWithNumbers(row["Financing strategy"] || "");
      const {
        names: evaluationCriteriaNames,
        numbers: evaluationCriteriaValues,
      } = parseCommaSeparatedWithNumbers(row["Evaluation criteria"] || "");

      projectsData.push({
        id: projectId,
        name: row["Project Name"],
        country: countries.length ? countries[0] : undefined,
        sectors: parseSectors(row, projectSector.enumValues) as ProjectSector[],
        technologies: parseTechnologies(row),
        subSectors: parseSubSectors(row) as ProjectSubSector[],
        segments: parseSegments(row),
        investmentCosts: parseNumber(
          parseFloat(row["Project Investment ($ million)"])
        ),
        plantCapacity: parseNumber(parseFloat(row["Plant capacity (MW)"])),
        stage: parseEnum(
          (row["Project stage"] ? row["Project stage"] : row["Project Stage"])
            ?.toLowerCase()
            .replace("rtb", "ready_to_build")
            .replaceAll(/\s+/g, "_"),
          projectStage.enumValues
        ),
        milestone: parseProjectMilestone(row),
        status: parseEnum(
          row["Project status"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          projectStatus.enumValues
        ),
        ...parseRevenueModel(row),
        onOffGrid:
          row["On grid/Off grid"]?.toLowerCase().replace("-", " ").trim() ===
          "on grid",
        onOffShore: row["Onshore/Offshore"]?.toLowerCase().includes("onshore"),
        financingStrategy: financingStrategyNames.reduce((acc, key, i) => {
          const parsedKey = parseEnum(key.toLowerCase().trim(), [
            ...PROJECT_FINANCING_STRATEGIES,
          ]);
          if (parsedKey) {
            acc[parsedKey] = financingStrategyValues[i];
          }
          return acc;
        }, {} as ProjectFinancingStrategy),
        contractType: filterArray(
          toArray(row["Contract type"]),
          projectContractType.enumValues
        ),
        colocatedStorage: row["Co-located storage"]?.toLowerCase() === "yes",
        colocatedStorageCapacity: row["Co-located storage capacity"],
        // colocatedStorageCapacity: parseNumber(
        //   parseFloat(row["Co-located storage capacity"])
        // ),
        fundingSecured: row["Financing secured"]?.toLowerCase() === "yes",
        impacts: row.Impacts,
        insights: row.Comments,
        features: row.Features,
        constructionStart: row["Start Construction date"]
          ? parseDate(new Date(row["Start Construction date"]))
          : undefined,
        operationalDate: row["Operational date"]
          ? parseDate(new Date(row["Operational date"]))
          : undefined,
        location:
          row.Latitude && row.Longitude
            ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
            : undefined,
        transmissionInfrastructureDetails:
          row["Transmission infrastructure details"],
        ppaSigned: row["PPA Signed"]?.toLowerCase() === "yes",
        financialClosingDate: row["FInancial Close date"]
          ? parseDate(new Date(row["FInancial Close date"]))
          : undefined,
        eiaApproved: row["EIA approval received"]?.toLowerCase() === "yes",
        gridConnectionApproved:
          row["Grid connection approved"]?.toLowerCase() === "yes",
        tenderObjective: parseEnum(
          row["Tender objective"]?.toLowerCase().replaceAll(/\s+/g, "_"),
          projectTenderObjective.enumValues
        ),
        bidSubmissionDeadline: row["Bid submission deadline"]
          ? parseDate(new Date(row["Bid submission deadline"]))
          : undefined,
        bidsReceived: parseNumber(parseInt(row["Nber of bids received"])),
        winningBid: parseNumber(parseFloat(row["Winning bid price"])),
        evaluationCriteria: evaluationCriteriaNames.reduce((acc, key, i) => {
          const parsedKey = parseEnum(key.toLowerCase().trim(), [
            ...PROPOSAL_EVALUATION_CRITERIA,
          ]);
          if (parsedKey) {
            acc[parsedKey] = evaluationCriteriaValues[i];
          }
          return acc;
        }, {} as ProposalEvaluationCriteria),
      });

      const companyRoles: { field: string; role: ProjectCompanyRole }[] = [
        { field: "Grid Operator", role: "grid_operator" },
        { field: "SPV", role: "special_purpose_vehicle" },
        { field: "Sponsors", role: "sponsor" },
        { field: "Lenders", role: "lender" },
        { field: "Advisors", role: "advisor" },
        { field: "Contractor (EPC)", role: "contractor" },
        { field: "O&M", role: "operations_maintenance" },
        { field: "Equipment Supplier", role: "equipment_supplier" },
        { field: "Procurement officer", role: "procurement_officer" },
        { field: "Winner of the tender", role: "tender_winner" },
      ];
      companyRoles.forEach(({ field, role }) => {
        if (row[field]) {
          row[field].split(";").forEach((name: string) => {
            const sponsor = role === "sponsor" ? parseSponsor(name) : {};
            const companyName = (
              role === "sponsor" ? (sponsor as Sponsor)?.name : name
            ).trim();
            const companyId = generateId(companyName, "company");
            projectsCompaniesData.push({
              id: `${projectId}-${companyId}-${role}`,
              projectId,
              projectName: row["Project Name"],
              companyId,
              companyName,
              role,
              ...sponsor,
            });
            if (
              ![...companiesData, ...initialData.companies].find(
                (c) =>
                  c.id === companyId ||
                  c.name.toLowerCase() === name.trim().toLowerCase() ||
                  c.name.toLowerCase() === companyName.toLowerCase()
              )
            ) {
              let company: BaseModel<NewCompany> = {
                id: companyId,
                name: companyName,
              };
              if (role === "sponsor") {
                company = {
                  ...company,
                  countries,
                };
              }
              companiesData.push(company);
            }
          });
        }
      });
    });

    return [
      {
        name: "projects",
        displayName: "Projects",
        icon: <Factory className="h-4 w-4" />,
        data: projectsData,
        columns: [
          {
            key: "name",
            label: "Project Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "country",
            label: "Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: projectSector.enumValues,
            dictionary: "common",
          },
          {
            key: "technologies",
            label: "Technologies",
            type: "multiselect",
            options: technology.enumValues,
            dictionary: "common",
          },
          {
            key: "subSectors",
            label: "Sub-sectors",
            type: "multiselect",
            options: projectSubSector.enumValues,
            dictionary: "common",
          },
          {
            key: "stage",
            label: "Project Stage",
            type: "select",
            options: projectStage.enumValues,
          },
          {
            key: "plantCapacity",
            label: "Plant Capacity (MW)",
            type: "number",
          },
          {
            key: "investmentCosts",
            label: "Investment ($M)",
            type: "number",
          },
          {
            key: "milestone",
            label: "Project Milestone",
            type: "text",
            // type: "select",
            // options: projectMilestone.enumValues,
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: projectStatus.enumValues,
          },
          {
            key: "revenueModel",
            label: "Revenue Model",
            type: "select",
            options: revenueModel.enumValues,
          },
          {
            key: "revenueModelDuration",
            label: "Revenue Model Duration (Yrs)",
            type: "number",
          },
          {
            key: "contractType",
            label: "Contract Type",
            type: "multiselect",
            options: projectContractType.enumValues,
          },
          { key: "onOffGrid", label: "On Grid", type: "boolean" },
          { key: "onOffShore", label: "Onshore", type: "boolean" },
          {
            key: "colocatedStorage",
            label: "Co-located Storage",
            type: "boolean",
          },
          {
            key: "colocatedStorageCapacity",
            label: "Co-located Storage Capacity (MW/MWh)",
            type: "text",
            // type: "number",
          },
          {
            key: "financingStrategy",
            label: "Financing Strategy (Debt/Equity/Grant %)",
            type: "json",
            tooltip: "Debt (70%), Equity(30%)",
          },
          { key: "fundingSecured", label: "Funding Secured", type: "boolean" },
          {
            key: "transmissionInfrastructureDetails",
            label: "Transmission Details",
            type: "textarea",
          },
          { key: "ppaSigned", label: "PPA Signed", type: "boolean" },
          { key: "eiaApproved", label: "EIA Approved", type: "boolean" },
          {
            key: "gridConnectionApproved",
            label: "Grid Connection Approved",
            type: "boolean",
          },
          {
            key: "financialClosingDate",
            label: "Financial Close Date",
            type: "date",
          },
          {
            key: "constructionStart",
            label: "Construction Start",
            type: "date",
          },
          { key: "operationalDate", label: "Operational Date", type: "date" },
          {
            key: "proposal.tenderObjective",
            label: "Tender Objective",
            type: "select",
            options: projectTenderObjective.enumValues,
          },
          {
            key: "bidSubmissionDeadline",
            label: "Bid Submission Deadline",
            type: "date",
          },
          {
            key: "evaluationCriteria",
            label: "Evaluation Criteria (Technical/Financial %)",
            type: "json",
            tooltip: "Technical (80%), Financial (20%)",
          },
          {
            key: "bidsReceived",
            label: "Number of Bids Received",
            type: "number",
          },
          {
            key: "winningBid",
            label: "Winning Bid Price ($/kWh)",
            type: "number",
          },
          { key: "description", label: "Project Summary", type: "textarea" },
          { key: "features", label: "Features", type: "text" },
          { key: "insights", label: "Insights/Comments", type: "textarea" },
          { key: "impacts", label: "Impacts", type: "textarea" },
          {
            key: "location",
            label: "Location (Latitude, Longitude)",
            type: "geography",
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<Project>>,
      {
        name: "projects_companies",
        displayName: "Project Companies",
        icon: <Handshake className="h-4 w-4" />,
        data: projectsCompaniesData,
        columns: [
          {
            key: "projectName",
            label: "Project",
            type: "link",
            linkTo: "projects",
            readonly: true,
          },
          {
            key: "companyName",
            label: "Company",
            type: "link",
            linkTo: "companies",
            readonly: true,
          },
          {
            key: "role",
            label: "Role",
            type: "select",
            options: projectCompanyRole.enumValues,
          },
          {
            key: "equityAmount",
            label: "Equity Amount ($M)",
            type: "number",
          },
          {
            key: "percentageOwnership",
            label: "Percentage Ownership (%)",
            type: "number",
          },
          {
            key: "details",
            label: "Details",
            type: "text",
          },
        ],
        primaryKey: "id",
        isRelationship: true,
      } as TableData<NewProjectCompany>,
      {
        name: "companies",
        displayName: "Companies",
        icon: <Building className="h-4 w-4" />,
        data: companiesData,
        columns: [
          {
            key: "name",
            label: "Company Name",
            type: "text",
            required: true,
            id: true,
          },
          {
            key: "countries",
            label: "Operating Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "classification",
            label: "Classification",
            type: "multiselect",
            options: companyClassification.enumValues,
          },
        ],
        primaryKey: "id",
      } as TableData<BaseModel<NewCompany>>,
    ].filter((table) => table.data.length > 0);
  };

  const parseCompanyData = (
    data: DataRow[]
  ): TableData<BaseModel<NewCompany>>[] => {
    const companiesData: BaseModel<NewCompany>[] = data.map((row, index) => {
      const companyId = generateId(
        row["Company Name"] || `company-${index}`,
        "company"
      );
      return {
        id: companyId,
        name: row["Company Name"],
        operatingStatus: filterArray(
          toArray(row["Operating status"]),
          companyOperatingStatus.enumValues
        ),
        classification: filterArray(
          row.Classification?.trim()
            .toLowerCase()
            .split(";")
            .map((s) =>
              s
                .trim()
                .replaceAll(/\s+/g, "_")
                .replaceAll(/[/-]/g, "_")
                .replace("ipp", "independent_power_producer")
                .replace("dfi", "development_finance_institution")
            ) || [],
          companyClassification.enumValues
        ),
        sectors: parseSectors(row, companySector.enumValues) as CompanySector[],
        subSectors: parseSubSectors(
          row,
          companySubSector.enumValues,
          "Subsector"
        ) as CompanySubSector[],
        technologies: parseTechnologies(row),
        hqCountry: convertCountryToCode(row["HQ Country"]),
        hqAddress: row["HQ Address"],
        countries: convertCountriesToCodes(
          row["Operating Countries"]?.split(";").map((s: string) => s.trim()) ||
            []
        ),
        description: row["About"],
        foundingDate: row["Founded date"]
          ? parseDate(new Date(row["Founded date"]))
          : undefined,
        activities: filterArray(
          toArray(row["Main Activities"].replaceAll(",", ";")),
          companyActivity.enumValues
        ),
        size: parseEnum(row["Company size"], companySize.enumValues),
        website: row.Website,
        linkedinProfile: row.LinkedIn ? row.LinkedIn : undefined,
        xProfile: row.Twitter ? row.Twitter : undefined,
        facebookProfile: row.Facebook ? row.Facebook : undefined,
        hqLocation:
          row.Latitude && row.Longitude
            ? [parseFloat(row.Longitude), parseFloat(row.Latitude)]
            : undefined,
        logoUrl: row["Icon/Logo URL"] ? row["Icon/Logo URL"] : undefined,
      };
    });

    return [
      {
        name: "companies",
        displayName: "Companies",
        icon: <Building className="h-4 w-4" />,
        data: companiesData,
        columns: [
          {
            key: "name",
            label: "Company Name",
            type: "text",
            required: true,
            id: true,
          },
          { key: "description", label: "About", type: "textarea" },
          {
            key: "operatingStatus",
            label: "Operating Status",
            type: "multiselect",
            options: companyOperatingStatus.enumValues,
          },
          {
            key: "classification",
            label: "Classification",
            type: "multiselect",
            options: companyClassification.enumValues,
          },
          {
            key: "hqCountry",
            label: "HQ Country",
            type: "select",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          { key: "hqAddress", label: "HQ Address", type: "text" },
          {
            key: "countries",
            label: "Countries",
            type: "multiselect",
            options: countryCode.enumValues.map((c) => ({
              label: t(`common.countries.${c}`),
              value: c,
            })),
            dictionary: "common",
          },
          {
            key: "sectors",
            label: "Sectors",
            type: "multiselect",
            options: companySector.enumValues,
            dictionary: "common",
          },
          {
            key: "subSectors",
            label: "Sub-sectors",
            type: "multiselect",
            options: companySubSector.enumValues,
            dictionary: "common",
          },
          {
            key: "technologies",
            label: "Technologies",
            type: "multiselect",
            options: technology.enumValues,
            dictionary: "common",
          },
          { key: "foundingDate", label: "Founding Date", type: "date" },
          {
            key: "activities",
            label: "Main Activities",
            type: "multiselect",
            options: companyActivity.enumValues,
          },
          {
            key: "size",
            label: "Company Size",
            type: "select",
            options: companySize.enumValues,
          },
          { key: "website", label: "Website", type: "url" },
          { key: "linkedinProfile", label: "LinkedIn", type: "url" },
          { key: "xProfile", label: "Twitter", type: "url" },
          { key: "facebookProfile", label: "Facebook", type: "url" },
          {
            key: "hqLocation",
            label: "HQ Location (Latitude, Longitude)",
            type: "geography",
          },
          { key: "logoUrl", label: "Icon/Logo URL", type: "image" },
        ],
        primaryKey: "id",
      },
    ];
  };

  const generateTableData = useCallback(
    (data: DataRow[]) => {
      let tables: TableData<any>[] = [];

      if (selectedDataType === "deals") {
        switch (selectedSubType as DealType) {
          case "merger_acquisition":
            tables = parseMAData(data);
            break;
          case "financing":
            tables = parseFinancingData(data);
            break;
          case "power_purchase_agreement":
            tables = parsePPAData(data);
            break;
          case "joint_venture":
            tables = parseJVData(data);
            break;
          case "project_update":
            tables = parseProjectUpdateData(data);
            break;
        }
      } else if (selectedDataType === "projects") {
        tables = parseProjectData(data);
      } else if (selectedDataType === "companies") {
        tables = parseCompanyData(data);
      }

      setTableData(tables);
      if (tables.length > 0 && !activeTab) {
        setActiveTab(tables[0].name);
      }
      return tables;
    },
    [selectedDataType, selectedSubType, activeTab, initialData]
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsProcessing(true);
    setValidationErrors([]); // Clear old errors
    setProcessingProgress(0);

    try {
      const text = await file.text();
      setProcessingProgress(50); // Indicate parsing has started

      const { data } = parseCSV(text);

      //   setUploadedData(data);
      generateTableData(data);

      toast.success(`Successfully parsed ${data.length} rows.`);
    } catch (error) {
      toast.error("Error processing file. Please check the file format.");
      console.error(error);
    } finally {
      setProcessingProgress(100);
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const parseCSV = (text: string): { headers: string[]; data: DataRow[] } => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let inQuotedField = false;
    let charIndex = 0;

    while (charIndex < text.length) {
      const char = text[charIndex];

      if (inQuotedField) {
        if (char === '"' && text[charIndex + 1] === '"') {
          currentField += '"';
          charIndex++;
        } else if (char === '"') {
          inQuotedField = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"' && currentField.length === 0) {
          inQuotedField = true;
        } else if (char === ",") {
          currentRow.push(currentField);
          currentField = "";
        } else if (char === "\n" || char === "\r") {
          if (char === "\r" && text[charIndex + 1] === "\n") {
            charIndex++;
          }
          // Only push the row if it's not just an empty field from a trailing newline
          if (currentField.length > 0 || currentRow.length > 0) {
            currentRow.push(currentField);
            rows.push(currentRow);
            currentRow = [];
            currentField = "";
          }
        } else {
          currentField += char;
        }
      }
      charIndex++;
    }

    // Add the last field/row
    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }

    if (rows.length < 2) {
      return { headers: [], data: [] };
    }

    const headers = rows[0].map((h) => h.trim());
    const data = rows.slice(1).map((rowValues, index) => {
      const rowObject: DataRow = { id: `row-${index + 1}` };
      headers.forEach((header, i) => {
        rowObject[header] = INVALID_VALUES.includes(
          rowValues[i].toLowerCase().trim()
        )
          ? ""
          : rowValues[i].trim();
      });
      return rowObject;
    });

    return { headers, data };
  };

  const validateData = (parsedTables: TableData<any>[]) => {
    const errors: ValidationError[] = [];

    parsedTables.forEach((table) => {
      table.data.forEach((row, rowIndex) => {
        table.columns.forEach((field) => {
          const value = row[field.key];
          const rowId = row[table.primaryKey];

          // Check for required fields
          if (
            field.required &&
            (value === null || value === undefined || value === "")
          ) {
            errors.push({
              table: table.name,
              row: rowIndex,
              field: field.key,
              message: `${field.label} is required.`,
              rowId,
            });
            return; // No need for further validation on this field
          }

          // Skip validation for non-required empty fields
          if (
            !field.required &&
            (value === null || value === undefined || value === "")
          ) {
            return;
          }

          // Type-specific validation
          switch (field.type) {
            case "number":
              if (isNaN(Number(value))) {
                errors.push({
                  table: table.name,
                  row: rowIndex,
                  field: field.key,
                  message: `Must be a valid number.`,
                  rowId,
                });
              }
              break;
            case "date":
              if (
                !(value instanceof Date) ||
                isNaN(value.getTime()) ||
                value.getFullYear() > 2099
              ) {
                errors.push({
                  table: table.name,
                  row: rowIndex,
                  field: field.key,
                  message: `Must be a valid date.`,
                  rowId,
                });
              }
              break;
            case "url":
            case "image":
              if (typeof value === "string" && !isValidUrl(value)) {
                errors.push({
                  table: table.name,
                  row: rowIndex,
                  field: field.key,
                  message: `Must be a valid URL.`,
                  rowId,
                });
              }
              break;
            case "select":
              if (
                field.options &&
                !field.options.some(
                  (opt) => (typeof opt === "string" ? opt : opt.value) === value
                )
              ) {
                errors.push({
                  table: table.name,
                  row: rowIndex,
                  field: field.key,
                  message: `'${value}' is not a valid option.`,
                  rowId,
                });
              }
              break;
            case "multiselect":
              if (Array.isArray(value) && field.options) {
                value.forEach((v) => {
                  if (
                    !field.options!.some(
                      (opt) => (typeof opt === "string" ? opt : opt.value) === v
                    )
                  ) {
                    errors.push({
                      table: table.name,
                      row: rowIndex,
                      field: field.key,
                      message: `'${v}' is not a valid option.`,
                      rowId,
                    });
                  }
                });
              }
              break;
            case "geography":
              if (
                !Array.isArray(value) ||
                value.length !== 2 ||
                value.some((v) => isNaN(Number(v)))
              ) {
                errors.push({
                  table: table.name,
                  row: rowIndex,
                  field: field.key,
                  message: `Must be two numbers (latitude, longitude).`,
                  rowId,
                });
              }
              break;
            case "json":
              if (!["object", "undefined"].includes(typeof value)) {
                errors.push({
                  table: table.name,
                  row: rowIndex,
                  field: field.key,
                  message:
                    "Invalid format - Must be in the form: `X (m%), Y (n%)`...",
                  rowId,
                });
              }
              break;
          }
        });
      });
    });

    setValidationErrors(errors);
  };

  const handleErrorClick = (error: ValidationError) => {
    setActiveTab(error.table);

    // Use a timeout to ensure the tab content is rendered before scrolling/focusing
    setTimeout(() => {
      const rowElement = document.getElementById(error.rowId);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRow(error.rowId);
        setEditingCell({
          table: error.table,
          row: error.row,
          field: error.field,
        });
      }
    }, 100);
  };

  const handleCellEdit = useCallback(
    (table: string, rowIndex: number, field: string, value: any) => {
      setTableData((prevTables) =>
        prevTables.map((t) => {
          if (t.name === table) {
            const updatedData = [...t.data];
            updatedData[rowIndex][field] = value;
            return { ...t, data: updatedData };
          }
          return t;
        })
      );
    },
    []
  );

  const addNewRow = (tableName: string) => {
    setTableData((prevTables) =>
      prevTables.map((t) => {
        if (t.name === tableName) {
          const newRow: any = { id: `${t.name}-${Date.now()}` };
          t.columns.forEach((col) => {
            newRow[col.key] =
              col.type === "boolean"
                ? false
                : col.type === "multiselect"
                ? []
                : col.type === "date"
                ? undefined
                : "";
          });
          return { ...t, data: [...t.data, newRow] };
        }
        return t;
      })
    );
  };

  const removeRow = (tableName: string, index: number) => {
    setTableData((prevTables) =>
      prevTables.map((t) => {
        if (t.name === tableName) {
          return { ...t, data: t.data.filter((_, i) => i !== index) };
        }
        return t;
      })
    );
  };

  const renderEditableCell = useCallback(
    (
      table: TableData<Record<string, any>>,
      row: any,
      field: FieldConfig<string>,
      rowIndex: number
    ) => {
      const value = row[field.key] || "";
      const isEditing =
        editingCell?.table === table.name &&
        editingCell?.row === rowIndex &&
        editingCell?.field === field.key;

      const handleClick = () => {
        if (!field.readonly) {
          setEditingCell({
            table: table.name,
            row: rowIndex,
            field: field.key,
          });
        }
      };

      const handleBlur = () => {
        setEditingCell(null);
      };

      const handleChange = (newValue: any) => {
        handleCellEdit(table.name, rowIndex, field.key, newValue);
      };

      if (isEditing && !field.readonly) {
        switch (field.type) {
          case "link":
            const options = [
              ...initialData[field.linkTo!],
              ...(tableData
                .find((t) => t.name === field.linkTo)
                ?.data.map((item: any) => ({ id: item.id, name: item.name })) ||
                []),
            ];
            return (
              <Select
                value={value}
                onValueChange={handleChange}
                onOpenChange={(open) => !open && handleBlur()}
              >
                <SelectTrigger className="w-full min-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          case "select":
            return (
              <Select
                value={value}
                onValueChange={handleChange}
                onOpenChange={(open) => !open && handleBlur()}
              >
                <SelectTrigger className="w-full min-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option: any) => (
                    <SelectItem
                      key={typeof option === "string" ? option : option.value}
                      value={typeof option === "string" ? option : option.value}
                    >
                      {typeof option === "string" ? option : option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          case "multiselect":
            return (
              //   <Input
              //     value={Array.isArray(value) ? value.join(", ") : value}
              //     onChange={(e) =>
              //       handleChange(e.target.value.split(";").map((v) => v.trim()))
              //     }
              //     onBlur={handleBlur}
              //     placeholder="Comma-separated values"
              //     autoFocus
              //     className="min-w-[200px]"
              //   />
              <MultiSelect
                selected={
                  Array.isArray(value) ? value : value.toString().split(";")
                }
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={field.label}
                options={
                  field.options?.map((option) => ({
                    label: typeof option === "string" ? option : option.label,
                    value: typeof option === "string" ? option : option.value,
                  })) ?? []
                }
                // autoFocus
                className="min-w-[200px]"
              />
            );
          case "boolean":
            return (
              <Checkbox
                checked={value === true || value === "true"}
                onCheckedChange={handleChange}
                onBlur={handleBlur}
              />
            );
          case "textarea":
            return (
              <Textarea
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                rows={2}
                className="min-w-[250px]"
              />
            );
          case "number":
            return (
              <Input
                type="number"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="min-w-[120px]"
              />
            );
          case "date":
            return (
              <Input
                type="date"
                value={value ? value?.toLocaleDateString() : ""}
                onChange={(e) =>
                  handleChange(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                onBlur={handleBlur}
                autoFocus
                className="min-w-[150px]"
              />
            );
          case "url":
          case "image":
            return (
              <Input
                type="url"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="min-w-[250px]"
              />
            );
          case "geography":
            return (
              <Input
                value={
                  Array.isArray(value) ? value.toReversed().join(", ") : value
                }
                onChange={(e) =>
                  handleChange(
                    e.target.value
                      .split(";")
                      .map((v) => parseFloat(v.trim()))
                      .toReversed()
                  )
                }
                onBlur={handleBlur}
                autoFocus
                className="min-w-[150px]"
              />
            );
          case "json":
            return (
              <Input
                value={
                  typeof value === "object"
                    ? Object.entries(value)
                        .map(([k, v]) => `${k} (${v}%)`)
                        .join(", ")
                    : value
                }
                onChange={(e) => {
                  const { names, numbers } = parseCommaSeparatedWithNumbers(
                    e.target.value
                  );
                  handleChange(
                    names.reduce((acc, key, i) => {
                      acc[key.toLowerCase()] = numbers[i];
                      return acc;
                    }, {} as Record<string, number>)
                  );
                }}
                onBlur={handleBlur}
                autoFocus
                className="min-w-[150px]"
              />
            );
          default:
            return (
              <Input
                value={value}
                onChange={(e) =>
                  handleChange(e.target.value ? e.target.value : undefined)
                }
                onBlur={handleBlur}
                autoFocus
                className="min-w-[150px]"
              />
            );
        }
      }

      // Display mode
      const displayValue = () => {
        if (field.type === "boolean") {
          return (
            <Badge
              variant={
                value === true || value === "true" ? "default" : "secondary"
              }
            >
              {value === true || value === "true" ? "Yes" : "No"}
            </Badge>
          );
        } else if (field.type === "link") {
          return (
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={() => {
                if (field.linkTo) {
                  setActiveTab(field.linkTo);
                  // Scroll to the element
                  setTimeout(() => {
                    const linkedRowId = row[field.key.replace("Name", "Id")];
                    document
                      .getElementById(linkedRowId)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    setHighlightedRow(linkedRowId);
                  }, 100);
                }
              }}
            >
              <Link className="h-3 w-3 mr-1" />
              {value.toString().length > 50
                ? `${value.toString().substring(0, 50)}...`
                : value}
            </Button>
          );
        } else if (field.type === "multiselect" && Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((v: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {field.dictionary
                    ? t(`${field.dictionary}.${field.key}.${v}`)
                    : v}
                </Badge>
              ))}
              {value.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{value.length - 3} more
                </Badge>
              )}
            </div>
          );
        } else if (field.type === "image" && value) {
          return (
            <div className="flex items-center justify-center p-1">
              <img
                src={value}
                alt={`${row["name"] ?? row.id} Logo`}
                className="max-h-6 w-auto object-contain" // max-h-10 is 40px. Use max-h-5 for 20px.
              />
            </div>
          );
        } else if (field.type === "url" && value) {
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {value.length > 30 ? `${value.substring(0, 30)}...` : value}
            </a>
          );
        } else if (field.type === "textarea" && value && value.length > 50) {
          return (
            <div className="max-w-xs">
              <span className="text-sm">{value.substring(0, 50)}...</span>
            </div>
          );
        }
        return (
          <span className="text-sm">
            {field.type === "date"
              ? value
                ? value?.toLocaleDateString?.()
                : ""
              : field.type === "geography"
              ? Array.isArray(value)
                ? value.toReversed().join(", ")
                : value?.toString()
              : field.type === "json"
              ? typeof value === "object"
                ? Object.entries(value)
                    .map(([k, v]) => `${k} (${v}%)`)
                    .join(", ")
                : value?.toString()
              : value?.toString() || ""}
          </span>
        );
      };

      const cellError = validationErrors.find(
        (e) =>
          e.table === table.name && e.row === rowIndex && e.field === field.key
      );

      const cellContent = (
        <div
          className={`min-h-[40px] p-2 cursor-pointer hover:bg-muted/50 rounded transition-colors ${
            cellError
              ? "border-2 border-destructive"
              : "border-2 border-transparent"
          } ${isEditing ? "bg-blue-50 border-blue-300" : ""} ${
            field.readonly ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
          onClick={handleClick}
        >
          {/* This inner div is for alignment */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">{displayValue()}</div>
          </div>
        </div>
      );

      if (cellError) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-destructive text-destructive-foreground"
            >
              <p>{cellError.message}</p>
            </TooltipContent>
          </Tooltip>
        );
      }

      return cellContent;
    },
    [
      editingCell,
      handleCellEdit,
      setActiveTab,
      validationErrors,
      highlightedRow,
    ]
  );

  const downloadTemplate = () => {
    // Template download logic based on selected type/subtype
    let headers: string[] = [];
    switch (selectedDataType) {
      case "deals":
        switch (selectedSubType) {
          case "merger_acquisition":
            headers = [
              "Deal update",
              "Acquisition target",
              "Country",
              "Asset Lifecycle",
              "Asset Maturity(Years)",
              "Co-located storage capacity",
              "Sector",
              "Technology",
              "Sub-sector",
              "Segment",
              "Revenue Model (Years)",
              "Off-taker",
              "On-grid/Off-grid",
              "Buyer(s)",
              "Buyer category",
              "Seller(s)",
              "Seller category",
              "Financial Advisors",
              "Technical Advisors",
              "Legal Advisors",
              "Lead arrangers",
              "Status",
              "Deal Structure",
              "Deal Type",
              "Deal Specifics",
              "Equity transacted",
              "Total Asset capacity (MW)",
              "Deal value ($ million)",
              "Announced Date",
              "Completed Date",
              "Financing strategy",
              "Strategy Rationale",
              "Insights",
              "Deal Date",
              "Longitude",
              "Latitude",
              "Press Release",
            ];
            break;
          case "financing":
            headers = [
              "Deal update",
              "Investment vehicle",
              "Company",
              "Region of primary operations",
              "Company Headquarter",
              "Country of primary operations",
              "Financing objective",
              "Project name",
              "Main sector",
              "Technology",
              "Sub-sector",
              "Segment",
              "Fundraising status",
              "Asset capacity (MW)",
              "Project lifecycle",
              "On grid/off-grid",
              "Co-located storage capacity",
              "Amount (Millions ; Reported currencies)",
              "Amount ($ million)",
              "Deal Date",
              "Investor Type",
              "Investment companies",
              "Commitments by Lenders",
              "Advisors",
              "Financing type",
              "Financing Subtype",
              "Deal comments",
              "Longitude",
              "Latitude",
              "Press Release",
            ];
            break;
          case "power_purchase_agreement":
            headers = [
              "Deal update",
              "Asset Name Involved",
              "Technology",
              "Asset Life-Cycle",
              "Region",
              "Country",
              "Supplier (s)",
              "Offtaker",
              "Offtaker sector",
              "Category",
              "Duration (Years)",
              "PPA",
              "Capacity offtaken (MW)",
              "Generated Power Offtaken (GWh/Yr)",
              "PPA Tariff ($/MWh)",
              "Announcement date",
              "Project Completion Date",
              "Asset Operational date",
              "Supply start Date",
              "Onsite/Offsite PPA",
              "Grid Operator",
              "Advisors",
              "Impacts",
              "Insights",
              "Longitude",
              "Latitude",
              "Press Release",
            ];
            break;
          case "joint_venture":
            headers = [
              "Deal update",
              "Assets name",
              "Companies in the deal",
              "Companies Classification",
              "Region",
              "Country",
              "Deal type",
              "Partnership objective",
              "Sector",
              "Technology",
              "Amount (million $)",
              "Asset Capacity (MW)",
              "Asset life-cycle",
              "Development stage",
              "Segment",
              "On grid/ Off-grid",
              "Announcement Date",
              "Deals summary",
              "Longitude",
              "Latitude",
              "Press Release",
            ];
            break;
          case "project_update":
            headers = [
              "Deal update",
              "Project Name",
              "Region",
              "Country",
              "Sector",
              "Technology",
              "Sub-sector",
              "Project Investment ($ million)",
              "Plant capacity (MW)",
              "Cost metric",
              "Project stage",
              "Project milestone",
              "Project status",
              "Revenue Model (Year)",
              "Tender objective",
              "Contract type",
              "On grid/Off grid",
              "Onshore/Offshore",
              "Segment",
              "Transmission infrastructure details",
              "Co-located storage",
              "Co-located storage capacity",
              "Grid Operator",
              "SPV",
              "Sponsors",
              "Lenders",
              "Advisors",
              "Contractor (EPC)",
              "O&M",
              "Equipment Supplier",
              "PPA Signed",
              "FInancial Close date",
              "Start Construction date",
              "Operational date",
              "Features",
              "Bid submission deadline",
              "Evaluation criteria",
              "Nber of bids received",
              "Winner of the tender",
              "Winning bid price",
              "Financing strategy",
              "EIA approval received",
              "Grid connection approved",
              "Financing secured",
              "Impacts",
              "Insights/Comments",
              "Date",
              "Longitude",
              "Latitude",
              "Press Release",
            ];
            break;
          default:
            break;
        }
        break;
      case "projects":
        switch (selectedSubType) {
          case "update":
            // This case uses the same headers as the deal project_update
            headers = [
              "Project Name",
              "Region",
              "Country",
              "Sector",
              "Technology",
              "Sub-sector",
              "Project Investment ($ million)",
              "Plant capacity (MW)",
              "Cost metric",
              "Project stage",
              "Project milestone",
              "Project status",
              "Revenue Model (Year)",
              "Contract type",
              "On grid/Off grid",
              "Onshore/Offshore",
              "Segment",
              "Transmission infrastructure details",
              "Co-located storage",
              "Co-located storage capacity",
              "Grid Operator",
              "SPV",
              "Sponsors",
              "Lenders",
              "Advisors",
              "Contractor (EPC)",
              "O&M",
              "Equipment Supplier",
              "PPA Signed",
              "FInancial Close date",
              "Start Construction date",
              "Operational date",
              "Features",
              "Financing strategy",
              "EIA approval received",
              "Grid connection approved",
              "Financing secured",
              "Impacts",
              "Insights",
              "Longitude",
              "Latitude",
            ];
            break;
          case "proposal":
            headers = [
              "Project Name",
              "Region",
              "Country",
              "Sector",
              "Technology",
              "Sub-sector",
              "Project Stage",
              "Project status",
              "Project milestone",
              "Procurement officer",
              "Plant capacity (MW)",
              "Tender objective",
              "Contract type",
              "On grid/Off grid",
              "Onshore/Offshore",
              "Segment",
              "Co-located storage",
              "Co-located storage capacity",
              "Grid Operator",
              "Bid submission deadline",
              "Evaluation criteria",
              "Nber of bids received",
              "Winner of the tender",
              "Winning bid price",
              "Funding secured?",
              "Financing strategy",
              "Comments",
              "Longitude",
              "Latitude",
            ];
            break;
          default:
            break;
        }
        break;
      case "companies":
        headers = [
          "Company Name",
          "About",
          "Founded date",
          "Operating status",
          "Company size",
          "Classification",
          "Main Activities",
          "Sector",
          "Subsector",
          "Technology",
          "HQ Country",
          "HQ Address",
          "Operating Countries",
          "Website",
          "LinkedIn",
          "Twitter",
          "Facebook",
          "Latitude",
          "Longitude",
          "Icon/Logo URL",
        ];
        break;

      default:
        break;
    }

    const csvContent = headers.join(",");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDataType}_${selectedSubType || "template"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveToDatabase = async () => {
    if (validationErrors.length > 0) {
      toast.error("Please fix validation errors before saving.");
      return;
    }
    if (tableData.length === 0) {
      toast.info("No data to save.");
      return;
    }

    setIsProcessing(true);

    const payload = {
      dataType: selectedDataType,
      subType: selectedSubType,
      tables: tableData.map((t) => ({ name: t.name, data: t.data })),
    };

    toast.promise(seedDatabase(payload), {
      loading: "Saving data to the database...",
      success: (res) => {
        console.log(res.result);
        if (res.success) {
          setTableData((prev) => {
            const data = {
              deals: [
                ...new Set([
                  ...(res.result!.deals?.names ?? []),
                  ...initialData.deals.map(({ name }) => name),
                ]),
              ],
              projects: [
                ...new Set([
                  ...(res.result!.projects?.names ?? []),
                  ...initialData.projects.map(({ name }) => name),
                ]),
              ],
              companies: [
                ...new Set([
                  ...(res.result!.companies?.names ?? []),
                  ...initialData.companies.map(({ name }) => name),
                ]),
              ],
            };
            return prev
              .map((t) => {
                if (t.isRelationship) {
                  switch (t.name) {
                    case "deals_assets":
                      return {
                        ...t,
                        data: t.data.filter(
                          (r) =>
                            !data.deals.includes(r.dealName) &&
                            !data.projects.includes(r.assetName)
                        ),
                      };
                    case "deals_companies":
                      return {
                        ...t,
                        data: t.data.filter(
                          (r) =>
                            !data.deals.includes(r.dealName) &&
                            !data.companies.includes(r.companyName)
                        ),
                      };
                    case "projects_companies":
                      return {
                        ...t,
                        data: t.data.filter(
                          (r) =>
                            !data.projects.includes(r.projectName) &&
                            !data.companies.includes(r.companyName)
                        ),
                      };
                  }
                }
                return {
                  ...t,
                  data: t.data.filter(
                    (r) =>
                      !(
                        data[t.name as "deals" | "projects" | "companies"] ?? []
                      ).includes(
                        r.name ??
                          r.update ??
                          r.dealName ??
                          r.companyName ??
                          r.assetName ??
                          r.projectName ??
                          ""
                      )
                  ),
                };
              })
              .filter(({ data }) => data.length > 0);
          });
          setActiveTab("");
          loadInitialData(); // Refresh reference data after successful save
          // Constructing a detailed success message
          const summary = Object.entries(res.result!)
            .map(([table, counts]) => `${counts.inserted} rows in ${table}`)
            .join(", ");
          return `Successfully saved data: ${summary}.`;
        } else {
          // Drizzle errors are caught and re-thrown as standard errors
          throw new Error(res.error);
        }
      },
      error: (err: Error) => {
        return `Failed to save data: ${err.message}`;
      },
      finally: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Database Seeding & Bulk Upload
            </h1>
            <p className="text-muted-foreground">
              Upload and manage bulk data with cross-referenced table
              relationships
            </p>
          </div>
        </div>

        {/* Upload Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Upload Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select
                  value={selectedDataType}
                  onValueChange={(value) => {
                    setSelectedDataType(value);
                    setSelectedSubType("");
                    // setUploadedData([]);
                    setTableData([]);
                    setActiveTab("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DATA_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDataType === "deals" && (
                <div className="space-y-2">
                  <Label htmlFor="dealType">Deal Type</Label>
                  <Select
                    value={selectedSubType}
                    onValueChange={setSelectedSubType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealType.enumValues.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedDataType === "projects" && (
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    value={selectedSubType}
                    onValueChange={setSelectedSubType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROJECT_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {selectedDataType &&
              (selectedDataType === "companies" || selectedSubType) && (
                <div className="flex gap-4">
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    Download Template
                  </Button>

                  <input
                    ref={fileInputRef}
                    title="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isProcessing ? "Processing..." : "Upload CSV File"}
                  </Button>
                </div>
              )}

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing file...</span>
                  <span>{Math.round(processingProgress)}%</span>
                </div>
                <Progress value={processingProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {validationErrors.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Validation Errors ({validationErrors.length}) - Please fix
                before saving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-left text-destructive hover:underline"
                        onClick={() => handleErrorClick(error)}
                      >
                        Table '
                        {
                          tableData.find((t) => t.name === error.table)
                            ?.displayName
                        }
                        ', Row {error.row + 1}, Field '{error.field}':{" "}
                        {error.message}
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Tables View */}
        {tableData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  Database Tables
                </CardTitle>
                <Button
                  onClick={saveToDatabase}
                  disabled={isProcessing || validationErrors.length > 0}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save to Database
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList
                  className="grid w-full"
                  style={{
                    gridTemplateColumns: `repeat(${tableData.length}, 1fr)`,
                  }}
                >
                  {tableData.map((table) => (
                    <TabsTrigger
                      key={table.name}
                      value={table.name}
                      className="flex items-center gap-2"
                    >
                      {table.icon}
                      {table.displayName}
                      <Badge variant="outline" className="ml-1">
                        {table.data.length}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tableData.map((table) => (
                  <TabsContent
                    key={table.name}
                    value={table.name}
                    className="mt-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {table.icon}
                          <h3 className="text-lg font-semibold">
                            {table.displayName}
                          </h3>
                          {table.isRelationship && (
                            <Badge variant="secondary">
                              Relationship Table
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => addNewRow(table.name)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Row
                        </Button>
                      </div>

                      <div className="border rounded-lg">
                        <ScrollArea className="h-[600px] w-full">
                          <div className="min-w-full">
                            <Table>
                              <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                  <TableHead className="w-12 sticky left-0 bg-background z-20 border-r">
                                    #
                                  </TableHead>
                                  {table.columns.map((field) => (
                                    <TableHead
                                      key={field.key}
                                      className={
                                        field.hidden
                                          ? "hidden"
                                          : "min-w-[150px] whitespace-nowrap"
                                      }
                                    >
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium">
                                          {field.label}
                                        </span>
                                        {field.required && (
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        )}
                                        {field.tooltip && (
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Info className="h-3 w-3 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="max-w-xs">
                                                {field.tooltip}
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </TableHead>
                                  ))}
                                  <TableHead className="w-20 sticky right-0 bg-background z-20 border-l">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {table.data.map((row, index) => (
                                  <TableRow
                                    key={row.id}
                                    id={row[table.primaryKey]}
                                    className={
                                      highlightedRow === row.id
                                        ? "bg-yellow-100 transition-colors duration-1000"
                                        : ""
                                    }
                                  >
                                    <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">
                                      {index + 1}
                                    </TableCell>
                                    {table.columns.map((field) => (
                                      <TableCell
                                        key={field.key}
                                        className={`${
                                          field.hidden ? "hidden" : "p-0"
                                        } ${field.id && "sticky"}`}
                                      >
                                        {renderEditableCell(
                                          table,
                                          row,
                                          field,
                                          index
                                        )}
                                      </TableCell>
                                    ))}
                                    <TableCell className="sticky right-0 bg-background z-10 border-l">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeRow(table.name, index)
                                        }
                                        className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <ScrollBar orientation="vertical" />
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
      {/* <Toaster /> */}
    </TooltipProvider>
  );
}
