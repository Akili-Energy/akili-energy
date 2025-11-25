import { getDeals, getDealById } from "@/app/actions/deals";
import { getProjectById, getProjects } from "@/app/actions/projects";
import {
  companySector,
  projectSector,
  countryCode,
  dealSubtype,
  dealType,
  geographicRegion,
  projectStage,
  dealCompanyRole,
  dealFinancials,
  technology,
  companySubSector,
  projectSubSector,
  segment,
  financingInvestorType,
  maSpecifics,
  maStructure,
  financingObjective,
  financingSubtype,
  dealFinancingType,
  deals,
  projects,
  mergersAcquisitions,
  powerPurchaseAgreements,
  companies,
  financing,
  jointVentures,
  dealsAssets,
  dealsCompanies,
  projectsCompanies,
  revenueModel,
  fundraisingStatus,
  projectDetails,
  proposals,
  projectCompanyRole,
  companyClassification,
  companyOperatingStatus,
  contentStatus,
  contentCategory,
  contentType,
  userRole,
} from "./db/schema";
import { getCompanies, getCompanyById } from "@/app/actions/companies";
import { getContent, getContentBySlug } from "@/app/actions/content";
import { getEventById, getEvents } from "@/app/actions/events";

export type Cursor = { id: string; createdAt: Date };
export type Pagination = "next" | "previous";

export type DealFilters = {
  // region?: Region;
  // country?: Country;
  sector?: Sector;
  type?: DealType;
  subtype?: DealSubtype;
  // dateRange?: { from?: Date; to?: Date };
};

export type ProjectFilters = {
  region?: Region;
  country?: Country;
  sector?: ProjectSector;
  stage?: ProjectStage;
};

export type CompanyClassification =
  (typeof companyClassification.enumValues)[number];
export type CompanyOperatingStatus =
  (typeof companyOperatingStatus.enumValues)[number];

export type CompanyFilters = {
  classification?: CompanyClassification;
  sector?: CompanySector;
  country?: Country; // For HQ Country
  status?: CompanyOperatingStatus;
};

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type UserRole = (typeof userRole.enumValues)[number]

export type Region = (typeof geographicRegion.enumValues)[number];
export type Country = (typeof countryCode.enumValues)[number];

export type CompanySector = (typeof companySector.enumValues)[number];
export type ProjectSector = (typeof projectSector.enumValues)[number];
export type Sector = CompanySector | ProjectSector;
export type Technology = (typeof technology.enumValues)[number];
export type CompanySubSector = (typeof companySubSector.enumValues)[number];
export type ProjectSubSector = (typeof projectSubSector.enumValues)[number];
export type SubSector = CompanySubSector | ProjectSubSector;
export type Segment = (typeof segment.enumValues)[number];

export type DealType = (typeof dealType.enumValues)[number];
export type DealSubtype = (typeof dealSubtype.enumValues)[number];

export type ProjectStage = (typeof projectStage.enumValues)[number];

const ASSET_LIFECYCLE = [
  "proposal",
  "early_stage",
  "late_stage",
  "ready_to_build",
  "not_to_proceed",
  "in_development",
  "in_construction",
  "operational",
  "cancelled",
] as const;
export type AssetLifecycle = (typeof ASSET_LIFECYCLE)[number];

export type DealCompanyRole = (typeof dealCompanyRole.enumValues)[number];
export type FinancingInvestorType =
  (typeof financingInvestorType.enumValues)[number];

export type MASpecifics = (typeof maSpecifics.enumValues)[number];
export type MAStructure = (typeof maStructure.enumValues)[number];

export type DealFinancingType = (typeof dealFinancingType.enumValues)[number];

export type FinancingSubtype = (typeof financingSubtype.enumValues)[number];
export type FundraisingStatus = (typeof fundraisingStatus.enumValues)[number];
export type FinancingObjective = (typeof financingObjective.enumValues)[number];

export type FetchDealsResults = NonNullable<
  Awaited<ReturnType<typeof getDeals>>
>["deals"];
export type FetchDealResult = Awaited<ReturnType<typeof getDealById>>;

