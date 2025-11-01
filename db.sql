-- ########################################
-- EXTENSIONS
-- ########################################

CREATE EXTENSION IF NOT EXISTS postgis;

-- ########################################
-- CUSTOM TYPES
-- ########################################

-- --------------------
-- Enumarated Types
-- --------------------

CREATE TYPE user_role AS ENUM (
    'admin', 'analyst_editor', 'subscriber', 'guest'
);

CREATE TYPE client_profile AS ENUM (
    'deal_advisor', 'developer_ipp', 'investor', 'epc_om', 'public_institution', 'individual'       
);

CREATE TYPE geographic_region AS ENUM (
    'north_africa', 'east_africa', 'west_africa', 'central_africa', 'southern_africa'     
);

CREATE TYPE technology AS ENUM (
    'photovoltaic', 'concentrated_solar_power', 'solar_home_systems', 'concentrated_photovoltaic', -- Solar
    'onshore_wind', 'offshore_wind', -- Wind
    'small_hydro', 'large_hydro', -- Hydro
    'bess', 'lithium_ion', -- Battery
    'biogas', 'waste', -- Biomass
    'oil', 'gas', 'coal', -- Oil & Gas
    'mini_grid', 'decentralised', 'high_voltage_transmission_lines', -- Utilities
    'hydrogen', 'green_hydrogen', -- Hydrogen
    'geothermal', -- Geothermal
    'nuclear', -- Nuclear
    'wave_onshore', 'wave_nearshore',
    'hybrid'
);

CREATE TYPE revenue_model AS ENUM (
    'power_purchase_agreement', 'concession',
    'turnkey', 'flexible', 'trading', 'rental', 'pay_as_you_go'
);

CREATE TYPE segment AS ENUM (
    'generation', 'storage', 'transmission', 'distribution'
);

CREATE TYPE country_code AS ENUM (
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD',
    'CI', 'DJ', 'EG', 'GQ', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS',
    'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG',
    'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'SZ', 'TZ', 'TG',
    'TN', 'UG', 'EH', 'ZM', 'ZW'
);

-- Companies

CREATE TYPE company_size AS ENUM (
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'
);

CREATE TYPE company_operating_status AS ENUM (
    'active', 'operating', 'in_development', 'closed'
);

CREATE TYPE company_activity AS ENUM (
    'merger_acquisition', 'financing', 'offtaker', 'development', 'construction',
    'operation', 'maintenance', 'design', 'engineering', 'ownership', 'energy_trading', 
    'wind', 'procurement', 'investment', 'asset_management', 'transmission', 'hybrid',
    'distribution', 'research_development', 'exploration', 'installation', 'origination',
    'commissioning', 'generation', 'management', 'renewables', 'storage', 'oil', 'gas', 
    'petrochemicals', 'structuring', 'epc', 'manufacturing', 'services', 'infrastructure',
    'production', 'wave_energy', 'geothermal', 'logistics', 'waste-to-energy', 'warehousing',
    'industrial', 'other'
);

CREATE TYPE company_classification AS ENUM (
    'private_equity', 'pe_backed', 'private', 'public',
    'government', 'non_profit',
    'development_finance_institution', 'advisor', 'independent_power_producer', 'epc_om', 'utility',
    'micro_cap', 'small_cap', 'mid_cap', 'big_cap',
    'developer', 'investment', 'operator', 'manufacturer', 'asset_manager', 'energy_trader'
);

CREATE TYPE company_sector AS ENUM (
    'renewables', 'non_renewables',
    'telecom', 'transport', 'mining', 'real_estate', 'industrial', 
    'utilities', 'social', 'water', 'infrastructure', 'other'
);

CREATE TYPE company_sub_sector AS ENUM (
    'solar', 'wind', 'hydro', 'battery', 'hydrogen', 'biomass', 'geothermal',
    'nuclear', 'oil', 'gas', 'coal',
    'telecom', 'university', 'hospital', 'prison', 'mobility', 'road_bridges',
    'hybrid', 'marine', 'bioenergy', 'wave', 'waste-to-energy', 'warehousing', 'logistics'
);

-- Projects

CREATE TYPE project_status AS ENUM (
    'active', 'ongoing', 'cancelled'
);

CREATE TYPE project_sector AS ENUM (
    'solar', 'wind', 'hydro', 'battery', 'hydrogen', 'biomass', 'geothermal',
    'nuclear', 'oil_gas', 'other'
);

CREATE TYPE project_sub_sector AS ENUM (
    'utility_scale', 'commercial_industrial', 'residential', 'offshore', 'onshore', 'cleantech', 'rooftop', 'distributed_renewable', 'lithium'
);

CREATE TYPE project_company_role AS ENUM (
  'special_purpose_vehicle', 'sponsor', 'contractor', 'operations_maintenance', 'equipment_supplier', 'lender', 'advisor', 
  'grid_operator', 'procurement_officer', 'tender_winner' -- Project proposals
  -- 'organizer' -- Opportunities
);

CREATE TYPE project_stage AS ENUM (
    'proposal', -- Project proposals
    -- 'memorandum_understanding', 'partnership_agreement', 'awarded', -- Opportunities
    'announced', 'completed',
    'early_stage', 'late_stage', -- Development stages
    'ready_to_build', 'not_to_proceed',
    'in_development', 'in_construction', 'operational', -- Asset lifecycle
    'revived', 'suspended', 'cancelled'
);

CREATE TYPE project_milestone AS ENUM (
    'financial_closing', 'commissioning', 'project_awarded', 'operational', 
    'construction_started', 'in_construction', 'tendering_procedure_launched', 
    'epc_selection', 'agreement_signed', 'pre_qualification_launched', 
    'initial_approvals', 'ppa_signed', 'om_partner_appointed', 'development_agreement_signed', 
    'licenses_agreement', 'implementation_agreement_signed', '1st_tranche_payment', 
    'project_update', 'construction_restarted', 'power_purchase_agreement', 
    'pre_feasibility_study_completed', 'grid_connection_approved', 'land_transfer_decree', 
    'project_unveiled', 'government_support_agreement_signed', 'call_for_tender', 
    'commercial_operation_started', 'mou_signed', 'project_announced'
);

CREATE TYPE project_contract_type AS ENUM (
    'operate', 'build', 'own', 'transfer', 'maintain', 'design', 'finance', 'lease', 'rehabilitate'
);

CREATE TYPE project_tender_objective AS ENUM (
    'engineering_procurement_construction', 'operations_maintenance', 'finance',
    'commissioning', 'design', 'installation', 'supply', 'testing', 'transfer'
);

