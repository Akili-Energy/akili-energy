import {
  boolean,
  customType,
  date,
  decimal,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgMaterializedView,
  pgTable,
  pgView,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  isNotNull,
  relations,
  sql,
  sum,
  type AnyColumn,
  type GetColumnData,
  type SQL,
} from "drizzle-orm";
import { ProjectFinancingStrategy, ProposalEvaluationCriteria } from "../types";

type ColumnDataType<T extends AnyColumn | SQL.Aliased> = T extends SQL.Aliased<
  infer U
>
  ? U
  : T extends AnyColumn
  ? GetColumnData<T>
  : never;

const aliasedColumn = <T extends AnyColumn | SQL.Aliased>(
  column: T,
  alias: string
): SQL.Aliased<ColumnDataType<T>> => {
  return sql<ColumnDataType<T>>`${column}`.as(alias);
};

// ########################################
// CUSTOM TYPES (ENUMS)
// ########################################

export const userRole = pgEnum("user_role", [
  "admin",
  "analyst_editor",
  "subscriber",
  "guest",
]);
export const clientProfile = pgEnum("client_profile", [
  "deal_advisor",
  "developer_ipp",
  "investor",
  "epc_om",
  "public_institution",
  "individual",
]);
export const geographicRegion = pgEnum("geographic_region", [
  "north_africa",
  "east_africa",
  "west_africa",
  "central_africa",
  "southern_africa",
]);
export const projectSector = pgEnum("project_sector", [
  "solar",
  "wind",
  "hydro",
  "battery",
  "hydrogen",
  "biomass",
  "geothermal",
  "nuclear",
  "oil_gas",
  "other",
]);
export const companySector = pgEnum("company_sector", [
  "renewables",
  "non_renewables",
  "telecom",
  "transport",
  "mining",
  "real_estate",
  "industrial",
  "social",
  "water",
  "infrastructure",
  "utilities",
  "other",
]);
export const companySubSector = pgEnum("company_sub_sector", [
  "solar",
  "wind",
  "hydro",
  "battery",
  "hydrogen",
  "biomass",
  "geothermal",
  "nuclear",
  "oil",
  "gas",
  "coal",
  "telecom",
  "university",
  "hospital",
  "prison",
  "mobility",
  "road_bridges",
  "hybrid",
  "marine",
  "bioenergy",
  "wave",
  "waste-to-energy",
  "warehousing",
  "logistics",
]);
export const projectSubSector = pgEnum("project_sub_sector", [
  "utility_scale",
  "commercial_industrial",
  "residential",
  "offshore",
  "onshore",
  "cleantech",
  "rooftop",
  "distributed_renewable",
  "lithium",
]);
export const technology = pgEnum("technology", [
  "photovoltaic",
  "concentrated_solar_power",
  "solar_home_systems",
  "concentrated_photovoltaic",
  "onshore_wind",
  "offshore_wind",
  "small_hydro",
  "large_hydro",
  "bess",
  "lithium_ion",
  "biogas",
  "waste",
  "oil",
  "gas",
  "coal",
  "mini_grid",
  "decentralised",
  "high_voltage_transmission_lines",
  "hydrogen",
  "geothermal",
  "nuclear",
  "hybrid",
  "green_hydrogen",
  "wave_onshore",
  "wave_nearshore",
]);
export const revenueModel = pgEnum("revenue_model", [
  "power_purchase_agreement",
  "concession",
  "turnkey",
  "flexible",
  "trading",
  "rental",
  "pay_as_you_go",
]);
export const segment = pgEnum("segment", [
  "generation",
  "storage",
  "transmission",
  "distribution",
]);
export const countryCode = pgEnum("country_code", [
  "DZ",
  "AO",
  "BJ",
  "BW",
  "BF",
  "BI",
  "CM",
  "CV",
  "CF",
  "TD",
  "KM",
  "CG",
  "CD",
  "CI",
  "DJ",
  "EG",
  "GQ",
  "ER",
  "ET",
  "GA",
  "GM",
  "GH",
  "GN",
  "GW",
  "KE",
  "LS",
  "LR",
  "LY",
  "MG",
  "ML",
  "MW",
  "MR",
  "MU",
  "YT",
  "MA",
  "MZ",
  "NA",
  "NE",
  "NG",
  "RE",
  "RW",
  "ST",
  "SN",
  "SC",
  "SL",
  "SO",
  "ZA",
  "SS",
  "SD",
  "SZ",
  "TZ",
  "TG",
  "TN",
  "UG",
  "EH",
  "ZM",
  "ZW",
]);
export const companySize = pgEnum("company_size", [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
  "10001+",
]);
export const companyOperatingStatus = pgEnum("company_operating_status", [
  "active",
  "operating",
  "in_development",
  "closed",
]);
export const companyActivity = pgEnum("company_activity", [
  "merger_acquisition",
  "financing",
  "offtaker",
  "development",
  "construction",
  "operation",
  "maintenance",
  "design",
  "engineering",
  "ownership",
  "energy_trading",
  "wind",
  "procurement",
  "investment",
  "asset_management",
  "transmission",
  "hybrid",
  "distribution",
  "research_development",
  "exploration",
  "installation",
  "origination",
  "commissioning",
  "generation",
  "management",
  "renewables",
  "storage",
  "oil",
  "gas",
  "petrochemicals",
  "structuring",
  "epc",
  "manufacturing",
  "services",
  "infrastructure",
  "production",
  "wave_energy",
  "geothermal",
  "logistics",
  "waste-to-energy",
  "warehousing",
  "industrial",
  "other",
]);
export const companyClassification = pgEnum("company_classification", [
  "private_equity",
  "pe_backed",
  "private",
  "public",
  "government",
  "non_profit",
  "development_finance_institution",
  "advisor",
  "independent_power_producer",
  "epc_om",
  "utility",
  "micro_cap",
  "small_cap",
  "mid_cap",
  "big_cap",
  "developer",
  "investment",
  "operator",
  "manufacturer",
  "asset_manager",
  "energy_trader",
]);
export const projectCompanyRole = pgEnum("project_company_role", [
  "special_purpose_vehicle",
  "sponsor",
  "contractor",
  "operations_maintenance",
  "equipment_supplier",
  "lender",
  "advisor",
  "grid_operator",
  "procurement_officer",
  "tender_winner",
]);
export const projectStatus = pgEnum("project_status", [
  "active",
  "ongoing",
  "cancelled",
]);
export const projectStage = pgEnum("project_stage", [
  "proposal",
  "announced",
  "completed",
  "early_stage",
  "late_stage",
  "ready_to_build",
  "not_to_proceed",
  "in_development",
  "in_construction",
  "operational",
  "revived",
  "suspended",
  "cancelled",
]);
export const projectMilestone = pgEnum("project_milestone", [
  "financial_closing",
  "commissioning",
  "project_awarded",
  "operational",
  "construction_started",
  "in_construction",
  "tendering_procedure_launched",
  "epc_selection",
  "agreement_signed",
  "pre_qualification_launched",
  "initial_approvals",
  "ppa_signed",
  "om_partner_appointed",
  "development_agreement_signed",
  "licenses_agreement",
  "implementation_agreement_signed",
  "1st_tranche_payment",
  "project_update",
  "construction_restarted",
  "power_purchase_agreement",
  "pre_feasibility_study_completed",
  "grid_connection_approved",
  "land_transfer_decree",
  "project_unveiled",
  "government_support_agreement_signed",
  "call_for_tender",
  "commercial_operation_started",
  "mou_signed",
  "project_announced",
]);
export const projectContractType = pgEnum("project_contract_type", [
  "operate",
  "build",
  "own",
  "transfer",
  "maintain",
  "design",
  "finance",
  "lease",
  "rehabilitate",
]);
export const projectTenderObjective = pgEnum("project_tender_objective", [
  "engineering_procurement_construction",
  "operations_maintenance",
  "finance",
  "commissioning",
  "design",
  "installation",
  "supply",
  "testing",
  "transfer",
]);
export const dealType = pgEnum("deal_type", [
  "merger_acquisition",
  "financing",
  "power_purchase_agreement",
  "project_update",
  "joint_venture",
]);
export const dealSubtype = pgEnum("deal_subtype", [
  "asset",
  "ma_corporate",
  "debt",
  "equity",
  "grant",
  "utility",
  "ppa_corporate",
  "joint_venture",
  "strategic_partnership_agreement",
  "strategic_collaboration",
  "early_stage",
  "late_stage",
  "ready_to_build",
  "in_construction",
  "operational",
  "proposal",
  "completed",
]);
export const dealCompanyRole = pgEnum("deal_company_role", [
  "acquisition_target",
  "buyer",
  "seller",
  "offtaker",
  "supplier",
  "lead_arranger",
  "investor",
  "legal_advisor",
  "technical_advisor",
  "financial_advisor",
  "advisor",
  "grid_operator",
  "joint_venture",
  "financing",
]);
export const dealFinancingType = pgEnum("deal_financing_type", [
  "debt",
  "equity",
  "grant",
  "green_bond",
]);
export const maStructure = pgEnum("m_a_structure", [
  "acquisition",
  "merger",
  "divestment",
  "ownership_transfer",
]);
export const maStatus = pgEnum("m_a_status", ["announced", "completed"]);
export const maSpecifics = pgEnum("m_a_specifics", [
  "majority_stake",
  "minority_stake",
  "economic_interest",
]);
export const fundraisingStatus = pgEnum("fundraising_status", [
  "1st_closing",
  "final_closing",
  "completed",
  "fund_expansion",
  "ongoing",
]);
export const financingObjective = pgEnum("financing_objective", [
  "asset",
  "corporate",
  "government",
  "cleantech",
]);
export const financingInvestorType = pgEnum("financing_investor_type", [
  "private_equity",
  "development_finance_institution",
  "institutional",
  "private",
  "public",
  "limited_partners",
  "government",
  "non_profit",
  "venture_capital",
  "developer",
  "multilateral",
]);
export const financingSubtype = pgEnum("financing_subtype", [
  "project_finance",
  "loan",
  "grant",
  "equity",
  "private",
  "senior_debt",
]);
export const partnershipObjective = pgEnum("partnership_objective", [
  "develop",
  "build",
  "operate",
  "finance",
]);
export const contentType = pgEnum("content_type", ["blog", "news", "research"]);
export const contentCategory = pgEnum("content_category", [
  "market-trends",
  "policy-regulation",
  "infographic",
  "industry-insights",
  "solar",
  "wind",
  "hydro",
  "battery",
  "hydrogen",
  "biomass",
  "geothermal",
  "mergers-acquisitions",
  "power-purchase-agreements",
  "financing",
  "projects",
  "interviews",
  "case-studies",
]);
export const contentStatus = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

