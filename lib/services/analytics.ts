import { supabase } from "../supabase";

export interface DealAnalytics {
  month: string;
  count: number;
  amount: number;
  deal_type: string;
}

export interface ProjectAnalytics {
  month: string;
  count: number;
  capacity: number;
  amount: number;
  sector: string;
  project_stage: string;
}

export interface FinancingDealAnalytics {
  month: string;
  count: number;
  financing_type: string;
}

export interface PPADealAnalytics {
  offtaker_sector: string;
  ppa_subtype: string;
  duration: number;
  count: number;
}

// Dummy data for development
const DUMMY_DEAL_DATA: DealAnalytics[] = [
  { month: "Jan 2024", count: 5, amount: 125.5, deal_type: "financing" },
  { month: "Jan 2024", count: 3, amount: 85.2, deal_type: "ma" },
  { month: "Jan 2024", count: 2, amount: 15.8, deal_type: "ppa" },
  { month: "Feb 2024", count: 7, amount: 180.3, deal_type: "financing" },
  { month: "Feb 2024", count: 4, amount: 120.7, deal_type: "ma" },
  { month: "Feb 2024", count: 3, amount: 22.1, deal_type: "ppa" },
  { month: "Mar 2024", count: 6, amount: 155.9, deal_type: "financing" },
  { month: "Mar 2024", count: 2, amount: 95.4, deal_type: "ma" },
  { month: "Mar 2024", count: 4, amount: 28.6, deal_type: "ppa" },
  { month: "Apr 2024", count: 8, amount: 220.1, deal_type: "financing" },
  { month: "Apr 2024", count: 5, amount: 165.8, deal_type: "ma" },
  { month: "Apr 2024", count: 3, amount: 19.3, deal_type: "ppa" },
  { month: "May 2024", count: 9, amount: 275.6, deal_type: "financing" },
  { month: "May 2024", count: 3, amount: 110.2, deal_type: "ma" },
  { month: "May 2024", count: 5, amount: 35.7, deal_type: "ppa" },
  { month: "Jun 2024", count: 11, amount: 320.4, deal_type: "financing" },
  { month: "Jun 2024", count: 6, amount: 195.3, deal_type: "ma" },
  { month: "Jun 2024", count: 4, amount: 42.1, deal_type: "ppa" },
];

const DUMMY_PROJECT_DATA: ProjectAnalytics[] = [
  {
    month: "Jan 2024",
    count: 8,
    capacity: 450,
    amount: 380.5,
    sector: "Solar",
    project_stage: "early_stage",
  },
  {
    month: "Jan 2024",
    count: 5,
    capacity: 320,
    amount: 285.2,
    sector: "Wind",
    project_stage: "late_stage",
  },
  {
    month: "Jan 2024",
    count: 3,
    capacity: 180,
    amount: 165.8,
    sector: "Hydropower",
    project_stage: "under_construction",
  },
  {
    month: "Feb 2024",
    count: 10,
    capacity: 580,
    amount: 465.3,
    sector: "Solar",
    project_stage: "early_stage",
  },
  {
    month: "Feb 2024",
    count: 6,
    capacity: 420,
    amount: 375.7,
    sector: "Wind",
    project_stage: "late_stage",
  },
  {
    month: "Feb 2024",
    count: 4,
    capacity: 220,
    amount: 195.4,
    sector: "Storage",
    project_stage: "ready_to_build",
  },
  {
    month: "Mar 2024",
    count: 12,
    capacity: 680,
    amount: 545.9,
    sector: "Solar",
    project_stage: "early_stage",
  },
  {
    month: "Mar 2024",
    count: 7,
    capacity: 510,
    amount: 445.1,
    sector: "Wind",
    project_stage: "late_stage",
  },
  {
    month: "Mar 2024",
    count: 2,
    capacity: 95,
    amount: 85.6,
    sector: "Geothermal",
    project_stage: "under_construction",
  },
  {
    month: "Apr 2024",
    count: 9,
    capacity: 520,
    amount: 425.8,
    sector: "Solar",
    project_stage: "operational",
  },
  {
    month: "Apr 2024",
    count: 8,
    capacity: 640,
    amount: 565.2,
    sector: "Wind",
    project_stage: "under_construction",
  },
  {
    month: "Apr 2024",
    count: 5,
    capacity: 280,
    amount: 245.7,
    sector: "Storage",
    project_stage: "ready_to_build",
  },
  {
    month: "May 2024",
    count: 11,
    capacity: 620,
    amount: 515.3,
    sector: "Solar",
    project_stage: "late_stage",
  },
  {
    month: "May 2024",
    count: 6,
    capacity: 380,
    amount: 335.9,
    sector: "Wind",
    project_stage: "operational",
  },
  {
    month: "May 2024",
    count: 3,
    capacity: 150,
    amount: 135.4,
    sector: "Bioenergy",
    project_stage: "early_stage",
  },
  {
    month: "Jun 2024",
    count: 13,
    capacity: 750,
    amount: 625.7,
    sector: "Solar",
    project_stage: "under_construction",
  },
  {
    month: "Jun 2024",
    count: 9,
    capacity: 580,
    amount: 485.1,
    sector: "Wind",
    project_stage: "ready_to_build",
  },
  {
    month: "Jun 2024",
    count: 4,
    capacity: 200,
    amount: 175.8,
    sector: "Hydropower",
    project_stage: "late_stage",
  },
];

