import {
  Country,
  DealCompanyRole,
  DealSubtype,
  DealType,
  Region,
  Sector,
  SubSector,
  Technology,
} from "./types";
import {
  companySector,
  projectSector,
  companySubSector,
  projectSubSector,
} from "./db/schema";

export const DEFAULT_PAGE_SIZE = 10;
export const BLOG_PAGE_SIZE = 6;
export const NEWS_PAGE_SIZE = 4;
export const RESEARCH_PAGE_SIZE = 3;

export const PROJECT_COMPANY_ROLES = [
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
];

export const REGIONS_COUNTRIES: Record<Region, Country[]> = {
  north_africa: ["DZ", "EG", "LY", "MA", "SD", "TN", "EH"],
  central_africa: ["AO", "CM", "CF", "TD", "CG", "CD", "GQ", "GA", "ST"],
  west_africa: [
    "BJ",
    "BF",
    "CV",
    "CI",
    "GM",
    "GH",
    "GN",
    "GW",
    "LR",
    "ML",
    "MR",
    "NE",
    "NG",
    "SN",
    "SL",
    "TG",
  ],
  east_africa: [
    "BI",
    "KM",
    "DJ",
    "ER",
    "ET",
    "KE",
    "MG",
    "MW",
    "MU",
    "YT",
    "MZ",
    "RE",
    "RW",
    "SC",
    "SO",
    "SS",
    "TZ",
    "UG",
    "ZM",
    "ZW",
  ],
  southern_africa: ["BW", "LS", "NA", "ZA", "SZ"],
};

export const SECTORS: Sector[] = [...new Set([...companySector.enumValues, ...projectSector.enumValues])];
export const SECTORS_TECHNOLOGIES: Partial<Record<Sector, Technology[]>> = {
  solar: [
    "photovoltaic",
    "concentrated_solar_power",
    "solar_home_systems",
    "concentrated_photovoltaic",
  ],
  wind: ["onshore_wind", "offshore_wind"],
  hydro: ["small_hydro", "large_hydro"],
  battery: ["bess", "lithium_ion"],
  biomass: ["biogas", "waste"],
  oil_gas: ["oil", "gas", "coal"],
  utilities: ["mini_grid", "decentralised", "high_voltage_transmission_lines"],
  hydrogen: ["hydrogen"],
  geothermal: ["geothermal"],
  nuclear: ["nuclear"],
};
export const SUB_SECTORS: SubSector[] = [...companySubSector.enumValues, ...projectSubSector.enumValues];


export const DEAL_TYPES_SUBTYPES: Record<DealType, DealSubtype[]> = {
  merger_acquisition: ["asset", "ma_corporate"],
  financing: ["debt", "equity", "grant"],
  power_purchase_agreement: ["utility", "ppa_corporate"],
  joint_venture: [
    "joint_venture",
    "strategic_partnership_agreement",
    "strategic_collaboration",
  ],
  project_update: [
    "early_stage",
    "late_stage",
    "ready_to_build",
    "in_construction",
    "operational",
    "proposal",
  ],
};

export const DEAL_COMPANY_ROLES: Record<DealType, DealCompanyRole[]> = {
  merger_acquisition: [
    "offtaker",
    "buyer",
    "seller",
    "advisor",
    "financial_advisor",
    "technical_advisor",
    "legal_advisor",
    "lead_arranger",
  ],
  financing: [
    "investor",
    "advisor",
    "financial_advisor",
    "technical_advisor",
    "legal_advisor",
  ],
  power_purchase_agreement: [],
  joint_venture: [],
  project_update: [],
};

export const DEAL_ADVISORS = [
  "advisor",
  "legal_advisor",
  "financial_advisor",
  "technical_advisor",
];

export const COUNTRIES_ISO_3166_CODE: Record<string, Country> = {
  // A
  algeria: "DZ",
  algérie: "DZ",
  angola: "AO",
  // B
  benin: "BJ",
  bénin: "BJ",
  botswana: "BW",
  "burkina faso": "BF",
  burundi: "BI",
  // C
  cameroon: "CM",
  cameroun: "CM",
  "cabo verde": "CV",
  "cape verde": "CV",
  "cap-vert": "CV",
  "central african republic": "CF",
  "république centrafricaine": "CF",
  chad: "TD",
  tchad: "TD",
  comoros: "KM",
  comores: "KM",
  congo: "CG",
  "congo, republic of": "CG",
  "republic of congo": "CG",
  "democratic republic of congo": "CD",
  "congo-kinshasa": "CD",
  "congo-brazzaville": "CD",
  drc: "CD",
  rdc: "CD",
  "congo, république démocratique": "CD",
  "république démocratique du congo": "CD",
  "côte d'ivoire": "CI",
  "cote d'ivoire": "CI",
  "ivory coast": "CI",
  // D
  djibouti: "DJ",
  // E
  egypt: "EG",
  égypte: "EG",
  "equatorial guinea": "GQ",
  "guinée équatoriale": "GQ",
  eritrea: "ER",
  érythrée: "ER",
  eswatini: "SZ",
  swaziland: "SZ", // Common former name
  ethiopia: "ET",
  éthiopie: "ET",
  // G
  gabon: "GA",
  gambia: "GM",
  gambie: "GM",
  ghana: "GH",
  guinea: "GN",
  guinée: "GN",
  "guinea-bissau": "GW",
  "guinée-bissau": "GW",
  // K
  kenya: "KE",
  // L
  lesotho: "LS",
  liberia: "LR",
  libéria: "LR",
  libya: "LY",
  libye: "LY",
  // M
  madagascar: "MG",
  malawi: "MW",
  mali: "ML",
  mauritania: "MR",
  mauritanie: "MR",
  mauritius: "MU",
  "île maurice": "MU",
  mayotte: "YT",
  morocco: "MA",
  maroc: "MA",
  mozambique: "MZ",
  // N
  namibia: "NA",
  namibie: "NA",
  niger: "NE",
  nigeria: "NG",
  // R
  réunion: "RE",
  reunion: "RE",
  rwanda: "RW",
  // S
  "sao tome and principe": "ST",
  "são tomé and príncipe": "ST",
  "sao tomé-et-principe": "ST",
  senegal: "SN",
  sénégal: "SN",
  seychelles: "SC",
  "sierra leone": "SL",
  somalia: "SO",
  somalie: "SO",
  "south africa": "ZA",
  "afrique du sud": "ZA",
  "south sudan": "SS",
  "soudan du sud": "SS",
  sudan: "SD",
  soudan: "SD",
  // T
  tanzania: "TZ",
  tanzanie: "TZ",
  togo: "TG",
  tunisia: "TN",
  tunisie: "TN",
  // U
  uganda: "UG",
  ouganda: "UG",
  // W
  "western sahara": "EH",
  "sahara occidental": "EH",
  // Z
  zambia: "ZM",
  zambie: "ZM",
  zimbabwe: "ZW",
};