-- Deals

CREATE TYPE deal_type AS ENUM (
    'merger_acquisition', 'financing', 'power_purchase_agreement', 'project_update', 'joint_venture'
);

CREATE TYPE deal_subtype AS ENUM (
    'asset', 'ma_corporate', -- Mergers & Acquisitions
    'debt', 'equity', 'grant', -- Financing
    'utility', 'ppa_corporate', -- Power Purchase Agreements
    'joint_venture', 'strategic_partnership_agreement', 'strategic_collaboration', -- Joint-Ventures
    'early_stage', 'late_stage', 'ready_to_build', 'in_construction', 'operational', 'proposal', -- Project Updates
    'completed'
);

CREATE TYPE deal_company_role AS ENUM (
    'buyer', 'seller', 'offtaker', 'supplier', 'lead_arranger', 'investor',
    'legal_advisor', 'technical_advisor', 'financial_advisor', 'advisor',
    'grid_operator', 'joint_venture', 'financing',
    'acquisition_target'
);

CREATE TYPE deal_financing_type AS ENUM (
    'debt', 'equity', 'grant', 'green_bond'
);

CREATE TYPE m_a_structure AS ENUM (
    'acquisition', 'merger', 'divestment', 'ownership_transfer'
);

CREATE TYPE m_a_status AS ENUM (
    'announced', 'completed'
);

CREATE TYPE m_a_specifics AS ENUM (
    'majority_stake', 'minority_stake', 'economic_interest'
);

CREATE TYPE fundraising_status AS ENUM (
    '1st_closing', 'final_closing', 'completed', 'fund_expansion', 'ongoing'
);

CREATE TYPE financing_objective AS ENUM (
    'asset', 'corporate', 'government', 'cleantech'
);

CREATE TYPE financing_investor_type AS ENUM (
    'private_equity', 'development_finance_institution', 'institutional', 'private',
    'public', 'limited_partners', 'government', 'non_profit', 'venture_capital',
    'developer', 'multilateral', 'commercial', 'fund_manager'
);

CREATE TYPE financing_subtype AS ENUM (
    'project_finance', 'loan', 'grant', 'equity', 'private', 'senior_debt', 
    'concessional_loan', 'senior_loan'
);

CREATE TYPE partnership_objective AS ENUM (
    'develop', 'build', 'operate', 'finance'
);

-- Content

CREATE TYPE content_type AS ENUM (
    'blog', 'news', 'research'
);

CREATE TYPE content_category AS ENUM (
    'market-trends', 'policy-regulation', 'infographic', 'industry-insights',
    'solar', 'wind', 'hydro', 'battery', 'hydrogen', 'biomass', 'geothermal',
    'mergers-acquisitions', 'power-purchase-agreements', 'financing', 'projects',
    'interviews', 'case-studies'
);

CREATE TYPE content_status AS ENUM (
    'draft', 'published', 'archived'
);

-- --------------------
-- Composite Types
-- --------------------

CREATE TYPE project_financing_type AS (
    debt INTEGER, -- Debt percentage of funding (0-100)
    equity INTEGER, -- Equity percentage of funding (0-100)
    grants INTEGER -- Grant percentage of funding (0-100)
);

CREATE TYPE project_evaluation_criteria AS (
    technical INTEGER, -- Percentage of evaluation: Technical (0-100)
    financial INTEGER -- Percentage of evaluation: Financial (0-100)
);

-- --------------------
-- Domain Types
-- --------------------

CREATE DOMAIN proposal_evaluation_criteria AS project_evaluation_criteria
CHECK (
    ((VALUE).technical >= 0 AND (VALUE).technical <= 100) AND
    ((VALUE).financial >= 0 AND (VALUE).financial <= 100)
);

CREATE DOMAIN project_financing_strategy AS project_financing_type
CHECK (
    ((VALUE).debt >= 0 AND (VALUE).debt <= 100) AND
    ((VALUE).equity >= 0 AND (VALUE).equity <= 100) AND
    ((VALUE).grants >= 0 AND (VALUE).grants <= 100)
);



-- ########################################
-- TABLES
-- ########################################

-- --------------------
-- Authentication
-- --------------------

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(64) NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    profile_picture_url VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
    -- email_verified BOOLEAN DEFAULT FALSE,
    -- last_login_at TIMESTAMPTZ,
    -- created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- --------------------
-- Geography
-- --------------------

CREATE TABLE IF NOT EXISTS countries (
    code country_code PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    region geographic_region NOT NULL,
    UNIQUE (code, region)
);

-- --------------------
-- Core
-- --------------------