const DUMMY_FINANCING_DATA: FinancingDealAnalytics[] = [
  { month: "Jan 2024", count: 8, financing_type: "debt" },
  { month: "Jan 2024", count: 5, financing_type: "equity" },
  { month: "Jan 2024", count: 2, financing_type: "grant" },
  { month: "Feb 2024", count: 10, financing_type: "debt" },
  { month: "Feb 2024", count: 7, financing_type: "equity" },
  { month: "Feb 2024", count: 3, financing_type: "grant" },
  { month: "Mar 2024", count: 12, financing_type: "debt" },
  { month: "Mar 2024", count: 6, financing_type: "equity" },
  { month: "Mar 2024", count: 4, financing_type: "grant" },
  { month: "Apr 2024", count: 9, financing_type: "debt" },
  { month: "Apr 2024", count: 8, financing_type: "equity" },
  { month: "Apr 2024", count: 2, financing_type: "grant" },
  { month: "May 2024", count: 11, financing_type: "debt" },
  { month: "May 2024", count: 9, financing_type: "equity" },
  { month: "May 2024", count: 5, financing_type: "grant" },
  { month: "Jun 2024", count: 14, financing_type: "debt" },
  { month: "Jun 2024", count: 11, financing_type: "equity" },
  { month: "Jun 2024", count: 3, financing_type: "grant" },
];

const DUMMY_PPA_DATA: PPADealAnalytics[] = [
  {
    offtaker_sector: "Utility",
    ppa_subtype: "Fixed Price",
    duration: 20,
    count: 15,
  },
  {
    offtaker_sector: "Commercial",
    ppa_subtype: "Escalating",
    duration: 15,
    count: 8,
  },
  {
    offtaker_sector: "Industrial",
    ppa_subtype: "Fixed Price",
    duration: 25,
    count: 12,
  },
  {
    offtaker_sector: "Government",
    ppa_subtype: "Indexed",
    duration: 20,
    count: 6,
  },
  {
    offtaker_sector: "Utility",
    ppa_subtype: "Escalating",
    duration: 15,
    count: 10,
  },
  {
    offtaker_sector: "Commercial",
    ppa_subtype: "Fixed Price",
    duration: 10,
    count: 5,
  },
  {
    offtaker_sector: "Industrial",
    ppa_subtype: "Indexed",
    duration: 30,
    count: 9,
  },
  {
    offtaker_sector: "Government",
    ppa_subtype: "Fixed Price",
    duration: 25,
    count: 7,
  },
];

export class AnalyticsService {
  static async getDealAnalytics(): Promise<DealAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("deal_type, disclosed_amount, announcement_date")
        .not("announcement_date", "is", null)
        .order("announcement_date");

      if (error) {
        console.warn("Database query failed, using dummy data:", error);
        return DUMMY_DEAL_DATA;
      }

      if (!data || data.length === 0) {
        console.warn("No data found, using dummy data");
        return DUMMY_DEAL_DATA;
      }

      // Group by month and deal type
      const monthlyData: {
        [key: string]: {
          [dealType: string]: { count: number; amount: number };
        };
      } = {};