export type FetchProjectsResults = NonNullable<
  Awaited<ReturnType<typeof getProjects>>
>["projects"];
export type FetchProjectResult = Awaited<ReturnType<typeof getProjectById>>;

export type FetchCompaniesResults = NonNullable<Awaited<
  ReturnType<typeof getCompanies>
>>["companies"];
export type FetchCompanyResult = Awaited<ReturnType<typeof getCompanyById>>;

export type FetchEventsResults = NonNullable<Awaited<
  ReturnType<typeof getEvents>
>>["events"];
export type FetchEventResult = Awaited<ReturnType<typeof getEventById>>;


export type Deal = NonNullable<FetchDealResult>;
export type Company = NonNullable<FetchCompanyResult>;
export interface MergerAcquisition
  extends Omit<Deal, "financing" | "powerPurchaseAgreement" | "jointVenture"> {
  mergerAcquisition: NonNullable<Deal["mergerAcquisition"]>;
}

export interface Financing
  extends Omit<
    Deal,
    "mergerAcquisition" | "powerPurchaseAgreement" | "jointVenture"
  > {
  financing: NonNullable<Deal["financing"]>;
}

export interface PowerPurchaseAgreement
  extends Omit<Deal, "financing" | "powerPurchaseAgreement" | "jointVenture"> {
  powerPurchaseAgreement: NonNullable<Deal["powerPurchaseAgreement"]>;
}

export interface BaseModel {
  id: string;
  name: string;
}

type RevenueModel = (typeof revenueModel.enumValues)[number];
interface RevenueModelDetails {
  model: RevenueModel;
  duration?: number; // Duration in years
}

export const PROJECT_FINANCING_STRATEGIES = [
  "debt",
  "equity",
  "grants",
] as const;
export type ProjectFinancingStrategy = Partial<
  Record<(typeof PROJECT_FINANCING_STRATEGIES)[number], number>
>;
export const PROPOSAL_EVALUATION_CRITERIA = ["technical", "financial"] as const;
export type ProposalEvaluationCriteria = Partial<
  Record<(typeof PROPOSAL_EVALUATION_CRITERIA)[number], number>
>;

export type ProjectCompanyRole = (typeof projectCompanyRole.enumValues)[number];

export type ContentCategory = (typeof contentCategory.enumValues)[number];
export type ContentStatus = (typeof contentStatus.enumValues)[number];
export type ContentType = (typeof contentType.enumValues)[number];

export type Content = Awaited<ReturnType<typeof getContent>>["content"][number];
export type Editorial = NonNullable<Awaited<ReturnType<typeof getContentBySlug>>>;

export interface AssetEntry {
  id: string;
  name: string;
  maturity: number;
  equityTransacted: number;
  description?: string;
}

export interface CompanyEntry {
  id: string;
  name: string;
  role: DealCompanyRole | "";
  commitment: number;
  investorType: FinancingInvestorType | "";
  description?: string;
}

export interface FinancialEntry {
  id: string;
  year: string;
  enterpriseValue: number;
  ebitda: number;
  debt: number;
}

type NewInsertModel<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type NewDeal = NewInsertModel<typeof deals.$inferInsert>;
export type NewMergerAcquisition = typeof mergersAcquisitions.$inferInsert;
export type NewFinancing = typeof financing.$inferInsert;
export type NewPowerPurchaseAgreement =
  typeof powerPurchaseAgreements.$inferInsert;
export type NewJointVenture = typeof jointVentures.$inferInsert;

export type DealAsset = typeof dealsAssets.$inferInsert;
export type DealCompany = typeof dealsCompanies.$inferInsert;

export type NewProjectCompany = typeof projectsCompanies.$inferInsert;

export type NewProject = NewInsertModel<typeof projects.$inferInsert>;
export type NewProjectUpdateDetail = NewInsertModel<
  typeof projectDetails.$inferInsert
>;
export type NewProjectProposal = NewInsertModel<typeof proposals.$inferInsert>;

export type NewCompany = NewInsertModel<typeof companies.$inferInsert>;

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}