CREATE TABLE IF NOT EXISTS clients ( -- User (guest/subscriber) profiles
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    type client_profile NOT NULL,
    job_title VARCHAR(64),
    company VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS project_sectors (
    id project_sector PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS company_sectors (
    id company_sector PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS technologies (
    id technology PRIMARY KEY,
    project_sector project_sector REFERENCES project_sectors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    company_sector company_sector REFERENCES company_sectors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE (id, project_sector, company_sector)
);

-- Companies

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    website VARCHAR(255),
    logo_url VARCHAR(255) UNIQUE,
    description TEXT, -- Company summary
    founding_date DATE,
    hq_country country_code REFERENCES countries(code) ON DELETE SET NULL, -- NULL if outside Africa
    hq_address VARCHAR(255),
    hq_location GEOGRAPHY(Point, 4326), -- Geographical coordinates (longitude, latitude)
    activities company_activity[] DEFAULT '{}',
    size company_size,
    operating_status company_operating_status[] DEFAULT '{}',
    classification company_classification[] DEFAULT '{}',
    sub_sectors company_sub_sector[] DEFAULT '{}',
    linkedin_profile VARCHAR(255) UNIQUE,
    x_profile VARCHAR(255) UNIQUE,
    facebook_profile VARCHAR(255) UNIQUE,
    email VARCHAR(64) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies_operating_countries (
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    country_code country_code NOT NULL REFERENCES countries(code) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (company_id, country_code)
);

CREATE TABLE IF NOT EXISTS companies_sectors (
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    sector company_sector NOT NULL REFERENCES company_sectors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (company_id, sector)
);

CREATE TABLE IF NOT EXISTS companies_technologies (
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    technology technology NOT NULL REFERENCES technologies(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (company_id, technology)
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    linkedin_profile VARCHAR(255) UNIQUE,
    about TEXT
);

CREATE TABLE IF NOT EXISTS companies_employees (
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    role VARCHAR(64) NOT NULL,
    PRIMARY KEY (company_id, employee_id),
    UNIQUE (company_id, role)
);

-- Projects

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    location GEOGRAPHY(Point, 4326), -- Geographical coordinates (longitude, latitude)
    description TEXT, -- Project summary (or Project specifics, for Opportunities)
    country country_code REFERENCES countries(code) ON DELETE SET NULL, -- NULL if outside Africa
    sub_sectors project_sub_sector[] DEFAULT '{}',
    investment_costs DECIMAL(10, 2), -- in millions USD: Project investment (or Asset costs, for Opportunities) 
    plant_capacity DECIMAL(10, 2), -- Plant capacity (MW)
    stage project_stage,
    -- milestone project_milestone,
    milestone VARCHAR(255),
    status project_status,
    on_off_grid BOOLEAN, -- TRUE if on-grid, FALSE if off-grid
    on_off_shore BOOLEAN, -- TRUE if onshore, FALSE if offshore
    segments segment[] DEFAULT '{}',
    revenue_model revenue_model,
    revenue_model_duration INTEGER, -- Revenue model duration (in years)
    colocated_storage BOOLEAN,
    colocated_storage_capacity VARCHAR(32), -- Co-located storage capacity (MWh)
    contract_type project_contract_type[] DEFAULT '{}',
    financing_strategy JSONB, -- Project financing strategies (Debt, Equity, Grants), e.g., '{"debt": 60, "equity": 30, "grants": 10}'; for: Debt (60%), Equity (30%), Grants (10%).
    funding_secured BOOLEAN,
    impacts TEXT, -- (UN) Sustainable Development Goals
    insights TEXT, -- Insights/Comments
    features TEXT, --e.g., "Greenfield (PPP)"
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects_sectors (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sector project_sector NOT NULL REFERENCES project_sectors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (project_id, sector)
);


CREATE TABLE IF NOT EXISTS projects_technologies (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology technology NOT NULL REFERENCES technologies(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (project_id, technology)
);

CREATE TABLE IF NOT EXISTS project_details ( -- Except Proposals and Opportunities
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    transmission_infrastructure_details TEXT,
    ppa_signed BOOLEAN,
    financial_closing_date DATE,
    eia_approved BOOLEAN,
    grid_connection_approved BOOLEAN,
    construction_start DATE,
    end_date DATE,
    operational_date DATE
);

CREATE TABLE IF NOT EXISTS proposals (
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    tender_objective project_tender_objective,
    bid_submission_deadline DATE,
    evaluation_criteria JSONB, -- Proposal evaluation criteria (Technical, Financial), e.g., '{"technical": 50, "financial": 50}'; for: Technical (50%), Financial (50%).
    bids_received INTEGER, -- Number of bids received
    winning_bid DECIMAL(15, 2) -- Winning bid (USD/kWh)
);

-- CREATE TABLE IF NOT EXISTS opportunities (
--     project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
--     program VARCHAR(255) -- e.g., "BESIPPPP 2"
-- );

CREATE TABLE IF NOT EXISTS projects_companies (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role project_company_role NOT NULL,
    percentage_ownership INTEGER,
    equity_amount DECIMAL(8, 2), -- in $M
    details TEXT,
    PRIMARY KEY (project_id, company_id, role)
);

-- Deals

CREATE TABLE IF NOT EXISTS deal_subtypes (
    id deal_subtype PRIMARY KEY,
    type deal_type NOT NULL,
    UNIQUE (id, type)
);

CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    update TEXT NOT NULL UNIQUE, -- Deal update
    type deal_type NOT NULL,
    subtype deal_subtype,
    amount DECIMAL(10, 2), -- Disclosed deal amount (in millions)
    currency VARCHAR(4) DEFAULT 'USD', -- ISO 4217 currency code (e.g., "USD")
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT, -- Deal summary
    impacts TEXT, -- Environment/SDG impact
    insights TEXT, -- Insights/Comments
    press_release_url VARCHAR(255),
    announcement_date DATE,
    completion_date DATE,
    -- on_off_grid BOOLEAN, -- TRUE if on-grid, FALSE if off-grid
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subtype, type) REFERENCES deal_subtypes (id, type) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS deals_countries ( -- ?? Aggregated from Projects (and/or Companies); if applicable. Else, custom ??
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    country_code country_code NOT NULL REFERENCES countries(code) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (deal_id, country_code)
);

CREATE TABLE IF NOT EXISTS deals_assets ( -- Deals Assets ("Acquisition targets", for M&A Asset deals).
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    -- name UUID NOT NULL REFERENCES projects(name),
    -- capacity DECIMAL(10, 2) REFERENCES projects(plant_capacity),
    -- lifecycle DECIMAL(10, 2) REFERENCES projects(stage),
    -- sub_sectors sub_sector[] REFERENCES projects(sub_sectors),
    -- segments segment[] REFERENCES projects(segments),
    -- on_off_grid BOOLEAN REFERENCES projects(on_off_grid),
    -- colocated_storage_capacity DECIMAL(10, 2) REFERENCES projects(colocated_storage_capacity),
    maturity INTEGER, -- Asset maturity (in years)
    equity_transacted_percentage DECIMAL(5,2),
    PRIMARY KEY (deal_id, asset_id)
);

CREATE TABLE IF NOT EXISTS deals_companies (
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role deal_company_role NOT NULL,
    details TEXT,
    investor_type financing_investor_type, -- Investor type (for Financing deals)
    commitment DECIMAL(10, 2), -- Commitment (in millions USD)
    equity_transacted_percentage DECIMAL(5,2),
    -- category company_classification NOT NULL REFERENCES companies(classification),
    PRIMARY KEY (deal_id, company_id, role)
);

CREATE TABLE IF NOT EXISTS deal_financials (
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    year INTEGER NOT NULL, -- Financial year
    enterprise_value DECIMAL(10,2), -- Enterprise value (in millions USD)
    ebitda DECIMAL(10,2), -- EBITDA (in millions USD)
    debt DECIMAL(10,2), -- Net debt (in millions USD)
    revenue DECIMAL(10,2), -- Revenue (in millions USD)
    cash DECIMAL(10,2), -- Cash and equivalents (in millions USD)
    PRIMARY KEY (deal_id, year)
);

CREATE TABLE IF NOT EXISTS mergers_acquisitions (
    deal_id UUID PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
    status m_a_status, -- TRUE if Completed, FALSE if Announced
    -- total_assets_capacity DECIMAL(10, 2) DEFAULT 0, -- Total assets capacity (MW)
    -- colocated_storage_capacity DECIMAL(10, 2) DEFAULT 0, -- Total Co-located storage capacity (MWh), if applicable
    revenue_model revenue_model,
    revenue_model_duration INTEGER, -- Revenue model duration (in years)
    structure m_a_structure, -- Deal structure
    specifics m_a_specifics[] DEFAULT '{}', -- Deal specifics
    financing_strategy deal_financing_type[] DEFAULT '{}',
    strategy_rationale TEXT
);

CREATE TABLE IF NOT EXISTS financing (
    deal_id UUID PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
    -- company UUID NOT NULL REFERENCES companies(id), -- deal_company_role 'financing', only 1
    -- country country_code NOT NULL REFERENCES companies(hq_country),
    -- project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Only 1 project/asset
    status fundraising_status,
    vehicle VARCHAR(255), -- Investment vehicle name
    objective financing_objective,
    financing_type deal_financing_type[] DEFAULT '{}',
    financing_subtype financing_subtype[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS power_purchase_agreements (
    deal_id UUID PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
    duration INTEGER, -- PPA duration (in years)
    details BOOLEAN, -- TRUE if long-term PPA, FALSE if short-term
    capacity DECIMAL(10, 2), -- Capacity off-taken (MW)
    generated_power DECIMAL(10, 2), -- Generated power off-taken (GWh/year)
    on_off_site BOOLEAN, -- TRUE if onsite, FALSE if offsite
    asset_operational_date DATE,
    supply_start DATE
);

CREATE TABLE IF NOT EXISTS joint_ventures (
    deal_id UUID PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
    partnership_objectives partnership_objective[] DEFAULT '{}'
);

-- Documents

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) UNIQUE NOT NULL,
    publisher VARCHAR(255),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE, -- If applicable
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- If applicable 
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- If applicable
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- --------------------
-- Content (Blog, News & Research)
-- --------------------

CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title VARCHAR(255),
    bio TEXT,
    linkedin_profile VARCHAR(255) UNIQUE,
    x_profile VARCHAR(255) UNIQUE,
    user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE SET NULL -- If applicable
);

CREATE TABLE IF NOT EXISTS content (
    slug VARCHAR(200) PRIMARY KEY,
    type content_type NOT NULL,
    title VARCHAR(72) NOT NULL,
    summary TEXT NOT NULL,
    image_url VARCHAR(255) UNIQUE NOT NULL,
    author_id UUID NOT NULL REFERENCES authors(id),
    category content_category NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    status content_status NOT NULL DEFAULT 'draft',
    meta_title VARCHAR(72),
    meta_description VARCHAR(160),
    publication_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(32) PRIMARY KEY, -- kebab-case
    name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS content_tags (
    content_slug VARCHAR(200) NOT NULL REFERENCES content(slug) ON DELETE CASCADE,
    tag_id VARCHAR(32) NOT NULL REFERENCES tags(id) ON DELETE NO ACTION,
    PRIMARY KEY (content_slug, tag_id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
    slug VARCHAR(200) PRIMARY KEY REFERENCES content(slug) ON DELETE CASCADE,
    content TEXT NOT NULL, -- HTML/Markdown/Rich text
    editor_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    revision_date TIMESTAMPTZ,
    publication_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_articles (
    slug VARCHAR(200) PRIMARY KEY REFERENCES content(slug) ON DELETE CASCADE,
    content TEXT NOT NULL, -- HTML/Markdown/Rich text
    source_url VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS research_reports (
    slug VARCHAR(200) PRIMARY KEY REFERENCES content(slug) ON DELETE CASCADE,
    report_url VARCHAR(255) UNIQUE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- --------------------
-- Events & Conferences
-- --------------------

CREATE TABLE IF NOT EXISTS event_organizers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL,
    image_url VARCHAR(255) UNIQUE,
    bio TEXT,
    website VARCHAR(255),
    company_id UUID UNIQUE REFERENCES companies(id) ON DELETE SET NULL,
    registration_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    virtual BOOLEAN DEFAULT FALSE,
    start TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    address VARCHAR(255) NOT NULL, -- 'Online', 'Zoom', 'Google Meet', etc; if virtual
    location GEOGRAPHY(Point, 4326), -- Geographical coordinates (longitude, latitude)
    website VARCHAR(255),
    registration_url VARCHAR(255) UNIQUE,
    image_url VARCHAR(255),
    organizer_id UUID NOT NULL REFERENCES event_organizers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ########################################
-- FUNCTIONS
-- ########################################

-- Create the function to calculate read time
CREATE OR REPLACE FUNCTION calculate_read_time(content_text TEXT)
RETURNS TEXT AS $$
DECLARE
    words_per_minute INT := 200;
    stripped_text TEXT;
    word_count INT;
    read_time INT;
BEGIN
    -- 1. Strip all HTML tags from the content
    stripped_text := regexp_replace(content_text, '<[^>]*>', '', 'g');

    -- 2. Handle empty or null content gracefully
    IF stripped_text IS NULL OR btrim(stripped_text) = '' THEN
        RETURN 1; -- Return a default for empty content
    END IF;

    -- 3. Split the text into an array of words (using whitespace as a delimiter) and count them
    word_count := array_length(regexp_split_to_array(btrim(stripped_text), E'\\s+'), 1);

    -- 4. Calculate the read time, using CEIL to round up to the nearest minute
    -- Cast to numeric to ensure floating-point division
    read_time := CEIL(word_count::numeric / words_per_minute);
    
    -- Ensure a minimum of 1 minute read time
    IF read_time < 1 THEN
       read_time := 1;
    END IF;

    -- 5. Format the output string
    RETURN read_time;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ########################################
-- VIEWS
-- ########################################

-- --------------------
-- (Non-Materialized) Views
-- --------------------

CREATE OR REPLACE VIEW company_portfolios AS
SELECT
    c.id AS company_id,
    c.name AS company_name,
    COUNT(DISTINCT d.id) AS deals_count, -- Average annual deals count
    COALESCE(SUM(d.amount), 0) AS deals_value, -- Total deals value (millions USD)
    COALESCE(SUM(p.plant_capacity), 0) AS total_portfolio, -- Total portfolio (MW)
    SUM(CASE WHEN p.stage = 'in_development' THEN p.plant_capacity ELSE 0 END) AS in_development_portfolio, -- In development portfolio (MW)
    SUM(CASE WHEN p.stage = 'in_construction' THEN p.plant_capacity ELSE 0 END) AS in_construction_portfolio, -- In construction portfolio (MW)
    SUM(CASE WHEN p.stage = 'operational' THEN p.plant_capacity ELSE 0 END) AS operational_portfolio -- Operational portfolio (MW)
FROM
    companies c
LEFT JOIN
    projects_companies pc ON c.id = pc.company_id
LEFT JOIN
    projects p ON pc.project_id = p.id
LEFT JOIN
    deals_companies dc ON c.id = dc.company_id
LEFT JOIN
    deals d ON dc.deal_id = d.id
-- WHERE
--     EXTRACT(YEAR FROM d.date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY
    c.id;

CREATE OR REPLACE VIEW deal_details AS
WITH assets_details AS (
    SELECT
        da.deal_id,
        ARRAY_AGG(DISTINCT p.name) AS asset_names,
        SUM(p.plant_capacity) AS total_capacity,
        ARRAY_AGG(DISTINCT x.sub_sector) FILTER (WHERE x.sub_sector IS NOT NULL) AS sub_sectors,
        ARRAY_AGG(DISTINCT y.segment) FILTER (WHERE y.segment IS NOT NULL) AS segments,
        -- SUM(p.colocated_storage_capacity) AS total_colocated_storage_capacity,
        JSONB_OBJECT_AGG(p.name, p.stage) AS lifecycle
    FROM
        deals_assets da
        JOIN projects p ON da.asset_id = p.id
        LEFT JOIN LATERAL unnest(p.sub_sectors) AS x(sub_sector) ON TRUE
        LEFT JOIN LATERAL unnest(p.segments) AS y(segment) ON TRUE
    GROUP BY
        da.deal_id
),
companies_details AS (
    SELECT
        dc.deal_id,
        ARRAY_AGG(DISTINCT c.name) AS companies_names,
        JSONB_OBJECT_AGG(c.name, c.classification) AS categories
    FROM
        deals_companies dc
    JOIN
        companies c ON dc.company_id = c.id
    GROUP BY
        dc.deal_id
)
SELECT
    d.id AS deal_id,
    d.update AS deal_update,
    assets_details.asset_names AS asset_names,
    assets_details.total_capacity AS total_capacity,
    assets_details.sub_sectors AS sub_sectors,
    assets_details.segments AS segments,
    -- assets_details.total_colocated_storage_capacity AS colocated_storage_capacity,
    assets_details.lifecycle AS asset_lifecycle,
    companies_details.companies_names AS involved_companies,
    companies_details.categories AS companies_categories
FROM
    deals d
LEFT JOIN
    assets_details ON d.id = assets_details.deal_id
LEFT JOIN
    companies_details ON d.id = companies_details.deal_id;

-- --------------------
-- Materialized Views
-- --------------------

-- View for: Stacked column chart of deal counts by type over time

CREATE MATERIALIZED VIEW IF NOT EXISTS deals_by_month_and_type AS
SELECT
    TO_CHAR(date, 'YYYY-MM') AS month,
    type AS deal_type,
    COUNT(id) AS deal_count
FROM
    deals
GROUP BY
    month,
    deal_type
ORDER BY
    month,
    deal_type;

-- View for: Stacked column chart of financing deals (amount) by financing type over time

CREATE MATERIALIZED VIEW IF NOT EXISTS financing_deals_by_month_and_type AS
WITH unnested_deals AS (
  SELECT
    TO_CHAR(d.date, 'YYYY-MM') AS month,
    d.id AS deal_id,
    d.amount,
    UNNEST(f.financing_type) AS financing_type -- This lateral join unnests the array into separate rows
  FROM
    deals d
  JOIN
    financing f ON d.id = f.deal_id
  WHERE
    d.type = 'financing' AND d.amount IS NOT NULL
)
SELECT -- Now, perform the aggregation on the clean, unnested data
  month,
  financing_type,
  SUM(amount) AS total_amount,
  COUNT(DISTINCT deal_id) AS deal_count
FROM
  unnested_deals
GROUP BY
  month,
  financing_type
ORDER BY
  month,
  financing_type;

-- View for: PPA Deals categorized by the Offtaker's primary sector

CREATE MATERIALIZED VIEW IF NOT EXISTS ppa_deals_by_offtaker_sector AS
SELECT
    cs.sector AS offtaker_sector,
    COUNT(DISTINCT d.id) AS deal_count
FROM
    deals d
JOIN
    deals_companies dc ON d.id = dc.deal_id AND dc.role = 'offtaker'
JOIN
    companies_sectors cs ON dc.company_id = cs.company_id
WHERE
    d.type = 'power_purchase_agreement'
GROUP BY
    cs.sector
ORDER BY
    deal_count DESC;

-- View for: PPA Deals categorized by subtype (Utility vs. Corporate)

CREATE MATERIALIZED VIEW IF NOT EXISTS ppa_deals_by_subtype AS
SELECT
    subtype,
    COUNT(id) AS deal_count
FROM
    deals
WHERE
    type = 'power_purchase_agreement'
GROUP BY
    subtype
ORDER BY
    deal_count DESC;

-- View for: PPA Deals categorized by contract duration

CREATE MATERIALIZED VIEW IF NOT EXISTS ppa_deals_by_duration AS
SELECT
    duration,
    COUNT(deal_id) AS deal_count
FROM
    power_purchase_agreements
GROUP BY
    duration
ORDER BY
    duration;

-- View for: Combo chart of project investment and capacity, stacked by sector, over time

CREATE MATERIALIZED VIEW IF NOT EXISTS projects_by_month_and_sector AS
WITH project_dates AS (
    SELECT 
        p.id AS project_id,
        COALESCE(
            MAX(d.date) FILTER (WHERE d.type = 'project_update'),
            p.created_at::date
        ) AS effective_date
    FROM projects p
    LEFT JOIN deals_assets da ON p.id = da.asset_id
    LEFT JOIN deals d ON da.deal_id = d.id
    GROUP BY p.id
)
SELECT
    TO_CHAR(pd.effective_date, 'YYYY-MM') AS month,
    ps.sector,
    COALESCE(SUM(p.plant_capacity), 0) AS total_capacity,  -- MW capacity
    COALESCE(SUM(p.investment_costs), 0) AS total_amount  -- $M aggregated deal amounts
FROM project_dates pd
JOIN projects p ON pd.project_id = p.id
JOIN projects_sectors ps ON p.id = ps.project_id
GROUP BY month, ps.sector
ORDER BY month, ps.sector;

-- View for: Stacked column chart of project counts by stage over time

CREATE MATERIALIZED VIEW IF NOT EXISTS projects_by_month_and_stage AS
WITH project_dates AS (
    SELECT 
        p.id AS project_id,
        COALESCE(
            MAX(d.date) FILTER (WHERE d.type = 'project_update'),
            p.created_at::date
        ) AS effective_date
    FROM projects p
    LEFT JOIN deals_assets da ON p.id = da.asset_id
    LEFT JOIN deals d ON da.deal_id = d.id
    GROUP BY p.id
)
SELECT
    TO_CHAR(pd.effective_date, 'YYYY-MM') AS month,
    p.stage AS project_stage,
    COUNT(p.id) AS project_count
FROM project_dates pd
JOIN projects p ON pd.project_id = p.id
WHERE
    p.stage IS NOT NULL
GROUP BY
    month,
    stage
ORDER BY
    month,
    stage;

CREATE MATERIALIZED VIEW IF NOT EXISTS projects_by_sector AS
WITH project_dates AS (
    SELECT 
        p.id AS project_id,
        COALESCE(
            MAX(d.date) FILTER (WHERE d.type = 'project_update'),
            p.created_at::date
        ) AS effective_date
    FROM projects p
    LEFT JOIN deals_assets da ON p.id = da.asset_id
    LEFT JOIN deals d ON da.deal_id = d.id
    GROUP BY p.id
),
sector_counts AS (
    SELECT
        ps.sector,
        COUNT(DISTINCT p.id) AS project_count
    FROM project_dates pd
    JOIN projects p ON pd.project_id = p.id
    JOIN projects_sectors ps ON p.id = ps.project_id
    WHERE EXTRACT(YEAR FROM pd.effective_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM pd.effective_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY ps.sector
)
SELECT
    sector,
    project_count,
    ROUND(
        100.0 * project_count / SUM(project_count) OVER (),
        0
    ) AS percentage
FROM sector_counts
ORDER BY project_count DESC;

CREATE MATERIALIZED VIEW IF NOT EXISTS top_countries_by_deal_value AS
WITH country_deals AS (
    SELECT 
        c.code as country_code,
        SUM(d.amount) AS deal_value,
        COUNT(DISTINCT d.id) AS deal_count
    FROM countries c
    JOIN deals_countries dc ON c.code = dc.country_code
    JOIN deals d ON dc.deal_id = d.id
    WHERE d.type = 'financing'
    AND EXTRACT(YEAR FROM d.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM d.date) = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY c.code
),
country_capacity AS (
    SELECT 
        c.code as country_code,
        SUM(p.plant_capacity) AS total_capacity
    FROM countries c
    JOIN projects p ON p.country = c.code
    GROUP BY c.code
)
SELECT 
    cd.country_code,
    cd.deal_value,
    cd.deal_count,
    cc.total_capacity AS total_capacity,
    RANK() OVER (ORDER BY COALESCE(cd.deal_value, 0) DESC) AS rank
FROM country_deals cd
LEFT JOIN country_capacity cc ON cd.country_code = cc.country_code
ORDER BY rank ASC, cd.deal_value DESC
LIMIT 5;

CREATE MATERIALIZED VIEW IF NOT EXISTS top_companies_by_financing_and_capacity AS
WITH company_fundraising AS (
    SELECT
        dc.company_id,
        SUM(d.amount) AS total_fundraising,
        COUNT(DISTINCT d.id) AS deal_count
    FROM
        deals_companies dc
    JOIN
        deals d ON dc.deal_id = d.id
    WHERE
        d.type = 'financing'
        AND EXTRACT(YEAR FROM d.date) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM d.date) = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY
        dc.company_id
),
project_dates AS (
    SELECT 
        p.id AS project_id,
        COALESCE(
            MAX(d.date) FILTER (WHERE d.type = 'project_update'),
            p.created_at::date
        ) AS effective_date
    FROM projects p
    LEFT JOIN deals_assets da ON p.id = da.asset_id
    LEFT JOIN deals d ON da.deal_id = d.id
    GROUP BY p.id
),
company_portfolio AS (
    SELECT
        pc.company_id,
        SUM(p.plant_capacity) AS total_capacity
    FROM
        projects_companies pc
    JOIN
        projects p ON pc.project_id = p.id
    JOIN project_dates pd ON p.id = pd.project_id
    WHERE pc.role = 'sponsor'
    GROUP BY
        pc.company_id
)
SELECT
    c.id,
    c.name,
    c.logo_url,
    cf.deal_count,
    COALESCE(cf.total_fundraising, 0) AS total_fundraising,
    COALESCE(cp.total_capacity, 0) AS total_capacity
FROM companies c
LEFT JOIN company_fundraising cf on c.id = cf.company_id
LEFT JOIN company_portfolio cp ON c.id = cp.company_id
ORDER BY total_fundraising DESC, total_capacity DESC
LIMIT 5;

CREATE MATERIALIZED VIEW IF NOT EXISTS countries_by_capacity_and_financing AS
WITH country_financing AS (
    SELECT 
        c.code as country_code,
        SUM(d.amount) AS deal_value
    FROM countries c
    JOIN deals_countries dc ON c.code = dc.country_code
    JOIN deals d ON dc.deal_id = d.id AND d.type = 'financing'
    GROUP BY c.code
),
country_projects AS (
    SELECT 
        c.code AS country_code,
        count(DISTINCT p.id) AS project_count,
        SUM(p.plant_capacity) AS total_capacity,
        SUM(p.investment_costs) AS investments
    FROM countries c
    JOIN projects p ON p.country = c.code
    GROUP BY c.code
)
SELECT 
    cf.country_code,
    GREATEST(cf.deal_value, cp.investments) AS financing,
    cp.project_count,
    cp.total_capacity AS total_capacity
FROM country_financing cf
LEFT JOIN country_projects cp ON cf.country_code = cp.country_code
ORDER BY COALESCE(total_capacity, 0) DESC, COALESCE(GREATEST(cf.deal_value, cp.investments), 0) DESC;

-- ########################################
-- TEXT SEARCH CONFIGURATIONS
-- ########################################

CREATE TEXT SEARCH CONFIGURATION franglais ( COPY = simple );

ALTER TEXT SEARCH CONFIGURATION franglais
  ALTER MAPPING FOR asciihword, asciiword, hword, hword_asciipart, hword_part, word
  WITH french_stem, english_stem;

ALTER TEXT SEARCH CONFIGURATION franglais
  ALTER MAPPING FOR tag
  WITH simple, french_stem, english_stem;

-- ########################################
-- INDEXES
-- ########################################

-- --------------------
-- Authentication
-- --------------------

CREATE INDEX ON users(role);

-- --------------------
-- Geography
-- --------------------

CREATE INDEX ON countries(region);

-- --------------------
-- Core
-- --------------------

CREATE INDEX ON technologies(project_sector);
CREATE INDEX ON technologies(company_sector);

-- Companies

CREATE INDEX ON companies USING GIN (to_tsvector('franglais', name));
CREATE INDEX ON companies(hq_country);
CREATE INDEX ON companies USING GIN (classification);
CREATE INDEX ON companies USING GIN (operating_status);
CREATE INDEX ON companies USING GIN (activities);
CREATE INDEX ON companies USING GIN (sub_sectors);
CREATE INDEX ON companies USING GIST (hq_location);

CREATE INDEX ON companies_operating_countries(country_code);

CREATE INDEX ON companies_sectors(sector);

CREATE INDEX ON companies_technologies(technology);

CREATE INDEX ON companies_employees(employee_id);

-- Projects

CREATE INDEX ON projects USING GIN (to_tsvector('franglais', name));
CREATE INDEX ON projects(country);
CREATE INDEX ON projects(stage);
CREATE INDEX ON projects(status);
CREATE INDEX ON projects USING GIN (sub_sectors);
CREATE INDEX ON projects USING GIN (segments);
CREATE INDEX ON projects USING GIN (contract_type);
CREATE INDEX ON projects USING GIN (financing_strategy);
CREATE INDEX ON projects USING GIST (location);

CREATE INDEX ON projects_sectors(project_id);
CREATE INDEX ON projects_sectors(sector);

CREATE INDEX ON projects_technologies(project_id);
CREATE INDEX ON projects_technologies(technology);


CREATE INDEX ON project_details(construction_start);
CREATE INDEX ON project_details(end_date);
CREATE INDEX ON project_details(operational_date);

CREATE INDEX ON proposals(bid_submission_deadline);
CREATE INDEX ON proposals USING GIN (evaluation_criteria);

CREATE INDEX ON projects_companies(project_id);
CREATE INDEX ON projects_companies(company_id);
CREATE INDEX ON projects_companies(role);

-- Deals

CREATE INDEX ON deals USING GIN (to_tsvector('franglais', update));
CREATE INDEX ON deals(type);
CREATE INDEX ON deals(subtype);
CREATE INDEX ON deals(date);
CREATE INDEX ON deals(announcement_date);
CREATE INDEX ON deals(completion_date);

CREATE INDEX ON deals_countries(country_code);

CREATE INDEX ON deals_assets(asset_id);

CREATE INDEX ON deals_companies(company_id);
CREATE INDEX ON deals_companies(role);

CREATE INDEX ON mergers_acquisitions(status);
CREATE INDEX ON mergers_acquisitions USING GIN (specifics);
CREATE INDEX ON mergers_acquisitions USING GIN (financing_strategy);

CREATE INDEX ON financing USING GIN (financing_type);
CREATE INDEX ON financing USING GIN (financing_subtype);

CREATE INDEX ON power_purchase_agreements(duration);
CREATE INDEX ON power_purchase_agreements(asset_operational_date);
CREATE INDEX ON power_purchase_agreements(supply_start);

CREATE INDEX ON joint_ventures USING GIN (partnership_objectives);

-- Documents

CREATE INDEX ON documents(deal_id);
CREATE INDEX ON documents(project_id);
CREATE INDEX ON documents(company_id);

-- --------------------
-- Content (Blog, News & Research)
-- --------------------

CREATE INDEX ON content(type);
CREATE INDEX ON content(category);
CREATE INDEX ON content(status);
CREATE INDEX ON content(featured);
CREATE INDEX ON content(author_id);
CREATE INDEX ON content USING GIN (to_tsvector('franglais', coalesce(title, '') || ' ' || coalesce(summary, '')));

CREATE INDEX ON content_tags(tag_id);

CREATE INDEX ON blog_posts USING GIN (to_tsvector('franglais', content));
CREATE INDEX ON blog_posts(editor_id);

CREATE INDEX ON news_articles USING GIN (to_tsvector('franglais', content));

-- --------------------
-- Events & Conferences
-- --------------------

CREATE INDEX ON events(start);
CREATE INDEX ON events(end_date);
CREATE INDEX ON events(organizer_id);
CREATE INDEX ON events USING GIST (location);

-- --------------------
-- Materialized Views
-- --------------------

CREATE UNIQUE INDEX ON deals_by_month_and_type (month, deal_type);
CREATE UNIQUE INDEX ON financing_deals_by_month_and_type (month, financing_type);
CREATE UNIQUE INDEX ON ppa_deals_by_offtaker_sector (offtaker_sector);
CREATE UNIQUE INDEX ON ppa_deals_by_subtype (subtype);
CREATE UNIQUE INDEX ON ppa_deals_by_duration (duration);
CREATE UNIQUE INDEX ON projects_by_month_and_sector (month, sector);
CREATE UNIQUE INDEX ON projects_by_month_and_stage (month, project_stage);
CREATE UNIQUE INDEX ON projects_by_sector (sector);
CREATE UNIQUE INDEX ON top_countries_by_deal_value (country_code);
CREATE UNIQUE INDEX ON top_companies_by_financing_and_capacity (id);
CREATE UNIQUE INDEX ON countries_by_capacity_and_financing (country_code);


-- ===========================================================================

-- ########################################
-- INSERTS
-- ########################################

-- Countries

INSERT INTO countries (code, name, region) VALUES
    ('DZ', 'Algeria', 'north_africa'),
    ('AO', 'Angola', 'southern_africa'),
    ('BJ', 'Benin', 'west_africa'),
    ('BW', 'Botswana', 'southern_africa'),
    ('BF', 'Burkina Faso', 'west_africa'),
    ('BI', 'Burundi', 'east_africa'),
    ('CM', 'Cameroon', 'central_africa'),
    ('CV', 'Cape Verde', 'west_africa'),
    ('CF', 'Central African Republic', 'central_africa'),
    ('TD', 'Chad', 'central_africa'),
    ('KM', 'Comoros', 'east_africa'),
    ('CG', 'Congo', 'central_africa'),
    ('CD', 'DRC', 'central_africa'),
    ('CI', 'Côte d''Ivoire', 'west_africa'),
    ('DJ', 'Djibouti', 'east_africa'),
    ('EG', 'Egypt', 'north_africa'),
    ('GQ', 'Equatorial Guinea', 'central_africa'),
    ('ER', 'Eritrea', 'east_africa'),
    ('ET', 'Ethiopia', 'east_africa'),
    ('GA', 'Gabon', 'central_africa'),
    ('GM', 'Gambia', 'west_africa'),
    ('GH', 'Ghana', 'west_africa'),
    ('GN', 'Guinea', 'west_africa'),
    ('GW', 'Guinea-Bissau', 'west_africa'),
    ('KE', 'Kenya', 'east_africa'),
    ('LS', 'Lesotho', 'southern_africa'),
    ('LR', 'Liberia', 'west_africa'),
    ('LY', 'Libya', 'north_africa'),
    ('MG', 'Madagascar', 'east_africa'),
    ('ML', 'Mali', 'west_africa'),
    ('MW', 'Malawi', 'east_africa'),
    ('MR', 'Mauritania', 'west_africa'),
    ('MU', 'Mauritius', 'east_africa'),
    ('YT', 'Mayotte', 'east_africa'),
    ('MA', 'Morocco', 'north_africa'),
    ('MZ', 'Mozambique', 'southern_africa'),
    ('NA', 'Namibia', 'southern_africa'),
    ('NE', 'Niger', 'west_africa'),
    ('NG', 'Nigeria', 'west_africa'),
    ('RE', 'Réunion', 'east_africa'),
    ('RW', 'Rwanda', 'east_africa'),
    ('ST', 'São Tomé and Príncipe', 'central_africa'),
    ('SN', 'Senegal', 'west_africa'),
    ('SC', 'Seychelles', 'east_africa'),
    ('SL', 'Sierra Leone', 'west_africa'),
    ('SO', 'Somalia', 'east_africa'),
    ('ZA', 'South Africa', 'southern_africa'),
    ('SS', 'South Sudan', 'east_africa'),
    ('SD', 'Sudan', 'north_africa'),
    ('SZ', 'Eswatini', 'southern_africa'),
    ('TZ', 'Tanzania', 'east_africa'),
    ('TG', 'Togo', 'west_africa'),
    ('TN', 'Tunisia', 'north_africa'),
    ('UG', 'Uganda', 'east_africa'),
    ('EH', 'Western Sahara', 'north_africa'),
    ('ZM', 'Zambia', 'southern_africa'),
    ('ZW', 'Zimbabwe', 'southern_africa');

-- Sectors

INSERT INTO company_sectors (id, name) VALUES
    ('renewables', 'Renewables'),
    ('non_renewables', 'Non-Renewables'),
    ('utilities', 'Utilities'),
    ('telecom', 'Telecommunications'),
    ('transport', 'Transportation'),
    ('mining', 'Mining'),
    ('real_estate', 'Hospitality & Real Estate'),
    ('industrial', 'Industrial'),
    ('social', 'Social'),
    ('water', 'Water'),
    ('infrastructure', 'Infrastructure'),
    ('other', 'Other');

INSERT INTO project_sectors (id, name) VALUES
    ('solar', 'Solar'),
    ('wind', 'Wind'),
    ('hydro', 'Hydroelectric'),
    ('battery', 'Battery'),
    ('hydrogen', 'Hydrogen'),
    ('biomass', 'Biomass'),
    ('geothermal', 'Geothermal'),
    ('nuclear', 'Nuclear'),
    ('oil_gas', 'Oil & Gas'),
    ('other', 'Other');

-- Technologies

INSERT INTO technologies (id, project_sector, company_sector) VALUES
    ('photovoltaic', 'solar', 'renewables'),
    ('concentrated_solar_power', 'solar', 'renewables'),
    ('solar_home_systems', 'solar', 'renewables'),
    ('concentrated_photovoltaic', 'solar', 'renewables'),
    ('onshore_wind', 'wind', 'renewables'),
    ('offshore_wind', 'wind', 'renewables'),
    ('small_hydro', 'hydro', 'renewables'),
    ('large_hydro', 'hydro', 'renewables'),
    ('bess', 'battery', 'renewables'),
    ('lithium_ion', 'battery', 'renewables'),
    ('biogas', 'biomass', 'renewables'),
    ('waste', 'biomass', 'renewables'),
    ('oil', 'oil_gas', 'non_renewables'),
    ('gas', 'oil_gas', 'non_renewables'),
    ('coal', 'oil_gas', 'non_renewables'),
    ('mini_grid', 'other', 'utilities'),
    ('decentralised', 'other', 'utilities'),
    ('high_voltage_transmission_lines', 'other', 'utilities'),
    ('hydrogen', 'hydrogen', 'renewables'),
    ('green_hydrogen', 'hydrogen', 'renewables'),
    ('geothermal', 'geothermal', 'renewables'),
    ('nuclear', 'nuclear', 'non_renewables'),
    ('wave_onshore', 'hydro', 'renewables'),
    ('wave_nearshore', 'hydro', 'renewables'),
    ('hybrid', 'other', 'other');

-- Deal Subtypes

INSERT INTO deal_subtypes (id, type) VALUES
    ('asset', 'merger_acquisition'),
    ('ma_corporate', 'merger_acquisition'),
    ('debt', 'financing'),
    ('equity', 'financing'),
    ('grant', 'financing'),
    ('utility', 'power_purchase_agreement'),
    ('ppa_corporate', 'power_purchase_agreement'),
    ('joint_venture', 'joint_venture'),
    ('strategic_partnership_agreement', 'joint_venture'),
    ('strategic_collaboration', 'joint_venture'),
    ('early_stage', 'project_update'),
    ('late_stage', 'project_update'),
    ('ready_to_build', 'project_update'),
    ('in_construction', 'project_update'),
    ('operational', 'project_update'),
    ('proposal', 'project_update');

-- ===========================================================================

-- ########################################
-- CRON JOBS
-- ########################################

-- Initializing extension

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Initializing extension

SELECT cron.schedule(
    'monthly-materialized-view-refresh',
    '0 1 1 * *',
    $$
        REFRESH MATERIALIZED VIEW CONCURRENTLY deals_by_month_and_type;
        REFRESH MATERIALIZED VIEW CONCURRENTLY financing_deals_by_month_and_type;
        REFRESH MATERIALIZED VIEW CONCURRENTLY ppa_deals_by_offtaker_sector;
        REFRESH MATERIALIZED VIEW CONCURRENTLY ppa_deals_by_subtype;
        REFRESH MATERIALIZED VIEW CONCURRENTLY ppa_deals_by_duration;
        REFRESH MATERIALIZED VIEW CONCURRENTLY projects_by_month_and_sector;
        REFRESH MATERIALIZED VIEW CONCURRENTLY projects_by_month_and_stage;
        REFRESH MATERIALIZED VIEW CONCURRENTLY projects_by_sector;
        REFRESH MATERIALIZED VIEW CONCURRENTLY top_countries_by_deal_value;
        REFRESH MATERIALIZED VIEW CONCURRENTLY top_companies_by_financing_and_capacity;
    $$
);