const geography = customType<{ data: [number, number]; driverData: string }>({
  dataType() {
    return "geography(point, 4326)";
  },
  toDriver([lng, lat]: [number, number]): string {
    return `SRID=4326;POINT(${lng} ${lat})`;
  },
  fromDriver(value: string): [number, number] {
    // console.log(value);
    const match = value
      .replace(/^SRID=\d+;/, "")
      .trim()
      .match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    throw new Error(`Unsupported geography type: ${value}`);
  },
});

// ########################################
// TABLES
// ########################################

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
};

// --------------------
// Authentication
// --------------------
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    email: varchar("email", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 64 }).notNull(),
    role: userRole("role").notNull().default("guest"),
    profilePictureUrl: varchar("profile_picture_url", { length: 255 }).unique(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique(),
    isActive: boolean("is_active").default(true),
    // emailVerified: boolean("email_verified").default(false),
    // lastLoginAt: timestamp("last_login_at", {
    //   withTimezone: true,
    //   mode: "date",
    // }),
    // ...timestamps,
  },
  (table) => [index().on(table.role)]
);

// --------------------
// Geography
// --------------------
export const countries = pgTable(
  "countries",
  {
    code: countryCode("code").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    region: geographicRegion("region").notNull(),
  },
  (table) => [index().on(table.region), unique().on(table.code, table.region)]
);

// --------------------
// Core
// --------------------
export const clients = pgTable("clients", {
  userId: varchar("user_id", { length: 255 })
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  type: clientProfile("type").notNull(),
  jobTitle: varchar("job_title", { length: 64 }),
  company: varchar("company", { length: 64 }),
});

export const projectSectors = pgTable("project_sectors", {
  id: projectSector("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: text("description"),
});

export const companySectors = pgTable("company_sectors", {
  id: companySector("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: text("description"),
});

export const technologies = pgTable(
  "technologies",
  {
    id: technology("id").primaryKey(),
    projectSector: projectSector("project_sector").references(
      () => projectSectors.id,
      {
        onDelete: "restrict",
        onUpdate: "cascade",
      }
    ),
    companySector: companySector("company_sector").references(
      () => companySectors.id,
      {
        onDelete: "restrict",
        onUpdate: "cascade",
      }
    ),
  },
  (table) => [
    index().on(table.projectSector),
    index().on(table.companySector),
    unique().on(table.id, table.projectSector, table.companySector),
  ]
);

// Companies
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    website: varchar("website", { length: 255 }),
    logoUrl: varchar("logo_url", { length: 255 }).unique(),
    description: text("description"),
    foundingDate: date("founding_date", { mode: "date" }),
    hqCountry: countryCode("hq_country").references(() => countries.code, {
      onDelete: "set null",
    }),
    hqAddress: varchar("hq_address", { length: 255 }),
    hqLocation: geography("hq_location"),
    activities: companyActivity("activities")
      .array()
      .default(sql`ARRAY[]::company_activity[]`),
    size: companySize("size"),
    operatingStatus: companyOperatingStatus("operating_status")
      .array()
      .default(sql`ARRAY[]::company_operating_status[]`),
    classification: companyClassification("classification")
      .array()
      .default(sql`ARRAY[]::company_classification[]`),
    subSectors: companySubSector("sub_sectors")
      .array()
      .default(sql`ARRAY[]::company_sub_sector[]`),
    linkedinProfile: varchar("linkedin_profile", { length: 255 }).unique(),
    xProfile: varchar("x_profile", { length: 255 }).unique(),
    facebookProfile: varchar("facebook_profile", { length: 255 }).unique(),
    email: varchar("email", { length: 64 }).unique(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique(),
    ...timestamps,
  },
  (table) => [
    index().on(table.hqCountry),
    index("companies_tsvector_name_gin_idx").using(
      "gin",
      sql`to_tsvector('franglais', ${table.name})`
    ),
    index().using("gin", table.classification),
    index().using("gin", table.operatingStatus),
    index().using("gin", table.activities),
    index().using("gin", table.subSectors),
    index().using("gist", table.hqLocation),
  ]
);

export const companiesOperatingCountries = pgTable(
  "companies_operating_countries",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    countryCode: countryCode("country_code")
      .notNull()
      .references(() => countries.code, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.countryCode] }),
    index().on(table.countryCode),
  ]
);

export const companiesSectors = pgTable(
  "companies_sectors",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    sector: companySector("sector")
      .notNull()
      .references(() => companySectors.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.sector] }),
    index().on(table.sector),
  ]
);