      data.forEach((deal) => {
        const date = new Date(deal.announcement_date);
        const monthKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {};
        }

        if (!monthlyData[monthKey][deal.deal_type]) {
          monthlyData[monthKey][deal.deal_type] = { count: 0, amount: 0 };
        }

        monthlyData[monthKey][deal.deal_type].count += 1;
        monthlyData[monthKey][deal.deal_type].amount +=
          deal.disclosed_amount || 0;
      });

      // Convert to array format
      const result: DealAnalytics[] = [];
      Object.entries(monthlyData).forEach(([month, dealTypes]) => {
        Object.entries(dealTypes).forEach(([dealType, data]) => {
          result.push({
            month,
            count: data.count,
            amount: data.amount,
            deal_type: dealType,
          });
        });
      });

      return result.length > 0 ? result : DUMMY_DEAL_DATA;
    } catch (error) {
      console.warn("Error fetching deal analytics, using dummy data:", error);
      return DUMMY_DEAL_DATA;
    }
  }

  static async getProjectAnalytics(): Promise<ProjectAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "sector, project_stage, plant_capacity, project_investment, announcement_date"
        )
        .not("announcement_date", "is", null)
        .order("announcement_date");

      if (error) {
        console.warn("Database query failed, using dummy data:", error);
        return DUMMY_PROJECT_DATA;
      }

      if (!data || data.length === 0) {
        console.warn("No data found, using dummy data");
        return DUMMY_PROJECT_DATA;
      }

      // Group by month, sector, and stage
      const monthlyData: {
        [key: string]: {
          [sector: string]: {
            [stage: string]: {
              count: number;
              capacity: number;
              amount: number;
            };
          };
        };
      } = {};

      data.forEach((project) => {
        const date = new Date(project.announcement_date);
        const monthKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {};
        }

        if (!monthlyData[monthKey][project.sector]) {
          monthlyData[monthKey][project.sector] = {};
        }

        if (!monthlyData[monthKey][project.sector][project.project_stage]) {
          monthlyData[monthKey][project.sector][project.project_stage] = {
            count: 0,
            capacity: 0,
            amount: 0,
          };
        }

        const stageData =
          monthlyData[monthKey][project.sector][project.project_stage];
        stageData.count += 1;
        stageData.capacity += project.plant_capacity || 0;
        stageData.amount += project.project_investment || 0;
      });

      // Convert to array format
      const result: ProjectAnalytics[] = [];
      Object.entries(monthlyData).forEach(([month, sectors]) => {
        Object.entries(sectors).forEach(([sector, stages]) => {
          Object.entries(stages).forEach(([stage, data]) => {
            result.push({
              month,
              count: data.count,
              capacity: data.capacity,
              amount: data.amount,
              sector,
              project_stage: stage,
            });
          });
        });
      });

      return result.length > 0 ? result : DUMMY_PROJECT_DATA;
    } catch (error) {
      console.warn(
        "Error fetching project analytics, using dummy data:",
        error
      );
      return DUMMY_PROJECT_DATA;
    }
  }

  static async getFinancingDealAnalytics(): Promise<FinancingDealAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("deal_subtype, announcement_date")
        .eq("deal_type", "financing")
        .not("announcement_date", "is", null)
        .order("announcement_date");

      if (error) {
        console.warn("Database query failed, using dummy data:", error);
        return DUMMY_FINANCING_DATA;
      }

      if (!data || data.length === 0) {
        console.warn("No data found, using dummy data");
        return DUMMY_FINANCING_DATA;
      }

      // Group by month and financing type
      const monthlyData: {
        [key: string]: { [financingType: string]: number };
      } = {};

      data.forEach((deal) => {
        const date = new Date(deal.announcement_date);
        const monthKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {};
        }

        if (!monthlyData[monthKey][deal.deal_subtype]) {
          monthlyData[monthKey][deal.deal_subtype] = 0;
        }

        monthlyData[monthKey][deal.deal_subtype] += 1;
      });

      // Convert to array format
      const result: FinancingDealAnalytics[] = [];
      Object.entries(monthlyData).forEach(([month, financingTypes]) => {
        Object.entries(financingTypes).forEach(([financingType, count]) => {
          result.push({
            month,
            count,
            financing_type: financingType,
          });
        });
      });

      return result.length > 0 ? result : DUMMY_FINANCING_DATA;
    } catch (error) {
      console.warn(
        "Error fetching financing deal analytics, using dummy data:",
        error
      );
      return DUMMY_FINANCING_DATA;
    }
  }

  static async getPPADealAnalytics(): Promise<PPADealAnalytics[]> {
    try {
      // Return dummy data since we don't have detailed PPA fields in the schema
      return DUMMY_PPA_DATA;
    } catch (error) {
      console.warn(
        "Error fetching PPA deal analytics, using dummy data:",
        error
      );
      return DUMMY_PPA_DATA;
    }
  }

  static async getDashboardStats() {
    try {
      const [companiesResult, dealsResult, projectsResult, eventsResult] =
        await Promise.all([
          supabase.from("companies").select("id", { count: "exact" }),
          supabase.from("deals").select("id", { count: "exact" }),
          supabase.from("projects").select("id", { count: "exact" }),
          supabase.from("events").select("id", { count: "exact" }),
        ]);

      // Use actual data if available, otherwise use dummy data
      return {
        totalCompanies: companiesResult.count || 1247,
        totalDeals: dealsResult.count || 892,
        totalProjects: projectsResult.count || 2156,
        totalEvents: eventsResult.count || 15,
      };
    } catch (error) {
      console.warn("Error fetching dashboard stats, using dummy data:", error);
      return {
        totalCompanies: 1247,
        totalDeals: 892,
        totalProjects: 2156,
        totalEvents: 15,
      };
    }
  }
}