export const companiesTechnologies = pgTable(
  "companies_technologies",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    technology: technology("technology")
      .notNull()
      .references(() => technologies.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.technology] }),
    index().on(table.technology),
  ]
);

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).unique(),
  linkedinProfile: varchar("linkedin_profile", { length: 255 }).unique(),
  about: text("about"),
});

export const companiesEmployees = pgTable(
  "companies_employees",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 64 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.employeeId] }),
    unique().on(table.companyId, table.role),
    index().on(table.employeeId),
  ]
);

// Projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    address: varchar("address", { length: 255 }),
    location: geography("location"),
    description: text("description"),
    country: countryCode("country").references(() => countries.code, {
      onDelete: "set null",
    }),
    subSectors: projectSubSector("sub_sectors")
      .array()
      .default(sql`ARRAY[]::project_sub_sector[]`),
    investmentCosts: decimal("investment_costs", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    plantCapacity: decimal("plant_capacity", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    stage: projectStage("stage"),
    // milestone: projectMilestone("milestone"),
    milestone: varchar("milestone", { length: 255 }),
    status: projectStatus("status"),
    onOffGrid: boolean("on_off_grid"),
    onOffShore: boolean("on_off_shore"),
    segments: segment("segments")
      .array()
      .default(sql`ARRAY[]::segment[]`),
    revenueModel: revenueModel("revenue_model"),
    revenueModelDuration: integer("revenue_model_duration"),
    colocatedStorage: boolean("colocated_storage"),
    // colocatedStorageCapacity: decimal("colocated_storage_capacity", {
    //   precision: 10,
    //   scale: 2,
    // }).$type<number>(),
    colocatedStorageCapacity: varchar("colocated_storage_capacity", {
      length: 32,
    }),
    contractType: projectContractType("contract_type")
      .array()
      .default(sql`ARRAY[]::project_contract_type[]`),
    financingStrategy:
      jsonb("financing_strategy").$type<ProjectFinancingStrategy>(),
    fundingSecured: boolean("funding_secured"),
    impacts: text("impacts"),
    insights: text("insights"),
    features: text("features"),
    ...timestamps,
  },
  (table) => [
    index().on(table.country),
    index().on(table.stage),
    index().on(table.status),
    index("projects_tsvector_name_gin_idx").using(
      "gin",
      sql`to_tsvector('franglais', ${table.name})`
    ),
    index().using("gin", table.subSectors),
    index().using("gin", table.segments),
    index().using("gin", table.contractType),
    index().using("gin", table.financingStrategy),
    index().using("gist", table.location),
  ]
);

export const projectsSectors = pgTable(
  "projects_sectors",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    sector: projectSector("sector")
      .notNull()
      .references(() => projectSectors.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.sector] }),
    index().on(table.sector),
  ]
);

export const projectsTechnologies = pgTable(
  "projects_technologies",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technology: technology("technology")
      .notNull()
      .references(() => technologies.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.technology] }),
    index().on(table.technology),
  ]
);

export const projectDetails = pgTable(
  "project_details",
  {
    projectId: uuid("project_id")
      .primaryKey()
      .references(() => projects.id, { onDelete: "cascade" }),
    transmissionInfrastructureDetails: text(
      "transmission_infrastructure_details"
    ),
    ppaSigned: boolean("ppa_signed"),
    financialClosingDate: date("financial_closing_date", { mode: "date" }),
    eiaApproved: boolean("eia_approved"),
    gridConnectionApproved: boolean("grid_connection_approved"),
    constructionStart: date("construction_start", { mode: "date" }),
    endDate: date("end_date", { mode: "date" }),
    operationalDate: date("operational_date", { mode: "date" }),
  },
  (table) => [
    index().on(table.constructionStart),
    index().on(table.endDate),
    index().on(table.operationalDate),
  ]
);

export const proposals = pgTable(
  "proposals",
  {
    projectId: uuid("project_id")
      .primaryKey()
      .references(() => projects.id, { onDelete: "cascade" }),
    tenderObjective: projectTenderObjective("tender_objective"),
    bidSubmissionDeadline: date("bid_submission_deadline", { mode: "date" }),
    evaluationCriteria: jsonb(
      "evaluation_criteria"
    ).$type<ProposalEvaluationCriteria>(),
    bidsReceived: integer("bids_received"),
    winningBid: decimal("winning_bid", {
      precision: 15,
      scale: 2,
    }).$type<number>(),
  },
  (table) => [
    index().on(table.bidSubmissionDeadline),
    index().using("gin", table.evaluationCriteria),
  ]
);

// export const opportunities = pgTable('opportunities', {
//     projectId: uuid('project_id').primaryKey().references(() => projects.id, { onDelete: 'cascade' }),
//     program: varchar('program', { length: 255 }),
// });

export const projectsCompanies = pgTable(
  "projects_companies",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    role: projectCompanyRole("role").notNull(),
    percentageOwnership: integer("percentage_ownership"),
    equityAmount: decimal("equity_amount", {
      precision: 8,
      scale: 2,
    }).$type<number>(),
    details: text("details"),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.companyId, table.role] }),
    index().on(table.companyId),
    index().on(table.role),
  ]
);

// Deals
export const dealSubtypes = pgTable(
  "deal_subtypes",
  {
    id: dealSubtype("id").primaryKey(),
    type: dealType("type").notNull(),
  },
  (table) => [unique().on(table.id, table.type)]
);

export const deals = pgTable(
  "deals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    update: text("update").notNull().unique(),
    type: dealType("type").notNull(),
    subtype: dealSubtype("subtype"),
    amount: decimal("amount", { precision: 10, scale: 2 }).$type<number>(),
    currency: varchar("currency", { length: 4 }).default("USD"),
    date: date("date", { mode: "date" }).notNull().defaultNow(),
    description: text("description"),
    impacts: text("impacts"),
    insights: text("insights"),
    pressReleaseUrl: varchar("press_release_url", { length: 255 }),
    announcementDate: date("announcement_date", { mode: "date" }),
    completionDate: date("completion_date", { mode: "date" }),
    // onOffGrid: boolean("on_off_grid"),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.subtype, table.type],
      foreignColumns: [dealSubtypes.id, dealSubtypes.type],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
    index().on(table.type),
    index().on(table.subtype),
    index().on(table.date),
    index().on(table.announcementDate),
    index().on(table.completionDate),
    index("deals_tsvector_update_gin_idx").using(
      "gin",
      sql`to_tsvector('franglais', ${table.update})`
    ),
  ]
);

export const dealsCountries = pgTable(
  "deals_countries",
  {
    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id, { onDelete: "cascade" }),
    countryCode: countryCode("country_code")
      .notNull()
      .references(() => countries.code, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.dealId, table.countryCode] }),
    index().on(table.countryCode),
  ]
);

export const dealsAssets = pgTable(
  "deals_assets",
  {
    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    maturity: integer("maturity"),
    equityTransactedPercentage: decimal("equity_transacted_percentage", {
      precision: 5,
      scale: 2,
    }).$type<number>(),
  },
  (table) => [
    primaryKey({ columns: [table.dealId, table.assetId] }),
    index().on(table.assetId),
  ]
);

export const dealsCompanies = pgTable(
  "deals_companies",
  {
    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    role: dealCompanyRole("role").notNull(),
    details: text("details"),
    investorType: financingInvestorType("investor_type"),
    commitment: decimal("commitment", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    equityTransactedPercentage: decimal("equity_transacted_percentage", {
      precision: 5,
      scale: 2,
    }).$type<number>(),
  },
  (table) => [
    primaryKey({ columns: [table.dealId, table.companyId, table.role] }),
    index().on(table.companyId),
    index().on(table.role),
  ]
);

export const dealFinancials = pgTable(
  "deal_financials",
  {
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    enterpriseValue: decimal("enterprise_value", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    ebitda: decimal("ebitda", { precision: 10, scale: 2 }).$type<number>(),
    debt: decimal("debt", { precision: 10, scale: 2 }).$type<number>(),
    revenue: decimal("revenue", { precision: 10, scale: 2 }).$type<number>(),
    cash: decimal("cash", { precision: 10, scale: 2 }).$type<number>(),
  },
  (table) => [primaryKey({ columns: [table.dealId, table.year] })]
);

export const mergersAcquisitions = pgTable(
  "mergers_acquisitions",
  {
    dealId: uuid("deal_id")
      .primaryKey()
      .references(() => deals.id, { onDelete: "cascade" }),
    status: maStatus("status"),
    revenueModel: revenueModel("revenue_model"),
    revenueModelDuration: integer("revenue_model_duration"),
    structure: maStructure("structure"),
    specifics: maSpecifics("specifics")
      .array()
      .default(sql`ARRAY[]::m_a_specifics[]`),
    financingStrategy: dealFinancingType("financing_strategy")
      .array()
      .default(sql`ARRAY[]::deal_financing_type[]`),
    strategyRationale: text("strategy_rationale"),
  },
  (table) => [
    index().on(table.status),
    index().using("gin", table.specifics),
    index().using("gin", table.financingStrategy),
  ]
);

export const financing = pgTable(
  "financing",
  {
    dealId: uuid("deal_id")
      .primaryKey()
      .references(() => deals.id, { onDelete: "cascade" }),
    vehicle: varchar("vehicle", { length: 255 }),
    status: fundraisingStatus("status"),
    objective: financingObjective("objective"),
    financingType: dealFinancingType("financing_type")
      .array()
      .default(sql`ARRAY[]::deal_financing_type[]`),
    financingSubtype: financingSubtype("financing_subtype")
      .array()
      .default(sql`ARRAY[]::financing_subtype[]`),
  },
  (table) => [
    index().using("gin", table.financingType),
    index().using("gin", table.financingSubtype),
  ]
);

export const powerPurchaseAgreements = pgTable(
  "power_purchase_agreements",
  {
    dealId: uuid("deal_id")
      .primaryKey()
      .references(() => deals.id, { onDelete: "cascade" }),
    duration: integer("duration"),
    details: boolean("details"),
    capacity: decimal("capacity", { precision: 10, scale: 2 }).$type<number>(),
    generatedPower: decimal("generated_power", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    onOffSite: boolean("on_off_site"),
    assetOperationalDate: date("asset_operational_date", { mode: "date" }),
    supplyStart: date("supply_start", { mode: "date" }),
  },
  (table) => [
    index().on(table.duration),
    index().on(table.assetOperationalDate),
    index().on(table.supplyStart),
  ]
);

export const jointVentures = pgTable(
  "joint_ventures",
  {
    dealId: uuid("deal_id")
      .primaryKey()
      .references(() => deals.id, { onDelete: "cascade" }),
    partnershipObjectives: partnershipObjective("partnership_objectives")
      .array()
      .default(sql`ARRAY[]::partnership_objective[]`),
  },
  (table) => [index().using("gin", table.partnershipObjectives)]
);

// Documents
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    fileUrl: varchar("file_url", { length: 255 }).notNull().unique(),
    publisher: varchar("publisher", { length: 255 }),
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => [
    index().on(table.dealId),
    index().on(table.projectId),
    index().on(table.companyId),
  ]
);

// --------------------
// Content (Blog, News & Research)
// --------------------

export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobTitle: varchar("job_title", { length: 255 }),
  bio: text("bio"),
  linkedinProfile: varchar("linkedin_profile", { length: 255 }).unique(),
  xProfile: varchar("x_profile", { length: 255 }).unique(),
  userId: varchar("user_id", { length: 255 })
    .unique()
    .references(() => users.id, { onDelete: "set null" }),
});

export const content = pgTable(
  "content",
  {
    slug: varchar("slug", { length: 200 }).primaryKey(),
    type: contentType("type").notNull(),
    title: varchar("title", { length: 72 }).notNull(),
    summary: text("summary").notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull().unique(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id),
    category: contentCategory("category").notNull(),
    featured: boolean("featured").default(false),
    status: contentStatus("status").notNull().default("draft"),
    metaTitle: varchar("meta_title", { length: 72 }),
    metaDescription: varchar("meta_description", { length: 160 }),
    publicationDate: timestamp("publication_date", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => [
    index().on(table.type),
    index().on(table.category),
    index().on(table.status),
    index().on(table.featured),
    index().on(table.authorId),
    index("content_tsvector_title_summary_gin_idx").using(
      "gin",
      sql`to_tsvector('franglais', coalesce(${table.title}, '') || ' ' || coalesce(${table.summary}, ''))`
    ),
  ]
);

export const tags = pgTable("tags", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 32 }).notNull().unique(),
});

export const contentTags = pgTable(
  "content_tags",
  {
    contentSlug: varchar("content_slug", { length: 255 })
      .notNull()
      .references(() => content.slug, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 32 })
      .notNull()
      .references(() => tags.id, { onDelete: "no action" }),
  },
  (table) => [
    primaryKey({ columns: [table.contentSlug, table.tagId] }),
    index().on(table.tagId),
  ]
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    slug: varchar("slug", { length: 255 })
      .primaryKey()
      .references(() => content.slug, { onDelete: "cascade" }),
    content: text("content").notNull(),
    editorId: uuid("editor_id").references(() => authors.id, {
      onDelete: "set null",
    }),
    revisionDate: timestamp("revision_date", {
      withTimezone: true,
      mode: "date",
    }),
    publicationDate: timestamp("publication_date", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => [
    index("blog_posts_tsvector_content_gin_idx").using(
      "gin",
      sql`to_tsvector('franglais', ${table.content})`
    ),
    index().on(table.editorId),
  ]
);

export const newsArticles = pgTable(
  "news_articles",
  {
    slug: varchar("slug", { length: 255 })
      .primaryKey()
      .references(() => content.slug, { onDelete: "cascade" }),
    content: text("content").notNull(),
    // sourceUrl: varchar("source_url", { length: 255 }),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => [
    index("news_articles_tsvector_content_gin_idx").using(
      "gin",
      sql`to_tsvector('franglais', ${table.content})`
    ),
  ]
);

export const researchReports = pgTable("research_reports", {
  slug: varchar("slug", { length: 255 })
    .primaryKey()
    .references(() => content.slug, { onDelete: "cascade" }),
  reportUrl: varchar("report_url", { length: 255 }).notNull().unique(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

// --------------------
// Events & Conferences
// --------------------
export const eventOrganizers = pgTable("event_organizers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }).unique(),
  bio: text("bio"),
  website: varchar("website", { length: 255 }),
  companyId: uuid("company_id")
    .unique()
    .references(() => companies.id, { onDelete: "set null" }),
  registrationDate: timestamp("registration_date", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    virtual: boolean("virtual").default(false),
    start: timestamp("start", { withTimezone: true, mode: "date" }).notNull(),
    endDate: timestamp("end_date", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    location: geography("location"),
    website: varchar("website", { length: 255 }),
    registrationUrl: varchar("registration_url", { length: 255 }).unique(),
    imageUrl: varchar("image_url", { length: 255 }),
    organizerId: uuid("organizer_id")
      .notNull()
      .references(() => eventOrganizers.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    index().on(table.start),
    index().on(table.endDate),
    index().on(table.organizerId),
    index().using("gist", table.location),
  ]
);

// ########################################
// RELATIONS
// ########################################

// --------------------
// Authentication & Users
// --------------------

export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients),
  author: one(authors),
}));

export const clientsRelations = relations(clients, ({ one }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
}));

// --------------------
// Geography
// --------------------

export const countriesRelations = relations(countries, ({ many }) => ({
  companiesHqs: many(companies),
  companiesOperatingCountries: many(companiesOperatingCountries),
  projects: many(projects),
  dealsCountries: many(dealsCountries),
}));

// --------------------
// Core
// --------------------

export const projectSectorsRelations = relations(
  projectSectors,
  ({ many }) => ({
    technologies: many(technologies),
    projectsSectors: many(projectsSectors),
  })
);

export const companySectorsRelations = relations(
  companySectors,
  ({ many }) => ({
    technologies: many(technologies),
    companiesSectors: many(companiesSectors),
  })
);

export const technologiesRelations = relations(
  technologies,
  ({ one, many }) => ({
    projectSector: one(projectSectors, {
      fields: [technologies.projectSector],
      references: [projectSectors.id],
    }),
    companySector: one(companySectors, {
      fields: [technologies.companySector],
      references: [companySectors.id],
    }),
    companiesTechnologies: many(companiesTechnologies),
    projectsTechnologies: many(projectsTechnologies),
  })
);

// Companies
export const companiesRelations = relations(companies, ({ one, many }) => ({
  hqCountry: one(countries, {
    fields: [companies.hqCountry],
    references: [countries.code],
  }),
  companiesOperatingCountries: many(companiesOperatingCountries),
  companiesSectors: many(companiesSectors),
  companiesTechnologies: many(companiesTechnologies),
  companiesEmployees: many(companiesEmployees),
  projectsCompanies: many(projectsCompanies),
  dealsCompanies: many(dealsCompanies),
  documents: many(documents),
  eventOrganizer: one(eventOrganizers),
}));

export const companiesOperatingCountriesRelations = relations(
  companiesOperatingCountries,
  ({ one }) => ({
    company: one(companies, {
      fields: [companiesOperatingCountries.companyId],
      references: [companies.id],
    }),
    country: one(countries, {
      fields: [companiesOperatingCountries.countryCode],
      references: [countries.code],
    }),
  })
);

export const companiesSectorsRelations = relations(
  companiesSectors,
  ({ one }) => ({
    company: one(companies, {
      fields: [companiesSectors.companyId],
      references: [companies.id],
    }),
    sector: one(companySectors, {
      fields: [companiesSectors.sector],
      references: [companySectors.id],
    }),
  })
);

export const companiesTechnologiesRelations = relations(
  companiesTechnologies,
  ({ one }) => ({
    company: one(companies, {
      fields: [companiesTechnologies.companyId],
      references: [companies.id],
    }),
    technology: one(technologies, {
      fields: [companiesTechnologies.technology],
      references: [technologies.id],
    }),
  })
);

export const employeesRelations = relations(employees, ({ many }) => ({
  companiesEmployees: many(companiesEmployees),
}));

export const companiesEmployeesRelations = relations(
  companiesEmployees,
  ({ one }) => ({
    company: one(companies, {
      fields: [companiesEmployees.companyId],
      references: [companies.id],
    }),
    employee: one(employees, {
      fields: [companiesEmployees.employeeId],
      references: [employees.id],
    }),
  })
);

// Projects
export const projectsRelations = relations(projects, ({ many, one }) => ({
  country: one(countries, {
    fields: [projects.country],
    references: [countries.code],
  }),
  projectsSectors: many(projectsSectors),
  projectsTechnologies: many(projectsTechnologies),
  projectsCompanies: many(projectsCompanies),
  details: one(projectDetails),
  proposal: one(proposals),
  // opportunity: one(opportunities),
  dealsAssets: many(dealsAssets),
  documents: many(documents),
}));

export const projectsSectorsRelations = relations(
  projectsSectors,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectsSectors.projectId],
      references: [projects.id],
    }),
    sector: one(projectSectors, {
      fields: [projectsSectors.sector],
      references: [projectSectors.id],
    }),
  })
);

export const projectsTechnologiesRelations = relations(
  projectsTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectsTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectsTechnologies.technology],
      references: [technologies.id],
    }),
  })
);

export const projectDetailsRelations = relations(projectDetails, ({ one }) => ({
  project: one(projects, {
    fields: [projectDetails.projectId],
    references: [projects.id],
  }),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  project: one(projects, {
    fields: [proposals.projectId],
    references: [projects.id],
  }),
}));

// export const opportunitiesRelations = relations(opportunities, ({ one }) => ({
//   project: one(projects, { fields: [opportunities.projectId], references: [projects.id] }),
// }));

export const projectsCompaniesRelations = relations(
  projectsCompanies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectsCompanies.projectId],
      references: [projects.id],
    }),
    company: one(companies, {
      fields: [projectsCompanies.companyId],
      references: [companies.id],
    }),
  })
);

// Deals
export const dealSubtypesRelations = relations(dealSubtypes, ({ many }) => ({
  deals: many(deals),
}));

export const dealsRelations = relations(deals, ({ many, one }) => ({
  subtype: one(dealSubtypes, {
    fields: [deals.subtype],
    references: [dealSubtypes.id],
  }),
  dealsCountries: many(dealsCountries),
  dealsAssets: many(dealsAssets),
  dealsCompanies: many(dealsCompanies),
  financials: many(dealFinancials),
  mergerAcquisition: one(mergersAcquisitions),
  financing: one(financing),
  powerPurchaseAgreement: one(powerPurchaseAgreements),
  jointVenture: one(jointVentures),
  documents: many(documents),
}));

export const dealsCountriesRelations = relations(dealsCountries, ({ one }) => ({
  deal: one(deals, { fields: [dealsCountries.dealId], references: [deals.id] }),
  country: one(countries, {
    fields: [dealsCountries.countryCode],
    references: [countries.code],
  }),
}));

export const dealsAssetsRelations = relations(dealsAssets, ({ one }) => ({
  deal: one(deals, { fields: [dealsAssets.dealId], references: [deals.id] }),
  asset: one(projects, {
    fields: [dealsAssets.assetId],
    references: [projects.id],
  }),
}));

export const dealsCompaniesRelations = relations(dealsCompanies, ({ one }) => ({
  deal: one(deals, { fields: [dealsCompanies.dealId], references: [deals.id] }),
  company: one(companies, {
    fields: [dealsCompanies.companyId],
    references: [companies.id],
  }),
}));

export const dealFinancialsRelations = relations(dealFinancials, ({ one }) => ({
  deal: one(deals, { fields: [dealFinancials.dealId], references: [deals.id] }),
}));

export const mergersAcquisitionsRelations = relations(
  mergersAcquisitions,
  ({ one }) => ({
    deal: one(deals, {
      fields: [mergersAcquisitions.dealId],
      references: [deals.id],
    }),
  })
);

export const financingRelations = relations(financing, ({ one }) => ({
  deal: one(deals, { fields: [financing.dealId], references: [deals.id] }),
}));

export const powerPurchaseAgreementsRelations = relations(
  powerPurchaseAgreements,
  ({ one }) => ({
    deal: one(deals, {
      fields: [powerPurchaseAgreements.dealId],
      references: [deals.id],
    }),
  })
);

export const jointVenturesRelations = relations(jointVentures, ({ one }) => ({
  deal: one(deals, { fields: [jointVentures.dealId], references: [deals.id] }),
}));

// Documents
export const documentsRelations = relations(documents, ({ one }) => ({
  deal: one(deals, { fields: [documents.dealId], references: [deals.id] }),
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  company: one(companies, {
    fields: [documents.companyId],
    references: [companies.id],
  }),
}));

// --------------------
// Content (Blog, News & Research)
// --------------------

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, { fields: [authors.userId], references: [users.id] }),
  content: many(content),
  editedBlogPosts: many(blogPosts),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  author: one(authors, {
    fields: [content.authorId],
    references: [authors.id],
  }),
  tags: many(contentTags),
  blogPost: one(blogPosts),
  newsArticle: one(newsArticles),
  researchReport: one(researchReports),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  contents: many(contentTags),
}));

export const contentTagsRelations = relations(contentTags, ({ one }) => ({
  content: one(content, {
    fields: [contentTags.contentSlug],
    references: [content.slug],
  }),
  tag: one(tags, { fields: [contentTags.tagId], references: [tags.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  content: one(content, {
    fields: [blogPosts.slug],
    references: [content.slug],
  }),
  editor: one(authors, {
    fields: [blogPosts.editorId],
    references: [authors.id],
  }),
}));

export const newsArticlesRelations = relations(newsArticles, ({ one }) => ({
  content: one(content, {
    fields: [newsArticles.slug],
    references: [content.slug],
  }),
}));

export const researchReportsRelations = relations(
  researchReports,
  ({ one }) => ({
    content: one(content, {
      fields: [researchReports.slug],
      references: [content.slug],
    }),
  })
);

export const eventOrganizersRelations = relations(
  eventOrganizers,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [eventOrganizers.companyId],
      references: [companies.id],
    }),
    events: many(events),
  })
);

export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(eventOrganizers, {
    fields: [events.organizerId],
    references: [eventOrganizers.id],
  }),
}));

// ########################################
// VIEWS
// ########################################

// --------------------
// (Non-Materialized) Views
// --------------------
export const companyPortfolios = pgView("company_portfolios").as((qb) =>
  qb
    .select({
      companyId: aliasedColumn(companies.id, "company_id"),
      companyName: aliasedColumn(companies.name, "company_name"),
      dealsCount: count(deals.id).as("deals_count"),
      dealsValue: sum(deals.amount).as("deals_value"),
      totalPortfolio: sum(projects.plantCapacity).mapWith(Number).as("total_portfolio"),
      inDevelopmentPortfolio: sum(
        sql<number>`case when ${projects.stage} = 'in_development' then ${projects.plantCapacity} else 0 end`
      )
        .mapWith(Number)
        .as("in_development_portfolio"),
      inConstructionPortfolio: sum(
        sql<number>`case when ${projects.stage} = 'in_construction' then ${projects.plantCapacity} else 0 end`
      )
        .mapWith(Number)
        .as("in_construction_portfolio"),
      operationalPortfolio: sum(
        sql<number>`case when ${projects.stage} = 'operational' then ${projects.plantCapacity} else 0 end`
      )
        .mapWith(Number)
        .as("operational_portfolio"),
    })
    .from(companies)
    .leftJoin(projectsCompanies, eq(companies.id, projectsCompanies.companyId))
    .leftJoin(projects, eq(projectsCompanies.projectId, projects.id))
    .leftJoin(dealsCompanies, eq(companies.id, dealsCompanies.companyId))
    .leftJoin(deals, eq(dealsCompanies.dealId, deals.id))
    // .where(
    //   sql`extract(year from ${deals.date}) = extract(year from current_date)`
    // )
    .groupBy(companies.id)
);

export const dealDetails = pgView("deal_details").as((qb) => {
  const assetsDetails = qb.$with("assets_details").as(
    qb
      .select({
        dealId: dealsAssets.dealId,
        assetNames: sql<string[]>`array_agg(distinct ${projects.name})`.as(
          "asset_names"
        ),
        totalCapacity: sum(projects.plantCapacity).as("total_capacity"),
        subSectors: sql<
          (typeof projectSubSector.enumValues)[number]
        >`array_agg(distinct x.sub_sector) filter (where x.sub_sector is not null)`.as(
          "assets_sub_sectors"
        ),
        segments: sql<
          (typeof segment.enumValues)[number]
        >`array_agg(distinct y.segment) filter (where y.segment is not null)`.as(
          "assets_segments"
        ),
        // totalColocatedStorageCapacity: sum(
        //   projects.colocatedStorageCapacity
        // ).as("total_colocated_storage_capacity"),
        lifecycle: sql<
          Record<string, (typeof projectStage.enumValues)[number]>
        >`jsonb_object_agg(${projects.name}, ${projects.stage})`.as(
          "lifecycle"
        ),
      })
      .from(dealsAssets)
      .innerJoin(projects, eq(dealsAssets.assetId, projects.id))
      .leftJoinLateral(
        sql`unnest(${projects.subSectors}) as x(sub_sector)`,
        sql`true`
      )
      .leftJoinLateral(
        sql`unnest(${projects.segments}) as y(segment)`,
        sql`true`
      )
      .groupBy(dealsAssets.dealId)
  );

  const companiesDetails = qb.$with("companies_details").as(
    qb
      .select({
        dealId: dealsCompanies.dealId,
        companiesNames: sql<string[]>`array_agg(distinct ${companies.name})`.as(
          "companies_names"
        ),
        categories: sql<
          Record<string, (typeof companyClassification.enumValues)[number]>
        >`jsonb_object_agg(${companies.name}, ${companies.classification})`.as(
          "categories"
        ),
      })
      .from(dealsCompanies)
      .innerJoin(companies, eq(dealsCompanies.companyId, companies.id))
      .groupBy(dealsCompanies.dealId)
  );

  return qb
    .with(assetsDetails, companiesDetails)
    .select({
      dealId: aliasedColumn(deals.id, "deal_id"),
      dealUpdate: aliasedColumn(deals.update, "deal_update"),
      assetNames: assetsDetails.assetNames,
      totalCapacity: assetsDetails.totalCapacity,
      subSectors: aliasedColumn(assetsDetails.subSectors, "sub_sectors"),
      segments: aliasedColumn(assetsDetails.segments, "segments"),
      // colocatedStorageCapacity: aliasedColumn(
      //   assetsDetails.totalColocatedStorageCapacity,
      //   "colocated_storage_capacity"
      // ),
      assetLifecycle: aliasedColumn(assetsDetails.lifecycle, "asset_lifecycle"),
      involvedCompanies: aliasedColumn(
        companiesDetails.companiesNames,
        "involved_companies"
      ),
      companiesCategories: aliasedColumn(
        companiesDetails.categories,
        "companies_categories"
      ),
    })
    .from(deals)
    .leftJoin(assetsDetails, eq(deals.id, assetsDetails.dealId))
    .leftJoin(companiesDetails, eq(deals.id, companiesDetails.dealId));
});

// --------------------
// Materialized Views
// --------------------

// View for: Stacked column chart of deal counts by type over time
export const dealsByMonthAndType = pgMaterializedView(
  "deals_by_month_and_type"
).as((qb) =>
  qb
    .select({
      month: sql<string>`TO_CHAR(${deals.date}, 'YYYY-MM')`.as("month"),
      dealType: aliasedColumn(deals.type, "deal_type"),
      dealCount: countDistinct(deals.id).as("deal_count"),
    })
    .from(deals)
    .groupBy(sql`month`, deals.type)
    .orderBy(sql`month`, deals.type)
);

// View for: Stacked column chart of financing deals (amount) by financing type over time
export const financingDealsByMonthAndType = pgMaterializedView(
  "financing_deals_by_month_and_type"
).as((qb) => {
  // 1. Define a Common Table Expression (CTE) to unnest the array first.
  // This creates a clean, flat list of rows to aggregate.
  const unnestedDeals = qb.$with("unnested_deals").as(
    qb
      .select({
        month: sql<string>`TO_CHAR(${deals.date}, 'YYYY-MM')`.as("month"),
        dealId: deals.id,
        amount: deals.amount,
        // The UNNEST function is the key part, creating a row for each financing type.
        financingType: sql<
          (typeof dealFinancingType.enumValues)[number]
        >`UNNEST(${financing.financingType})`.as("financing_type"),
      })
      .from(deals)
      .innerJoin(financing, eq(deals.id, financing.dealId))
      .where(and(eq(deals.type, "financing"), isNotNull(deals.amount)))
  );

  // 2. Perform the final aggregation on the CTE.
  // This guarantees that the combination of (month, financingType) will be unique.
  return qb
    .with(unnestedDeals) // Important: Tell the query builder to use the CTE
    .select({
      month: unnestedDeals.month,
      financingType: unnestedDeals.financingType,
      totalAmount: sum(unnestedDeals.amount).mapWith(Number).as("total_amount"),
      dealCount: countDistinct(unnestedDeals.dealId).as("deal_count"),
    })
    .from(unnestedDeals) // Select FROM the CTE
    .groupBy(unnestedDeals.month, unnestedDeals.financingType)
    .orderBy(unnestedDeals.month, unnestedDeals.financingType);
});

// View for: PPA Deals categorized by the Offtaker's primary sector
export const ppaDealsByOfftakerSector = pgMaterializedView(
  "ppa_deals_by_offtaker_sector"
).as((qb) => {
  return qb
    .select({
      offtakerSector: aliasedColumn(companiesSectors.sector, "offtaker_sector"),
      dealCount: countDistinct(deals.id).as("deal_count"),
    })
    .from(deals)
    .innerJoin(
      dealsCompanies,
      and(
        eq(deals.id, dealsCompanies.dealId),
        eq(dealsCompanies.role, "offtaker")
      )
    )
    .innerJoin(
      companiesSectors,
      eq(dealsCompanies.companyId, companiesSectors.companyId)
    )
    .where(eq(deals.type, "power_purchase_agreement"))
    .groupBy(companiesSectors.sector)
    .orderBy(sql`deal_count`);
});

// View for: PPA Deals categorized by subtype (Utility vs. Corporate)
export const ppaDealsBySubtype = pgMaterializedView("ppa_deals_by_subtype").as(
  (qb) => {
    return qb
      .select({
        subtype: deals.subtype,
        dealCount: countDistinct(deals.id).as("deal_count"),
      })
      .from(deals)
      .where(eq(deals.type, "power_purchase_agreement"))
      .groupBy(deals.subtype)
      .orderBy(sql<number>`deal_count`);
  }
);

// View for: PPA Deals categorized by contract duration
export const ppaDealsByDuration = pgMaterializedView(
  "ppa_deals_by_duration"
).as((qb) => {
  return qb
    .select({
      duration: powerPurchaseAgreements.duration,
      dealCount: countDistinct(powerPurchaseAgreements.dealId).as("deal_count"),
    })
    .from(powerPurchaseAgreements)
    .groupBy(powerPurchaseAgreements.duration)
    .orderBy(powerPurchaseAgreements.duration);
});

// View for: Combo chart of project investment and capacity, stacked by sector, over time
export const projectsByMonthAndSector = pgMaterializedView(
  "projects_by_month_and_sector"
).as((qb) => {
  const projectDates = qb.$with("project_dates").as(
    qb
      .select({
        projectId: projects.id,
        effectiveDate: sql`
          COALESCE(
            MAX(${deals.date}) FILTER (WHERE ${deals.type} = 'project_update'),
            ${projects.createdAt}::date
          )
        `.as("effective_date"),
      })
      .from(projects)
      .leftJoin(dealsAssets, eq(projects.id, dealsAssets.assetId))
      .leftJoin(deals, eq(dealsAssets.dealId, deals.id))
      .groupBy(projects.id)
  );

  return qb
    .with(projectDates)
    .select({
      month: sql<string>`TO_CHAR(${projectDates.effectiveDate}, 'YYYY-MM')`.as(
        "month"
      ),
      sector: projectsSectors.sector,
      totalCapacity: sql`COALESCE(SUM(${projects.plantCapacity}), 0)`
        .mapWith(Number)
        .as("total_capacity"),
      totalAmount: sql`COALESCE(SUM(${projects.investmentCosts}), 0)`
        .mapWith(Number)
        .as("total_amount"),
    })
    .from(projectDates)
    .innerJoin(projects, eq(projectDates.projectId, projects.id))
    .innerJoin(projectsSectors, eq(projects.id, projectsSectors.projectId))
    .groupBy(sql`month`, projectsSectors.sector)
    .orderBy(sql`month`, projectsSectors.sector);
});

// View for: Stacked column chart of project counts by stage over time
export const projectsByMonthAndStage = pgMaterializedView(
  "projects_by_month_and_stage"
).as((qb) => {
  const projectDates = qb.$with("project_dates").as(
    qb
      .select({
        projectId: projects.id,
        effectiveDate: sql`
          COALESCE(
            MAX(${deals.date}) FILTER (WHERE ${deals.type} = 'project_update'),
            ${projects.createdAt}::date
          )
        `.as("effective_date"),
      })
      .from(projects)
      .leftJoin(dealsAssets, eq(projects.id, dealsAssets.assetId))
      .leftJoin(deals, eq(dealsAssets.dealId, deals.id))
      .groupBy(projects.id)
  );

  return qb
    .with(projectDates)
    .select({
      month: sql<string>`TO_CHAR(${projectDates.effectiveDate}, 'YYYY-MM')`.as(
        "month"
      ),
      projectStage: aliasedColumn(projects.stage, "project_stage"),
      projectCount: countDistinct(projects.id).as("project_count"),
    })
    .from(projects)
    .where(isNotNull(projects.stage))
    .groupBy(sql`month`, projects.stage)
    .orderBy(sql`month`, projects.stage);
});

export const projectsBySector = pgMaterializedView("projects_by_sector").as(
  (qb) => {
    const projectDates = qb.$with("project_dates").as(
      qb
        .select({
          projectId: projects.id,
          effectiveDate: sql`
          COALESCE(
            MAX(${deals.date}) FILTER (WHERE ${deals.type} = 'project_update'),
            ${projects.createdAt}::date
          )
        `.as("effective_date"),
        })
        .from(projects)
        .leftJoin(dealsAssets, eq(projects.id, dealsAssets.assetId))
        .leftJoin(deals, eq(dealsAssets.dealId, deals.id))
        .groupBy(projects.id)
    );

    const sectorCounts = qb.$with("sector_counts").as(
      qb
        .select({
          projectCount: countDistinct(projects.id).as("project_count"),
          sector: projectsSectors.sector,
        })
        .from(projectDates)
        .innerJoin(projects, eq(projectDates.projectId, projects.id))
        .innerJoin(projectsSectors, eq(projects.id, projectsSectors.projectId))
        .where(
          and(
            sql`EXTRACT(YEAR FROM ${projectDates.effectiveDate}) = EXTRACT(YEAR FROM CURRENT_DATE)`,
            sql`EXTRACT(MONTH FROM ${projectDates.effectiveDate}) = EXTRACT(MONTH FROM CURRENT_DATE)`
          )
        )
        .groupBy(projectsSectors.sector)
    );

    return qb
      .with(projectDates, sectorCounts)
      .select({
        sector: sectorCounts.sector,
        projectCount: sectorCounts.projectCount,
        percentage:
          sql`ROUND(100 * ${sectorCounts.projectCount} / SUM(${sectorCounts.projectCount}) OVER (), 0)`
            .mapWith(Number)
            .as("percentage"),
      })
      .from(sectorCounts)
      .orderBy(desc(sectorCounts.projectCount));
  }
);

export const topCountriesByDealValue = pgMaterializedView(
  "top_countries_by_deal_value"
).as((qb) => {
  const countryDeals = qb.$with("country_deals").as(
    qb
      .select({
        countryCode: aliasedColumn(countries.code, "country_code"),
        dealValue: sql`sum(${deals.amount})`.mapWith(Number).as("deal_value"),
        dealCount: countDistinct(deals.id).as("deal_count"),
        month: sql<string>`TO_CHAR(${deals.date}, 'YYYY-MM')`.as("month"),
      })
      .from(countries)
      .innerJoin(dealsCountries, eq(countries.code, dealsCountries.countryCode))
      .innerJoin(
        deals,
        and(eq(dealsCountries.dealId, deals.id), eq(deals.type, "financing"))
      )
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${deals.date}) = EXTRACT(YEAR FROM CURRENT_DATE)`,
          sql`EXTRACT(MONTH FROM ${deals.date}) = EXTRACT(MONTH FROM CURRENT_DATE)`
        )
      )
      .groupBy(countries.code, sql`month`)
  );

  const countryCapacity = qb.$with("country_capacity").as(
    qb
      .select({
        code: countries.code,
        totalCapacity: sql<number>`SUM(${projects.plantCapacity})`
          .mapWith(Number)
          .as("total_capacity"),
      })
      .from(countries)
      .innerJoin(projects, eq(projects.country, countries.code))
      .groupBy(countries.code)
  );

  return qb
    .with(countryDeals, countryCapacity)
    .select({
      countryCode: countryDeals.countryCode,
      dealValue: countryDeals.dealValue,
      dealCount: countryDeals.dealCount,
      totalCapacity: countryCapacity.totalCapacity,
      rank: sql<number>`RANK() OVER (ORDER BY COALESCE(${countryDeals.dealValue}, 0) DESC)`.as(
        "rank"
      ),
    })
    .from(countryDeals)
    .leftJoin(
      countryCapacity,
      eq(countryDeals.countryCode, countryCapacity.code)
    )
    .orderBy(sql`rank ASC`, desc(countryDeals.dealValue))
    .limit(5);
});

export const topCompaniesByFinancingAndCapacity = pgMaterializedView(
  "top_companies_by_financing_and_capacity"
).as((qb) => {
  const companyFundraising = qb.$with("company_fundraising").as(
    qb
      .select({
        companyId: dealsCompanies.companyId,
        totalFundraising: sql`sum(${deals.amount})`
          .mapWith(Number)
          .as("total_fundraising"),
        dealCount: countDistinct(deals.id).as("deal_count"),
      })
      .from(dealsCompanies)
      .innerJoin(
        deals,
        and(eq(dealsCompanies.dealId, deals.id), eq(deals.type, "financing"))
      )
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${deals.date}) = EXTRACT(YEAR FROM CURRENT_DATE)`,
          sql`EXTRACT(MONTH FROM ${deals.date}) = EXTRACT(MONTH FROM CURRENT_DATE)`
        )
      )
      .groupBy(dealsCompanies.companyId)
  );

  const projectDates = qb.$with("project_dates").as(
    qb
      .select({
        projectId: projects.id,
        effectiveDate: sql`
          COALESCE(
            MAX(${deals.date}) FILTER (WHERE ${deals.type} = 'project_update'),
            ${projects.createdAt}::date
          )
        `.as("effective_date"),
      })
      .from(projects)
      .leftJoin(dealsAssets, eq(projects.id, dealsAssets.assetId))
      .leftJoin(deals, eq(dealsAssets.dealId, deals.id))
      .groupBy(projects.id)
  );

  const companyPortfolio = qb.$with("company_portfolio").as(
    qb
      .select({
        companyId: projectsCompanies.companyId,
        totalCapacity: sql`sum(${projects.plantCapacity})`
          .mapWith(Number)
          .as("total_capacity"),
      })
      .from(projectsCompanies)
      .innerJoin(projects, eq(projectsCompanies.projectId, projects.id))
      .innerJoin(projectDates, eq(projects.id, projectDates.projectId))
      .where(
        and(
          eq(projectsCompanies.role, "sponsor"),
          sql`EXTRACT(YEAR FROM ${projectDates.effectiveDate}) = EXTRACT(YEAR FROM CURRENT_DATE)`,
          sql`EXTRACT(MONTH FROM ${projectDates.effectiveDate}) = EXTRACT(MONTH FROM CURRENT_DATE)`
        )
      )
      .groupBy(projectsCompanies.companyId)
  );

  return qb
    .with(companyFundraising, companyPortfolio, projectDates)
    .select({
      companyId: companies.id,
      companyName: companies.name,
      logoUrl: companies.logoUrl,
      dealCount: companyFundraising.dealCount,
      totalFundraising: sql`coalesce(${companyFundraising.totalFundraising}, 0)`
        .mapWith(Number)
        .as("total_fundraising"),
      totalCapacity: sql`coalesce(${companyPortfolio.totalCapacity}, 0)`
        .mapWith(Number)
        .as("total_capacity"),
    })
    .from(companies)
    .leftJoin(
      companyFundraising,
      eq(companies.id, companyFundraising.companyId)
    )
    .leftJoin(companyPortfolio, eq(companies.id, companyPortfolio.companyId))
    .orderBy(desc(sql`total_fundraising`), desc(sql`total_capacity`));
});

export const countriesByCapacityAndFinancing = pgMaterializedView(
  "countries_by_capacity_and_financing"
).as((qb) => {
  const countryFinancing = qb.$with("country_financing").as(
    qb
      .select({
        countryCode: aliasedColumn(countries.code, "country_code"),
        dealValue: sql`sum(${deals.amount})`.mapWith(Number).as("deal_value"),
      })
      .from(countries)
      .innerJoin(dealsCountries, eq(countries.code, dealsCountries.countryCode))
      .innerJoin(
        deals,
        and(eq(dealsCountries.dealId, deals.id), eq(deals.type, "financing"))
      )
      .groupBy(countries.code)
  );

  const countryProjects = qb.$with("country_projects").as(
    qb
      .select({
        countryCode: aliasedColumn(countries.code, "country_code"),
        projectCount: countDistinct(projects.id).as("project_count"),
        totalCapacity: sql<number>`SUM(${projects.plantCapacity})`
          .mapWith(Number)
          .as("total_capacity"),
        investments: sql<number>`SUM(${projects.investmentCosts})`
          .mapWith(Number)
          .as("investments"),
      })
      .from(countries)
      .innerJoin(projects, eq(projects.country, countries.code))
      .groupBy(countries.code)
  );

  return qb
    .with(countryFinancing, countryProjects)
    .select({
      countryCode: countryFinancing.countryCode,
      financing:
        sql<number>`GREATEST(${countryFinancing.dealValue}, ${countryProjects.investments})`.as(
          "financing"
        ),
      totalCapacity: countryProjects.totalCapacity,
      projectCount: countryProjects.projectCount,
    })
    .from(countryFinancing)
    .leftJoin(
      countryProjects,
      eq(countryFinancing.countryCode, countryProjects.countryCode)
    )
    .orderBy(
      desc(countryProjects.totalCapacity),
      desc(
        sql`GREATEST(${countryFinancing.dealValue}, ${countryProjects.investments})`
      )
    );
});
