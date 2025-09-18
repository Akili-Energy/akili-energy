export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      authors: {
        Row: {
          bio: string | null
          email: string | null
          id: string
          job_title: string | null
          linkedin_profile: string | null
          name: string
          photo_url: string | null
          x_profile: string | null
        }
        Insert: {
          bio?: string | null
          email?: string | null
          id?: string
          job_title?: string | null
          linkedin_profile?: string | null
          name: string
          photo_url?: string | null
          x_profile?: string | null
        }
        Update: {
          bio?: string | null
          email?: string | null
          id?: string
          job_title?: string | null
          linkedin_profile?: string | null
          name?: string
          photo_url?: string | null
          x_profile?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          editor_id: string
          publication_date: string | null
          revision_date: string | null
          slug: string
        }
        Insert: {
          content: string
          editor_id: string
          publication_date?: string | null
          revision_date?: string | null
          slug: string
        }
        Update: {
          content?: string
          editor_id?: string
          publication_date?: string | null
          revision_date?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_slug_fkey"
            columns: ["slug"]
            isOneToOne: true
            referencedRelation: "content"
            referencedColumns: ["slug"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          job_title: string | null
          type: Database["public"]["Enums"]["client_profile"]
          user_id: string
        }
        Insert: {
          company?: string | null
          job_title?: string | null
          type: Database["public"]["Enums"]["client_profile"]
          user_id: string
        }
        Update: {
          company?: string | null
          job_title?: string | null
          type?: Database["public"]["Enums"]["client_profile"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      companies: {
        Row: {
          activities: Database["public"]["Enums"]["company_activity"][] | null
          classification:
            | Database["public"]["Enums"]["company_classification"]
            | null
          created_at: string | null
          description: string | null
          email: string | null
          facebook_profile: string | null
          founding_date: string | null
          hq_address: string | null
          hq_country: Database["public"]["Enums"]["country_code"] | null
          hq_location: unknown | null
          id: string
          linkedin_profile: string | null
          logo_url: string | null
          name: string
          operating_status: boolean | null
          phone_number: string | null
          size: Database["public"]["Enums"]["company_size"] | null
          sub_sectors: Database["public"]["Enums"]["sub_sector"][] | null
          updated_at: string | null
          website: string | null
          x_profile: string | null
        }
        Insert: {
          activities?: Database["public"]["Enums"]["company_activity"][] | null
          classification?:
            | Database["public"]["Enums"]["company_classification"]
            | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          facebook_profile?: string | null
          founding_date?: string | null
          hq_address?: string | null
          hq_country?: Database["public"]["Enums"]["country_code"] | null
          hq_location?: unknown | null
          id?: string
          linkedin_profile?: string | null
          logo_url?: string | null
          name: string
          operating_status?: boolean | null
          phone_number?: string | null
          size?: Database["public"]["Enums"]["company_size"] | null
          sub_sectors?: Database["public"]["Enums"]["sub_sector"][] | null
          updated_at?: string | null
          website?: string | null
          x_profile?: string | null
        }
        Update: {
          activities?: Database["public"]["Enums"]["company_activity"][] | null
          classification?:
            | Database["public"]["Enums"]["company_classification"]
            | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          facebook_profile?: string | null
          founding_date?: string | null
          hq_address?: string | null
          hq_country?: Database["public"]["Enums"]["country_code"] | null
          hq_location?: unknown | null
          id?: string
          linkedin_profile?: string | null
          logo_url?: string | null
          name?: string
          operating_status?: boolean | null
          phone_number?: string | null
          size?: Database["public"]["Enums"]["company_size"] | null
          sub_sectors?: Database["public"]["Enums"]["sub_sector"][] | null
          updated_at?: string | null
          website?: string | null
          x_profile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_hq_country_fkey"
            columns: ["hq_country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      companies_employees: {
        Row: {
          company_id: string
          employee_id: string
          role: string
        }
        Insert: {
          company_id: string
          employee_id: string
          role: string
        }
        Update: {
          company_id?: string
          employee_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      companies_operating_countries: {
        Row: {
          company_id: string
          country_code: Database["public"]["Enums"]["country_code"]
        }
        Insert: {
          company_id: string
          country_code: Database["public"]["Enums"]["country_code"]
        }
        Update: {
          company_id?: string
          country_code?: Database["public"]["Enums"]["country_code"]
        }
        Relationships: [
          {
            foreignKeyName: "companies_operating_countries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_operating_countries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_operating_countries_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      companies_sectors: {
        Row: {
          company_id: string
          sector: Database["public"]["Enums"]["sector"]
        }
        Insert: {
          company_id: string
          sector: Database["public"]["Enums"]["sector"]
        }
        Update: {
          company_id?: string
          sector?: Database["public"]["Enums"]["sector"]
        }
        Relationships: [
          {
            foreignKeyName: "companies_sectors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_sectors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_sectors_sector_fkey"
            columns: ["sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      companies_technologies: {
        Row: {
          company_id: string
          technology: Database["public"]["Enums"]["technology"]
        }
        Insert: {
          company_id: string
          technology: Database["public"]["Enums"]["technology"]
        }
        Update: {
          company_id?: string
          technology?: Database["public"]["Enums"]["technology"]
        }
        Relationships: [
          {
            foreignKeyName: "companies_technologies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_technologies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
        ]
      }
      content: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["content_category"]
          featured: boolean | null
          image_url: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          publication_date: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          type: Database["public"]["Enums"]["content_type"]
        }
        Insert: {
          author_id: string
          category: Database["public"]["Enums"]["content_category"]
          featured?: boolean | null
          image_url: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          publication_date?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          type: Database["public"]["Enums"]["content_type"]
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["content_category"]
          featured?: boolean | null
          image_url?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          publication_date?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
        }
        Relationships: [
          {
            foreignKeyName: "content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          content_slug: string
          tag_id: string
        }
        Insert: {
          content_slug: string
          tag_id: string
        }
        Update: {
          content_slug?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_slug_fkey"
            columns: ["content_slug"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: Database["public"]["Enums"]["country_code"]
          name: string
          region: Database["public"]["Enums"]["geographic_region"]
        }
        Insert: {
          code: Database["public"]["Enums"]["country_code"]
          name: string
          region: Database["public"]["Enums"]["geographic_region"]
        }
        Update: {
          code?: Database["public"]["Enums"]["country_code"]
          name?: string
          region?: Database["public"]["Enums"]["geographic_region"]
        }
        Relationships: []
      }
      deal_financials: {
        Row: {
          cash: number | null
          deal_id: string
          debt: number | null
          ebitda: number | null
          enterprise_value: number | null
          year: number
        }
        Insert: {
          cash?: number | null
          deal_id: string
          debt?: number | null
          ebitda?: number | null
          enterprise_value?: number | null
          year: number
        }
        Update: {
          cash?: number | null
          deal_id?: string
          debt?: number | null
          ebitda?: number | null
          enterprise_value?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "deal_financials_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deal_financials_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_subtypes: {
        Row: {
          id: Database["public"]["Enums"]["deal_subtype"]
          type: Database["public"]["Enums"]["deal_type"]
        }
        Insert: {
          id: Database["public"]["Enums"]["deal_subtype"]
          type: Database["public"]["Enums"]["deal_type"]
        }
        Update: {
          id?: Database["public"]["Enums"]["deal_subtype"]
          type?: Database["public"]["Enums"]["deal_type"]
        }
        Relationships: []
      }
      deals: {
        Row: {
          amount: number | null
          announcement_date: string | null
          completion_date: string | null
          created_at: string | null
          currency: string | null
          date: string
          description: string | null
          id: string
          impacts: string | null
          insights: string | null
          on_off_grid: boolean | null
          press_release_url: string | null
          segments: Database["public"]["Enums"]["segment"][] | null
          sub_sectors: Database["public"]["Enums"]["sub_sector"][] | null
          subtype: Database["public"]["Enums"]["deal_subtype"] | null
          type: Database["public"]["Enums"]["deal_type"]
          update: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          announcement_date?: string | null
          completion_date?: string | null
          created_at?: string | null
          currency?: string | null
          date?: string
          description?: string | null
          id?: string
          impacts?: string | null
          insights?: string | null
          on_off_grid?: boolean | null
          press_release_url?: string | null
          segments?: Database["public"]["Enums"]["segment"][] | null
          sub_sectors?: Database["public"]["Enums"]["sub_sector"][] | null
          subtype?: Database["public"]["Enums"]["deal_subtype"] | null
          type: Database["public"]["Enums"]["deal_type"]
          update: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          announcement_date?: string | null
          completion_date?: string | null
          created_at?: string | null
          currency?: string | null
          date?: string
          description?: string | null
          id?: string
          impacts?: string | null
          insights?: string | null
          on_off_grid?: boolean | null
          press_release_url?: string | null
          segments?: Database["public"]["Enums"]["segment"][] | null
          sub_sectors?: Database["public"]["Enums"]["sub_sector"][] | null
          subtype?: Database["public"]["Enums"]["deal_subtype"] | null
          type?: Database["public"]["Enums"]["deal_type"]
          update?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deals_assets: {
        Row: {
          asset_id: string
          deal_id: string
          equity_transacted_percentage: number | null
          maturity: number | null
        }
        Insert: {
          asset_id: string
          deal_id: string
          equity_transacted_percentage?: number | null
          maturity?: number | null
        }
        Update: {
          asset_id?: string
          deal_id?: string
          equity_transacted_percentage?: number | null
          maturity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_assets_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deals_assets_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals_companies: {
        Row: {
          commitment: number | null
          company_id: string
          deal_id: string
          details: string | null
          investor_type:
            | Database["public"]["Enums"]["financing_investor_type"]
            | null
          role: Database["public"]["Enums"]["deal_company_role"]
        }
        Insert: {
          commitment?: number | null
          company_id: string
          deal_id: string
          details?: string | null
          investor_type?:
            | Database["public"]["Enums"]["financing_investor_type"]
            | null
          role: Database["public"]["Enums"]["deal_company_role"]
        }
        Update: {
          commitment?: number | null
          company_id?: string
          deal_id?: string
          details?: string | null
          investor_type?:
            | Database["public"]["Enums"]["financing_investor_type"]
            | null
          role?: Database["public"]["Enums"]["deal_company_role"]
        }
        Relationships: [
          {
            foreignKeyName: "deals_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "deals_companies_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deals_companies_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals_countries: {
        Row: {
          country_code: Database["public"]["Enums"]["country_code"]
          deal_id: string
        }
        Insert: {
          country_code: Database["public"]["Enums"]["country_code"]
          deal_id: string
        }
        Update: {
          country_code?: Database["public"]["Enums"]["country_code"]
          deal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_countries_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "deals_countries_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deals_countries_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals_sectors: {
        Row: {
          deal_id: string
          sector: Database["public"]["Enums"]["sector"]
        }
        Insert: {
          deal_id: string
          sector: Database["public"]["Enums"]["sector"]
        }
        Update: {
          deal_id?: string
          sector?: Database["public"]["Enums"]["sector"]
        }
        Relationships: [
          {
            foreignKeyName: "deals_sectors_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deals_sectors_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_sectors_sector_fkey"
            columns: ["sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      deals_technologies: {
        Row: {
          deal_id: string
          technology: Database["public"]["Enums"]["technology"]
        }
        Insert: {
          deal_id: string
          technology: Database["public"]["Enums"]["technology"]
        }
        Update: {
          deal_id?: string
          technology?: Database["public"]["Enums"]["technology"]
        }
        Relationships: [
          {
            foreignKeyName: "deals_technologies_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deals_technologies_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string | null
          deal_id: string | null
          description: string | null
          file_url: string
          id: string
          name: string
          project_id: string | null
          published_at: string | null
          publisher: string | null
        }
        Insert: {
          company_id?: string | null
          deal_id?: string | null
          description?: string | null
          file_url: string
          id?: string
          name: string
          project_id?: string | null
          published_at?: string | null
          publisher?: string | null
        }
        Update: {
          company_id?: string | null
          deal_id?: string | null
          description?: string | null
          file_url?: string
          id?: string
          name?: string
          project_id?: string | null
          published_at?: string | null
          publisher?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          about: string | null
          email: string | null
          id: string
          linkedin_profile: string | null
          name: string
          phone_number: string | null
        }
        Insert: {
          about?: string | null
          email?: string | null
          id?: string
          linkedin_profile?: string | null
          name: string
          phone_number?: string | null
        }
        Update: {
          about?: string | null
          email?: string | null
          id?: string
          linkedin_profile?: string | null
          name?: string
          phone_number?: string | null
        }
        Relationships: []
      }
      event_organizers: {
        Row: {
          bio: string | null
          company_id: string | null
          id: string
          image_url: string | null
          name: string
          registration_date: string | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          registration_date?: string | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          registration_date?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_organizers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_organizers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
        ]
      }
      events: {
        Row: {
          address: string
          created_at: string | null
          description: string
          end_date: string
          id: string
          image_url: string | null
          location: unknown | null
          organizer_id: string
          registration_url: string | null
          start: string
          title: string
          updated_at: string | null
          virtual: boolean | null
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          location?: unknown | null
          organizer_id: string
          registration_url?: string | null
          start: string
          title: string
          updated_at?: string | null
          virtual?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          location?: unknown | null
          organizer_id?: string
          registration_url?: string | null
          start?: string
          title?: string
          updated_at?: string | null
          virtual?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "event_organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      financing: {
        Row: {
          deal_id: string
          financing_subtype:
            | Database["public"]["Enums"]["financing_subtype"][]
            | null
          financing_type:
            | Database["public"]["Enums"]["deal_financing_type"][]
            | null
          objective: Database["public"]["Enums"]["financing_objective"] | null
          vehicle: string | null
        }
        Insert: {
          deal_id: string
          financing_subtype?:
            | Database["public"]["Enums"]["financing_subtype"][]
            | null
          financing_type?:
            | Database["public"]["Enums"]["deal_financing_type"][]
            | null
          objective?: Database["public"]["Enums"]["financing_objective"] | null
          vehicle?: string | null
        }
        Update: {
          deal_id?: string
          financing_subtype?:
            | Database["public"]["Enums"]["financing_subtype"][]
            | null
          financing_type?:
            | Database["public"]["Enums"]["deal_financing_type"][]
            | null
          objective?: Database["public"]["Enums"]["financing_objective"] | null
          vehicle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financing_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "financing_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      joint_ventures: {
        Row: {
          deal_id: string
          partnership_objectives:
            | Database["public"]["Enums"]["partnership_objective"][]
            | null
        }
        Insert: {
          deal_id: string
          partnership_objectives?:
            | Database["public"]["Enums"]["partnership_objective"][]
            | null
        }
        Update: {
          deal_id?: string
          partnership_objectives?:
            | Database["public"]["Enums"]["partnership_objective"][]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "joint_ventures_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "joint_ventures_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      mergers_acquisitions: {
        Row: {
          deal_id: string
          financing_strategy:
            | Database["public"]["Enums"]["deal_financing_type"][]
            | null
          revenue_model: Database["public"]["Enums"]["revenue_model"] | null
          revenue_model_duration: number | null
          specifics: Database["public"]["Enums"]["m_a_specifics"][] | null
          status: Database["public"]["Enums"]["m_a_status"] | null
          strategy_rationale: string | null
          structure: Database["public"]["Enums"]["m_a_structure"] | null
        }
        Insert: {
          deal_id: string
          financing_strategy?:
            | Database["public"]["Enums"]["deal_financing_type"][]
            | null
          revenue_model?: Database["public"]["Enums"]["revenue_model"] | null
          revenue_model_duration?: number | null
          specifics?: Database["public"]["Enums"]["m_a_specifics"][] | null
          status?: Database["public"]["Enums"]["m_a_status"] | null
          strategy_rationale?: string | null
          structure?: Database["public"]["Enums"]["m_a_structure"] | null
        }
        Update: {
          deal_id?: string
          financing_strategy?:
            | Database["public"]["Enums"]["deal_financing_type"][]
            | null
          revenue_model?: Database["public"]["Enums"]["revenue_model"] | null
          revenue_model_duration?: number | null
          specifics?: Database["public"]["Enums"]["m_a_specifics"][] | null
          status?: Database["public"]["Enums"]["m_a_status"] | null
          strategy_rationale?: string | null
          structure?: Database["public"]["Enums"]["m_a_structure"] | null
        }
        Relationships: [
          {
            foreignKeyName: "mergers_acquisitions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "mergers_acquisitions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          content: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          content: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_slug_fkey"
            columns: ["slug"]
            isOneToOne: true
            referencedRelation: "content"
            referencedColumns: ["slug"]
          },
        ]
      }
      opportunities: {
        Row: {
          program: string | null
          project_id: string
        }
        Insert: {
          program?: string | null
          project_id: string
        }
        Update: {
          program?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      power_purchase_agreements: {
        Row: {
          asset_operational_date: string | null
          capacity: number | null
          deal_id: string
          details: boolean | null
          duration: number | null
          generated_power: number | null
          on_off_site: boolean | null
          supply_start: string | null
        }
        Insert: {
          asset_operational_date?: string | null
          capacity?: number | null
          deal_id: string
          details?: boolean | null
          duration?: number | null
          generated_power?: number | null
          on_off_site?: boolean | null
          supply_start?: string | null
        }
        Update: {
          asset_operational_date?: string | null
          capacity?: number | null
          deal_id?: string
          details?: boolean | null
          duration?: number | null
          generated_power?: number | null
          on_off_site?: boolean | null
          supply_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "power_purchase_agreements_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deal_details"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "power_purchase_agreements_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      project_details: {
        Row: {
          eia_approved: boolean | null
          financial_closing_date: string | null
          grid_connection_approved: boolean | null
          ppa_signed: boolean | null
          project_id: string
          transmission_infrastructure_details: string | null
        }
        Insert: {
          eia_approved?: boolean | null
          financial_closing_date?: string | null
          grid_connection_approved?: boolean | null
          ppa_signed?: boolean | null
          project_id: string
          transmission_infrastructure_details?: string | null
        }
        Update: {
          eia_approved?: boolean | null
          financial_closing_date?: string | null
          grid_connection_approved?: boolean | null
          ppa_signed?: boolean | null
          project_id?: string
          transmission_infrastructure_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          colocated_storage: boolean | null
          colocated_storage_capacity: number | null
          construction_start: string | null
          contract_type:
            | Database["public"]["Enums"]["project_contract_type"][]
            | null
          country: Database["public"]["Enums"]["country_code"] | null
          created_at: string | null
          description: string | null
          end_date: string | null
          features: string | null
          financing_strategy: Json | null
          funding_secured: boolean | null
          id: string
          impacts: string | null
          insights: string | null
          investment_costs: number | null
          location: unknown | null
          milestone: Database["public"]["Enums"]["project_milestone"] | null
          name: string
          on_off_grid: boolean | null
          ons_off_shore: boolean | null
          operational_date: string | null
          plant_capacity: number | null
          revenue_model: Database["public"]["Enums"]["revenue_model"] | null
          revenue_model_duration: number | null
          segments: Database["public"]["Enums"]["segment"][] | null
          stage: Database["public"]["Enums"]["project_stage"] | null
          status: boolean | null
          sub_sectors: Database["public"]["Enums"]["sub_sector"][] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          colocated_storage?: boolean | null
          colocated_storage_capacity?: number | null
          construction_start?: string | null
          contract_type?:
            | Database["public"]["Enums"]["project_contract_type"][]
            | null
          country?: Database["public"]["Enums"]["country_code"] | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          features?: string | null
          financing_strategy?: Json | null
          funding_secured?: boolean | null
          id?: string
          impacts?: string | null
          insights?: string | null
          investment_costs?: number | null
          location?: unknown | null
          milestone?: Database["public"]["Enums"]["project_milestone"] | null
          name: string
          on_off_grid?: boolean | null
          ons_off_shore?: boolean | null
          operational_date?: string | null
          plant_capacity?: number | null
          revenue_model?: Database["public"]["Enums"]["revenue_model"] | null
          revenue_model_duration?: number | null
          segments?: Database["public"]["Enums"]["segment"][] | null
          stage?: Database["public"]["Enums"]["project_stage"] | null
          status?: boolean | null
          sub_sectors?: Database["public"]["Enums"]["sub_sector"][] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          colocated_storage?: boolean | null
          colocated_storage_capacity?: number | null
          construction_start?: string | null
          contract_type?:
            | Database["public"]["Enums"]["project_contract_type"][]
            | null
          country?: Database["public"]["Enums"]["country_code"] | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          features?: string | null
          financing_strategy?: Json | null
          funding_secured?: boolean | null
          id?: string
          impacts?: string | null
          insights?: string | null
          investment_costs?: number | null
          location?: unknown | null
          milestone?: Database["public"]["Enums"]["project_milestone"] | null
          name?: string
          on_off_grid?: boolean | null
          ons_off_shore?: boolean | null
          operational_date?: string | null
          plant_capacity?: number | null
          revenue_model?: Database["public"]["Enums"]["revenue_model"] | null
          revenue_model_duration?: number | null
          segments?: Database["public"]["Enums"]["segment"][] | null
          stage?: Database["public"]["Enums"]["project_stage"] | null
          status?: boolean | null
          sub_sectors?: Database["public"]["Enums"]["sub_sector"][] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      projects_companies: {
        Row: {
          company_id: string
          details: string | null
          project_id: string
          role: Database["public"]["Enums"]["project_company_role"]
        }
        Insert: {
          company_id: string
          details?: string | null
          project_id: string
          role: Database["public"]["Enums"]["project_company_role"]
        }
        Update: {
          company_id?: string
          details?: string | null
          project_id?: string
          role?: Database["public"]["Enums"]["project_company_role"]
        }
        Relationships: [
          {
            foreignKeyName: "projects_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_portfolios"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "projects_companies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_sectors: {
        Row: {
          project_id: string
          sector: Database["public"]["Enums"]["sector"]
        }
        Insert: {
          project_id: string
          sector: Database["public"]["Enums"]["sector"]
        }
        Update: {
          project_id?: string
          sector?: Database["public"]["Enums"]["sector"]
        }
        Relationships: [
          {
            foreignKeyName: "projects_sectors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_sectors_sector_fkey"
            columns: ["sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_technologies: {
        Row: {
          project_id: string
          technology: Database["public"]["Enums"]["technology"]
        }
        Insert: {
          project_id: string
          technology: Database["public"]["Enums"]["technology"]
        }
        Update: {
          project_id?: string
          technology?: Database["public"]["Enums"]["technology"]
        }
        Relationships: [
          {
            foreignKeyName: "projects_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          bid_submission_deadline: string | null
          bids_received: number | null
          evaluation_criteria: Json | null
          project_id: string
          tender_objective:
            | Database["public"]["Enums"]["project_tender_objective"]
            | null
          winning_bid: number | null
        }
        Insert: {
          bid_submission_deadline?: string | null
          bids_received?: number | null
          evaluation_criteria?: Json | null
          project_id: string
          tender_objective?:
            | Database["public"]["Enums"]["project_tender_objective"]
            | null
          winning_bid?: number | null
        }
        Update: {
          bid_submission_deadline?: string | null
          bids_received?: number | null
          evaluation_criteria?: Json | null
          project_id?: string
          tender_objective?:
            | Database["public"]["Enums"]["project_tender_objective"]
            | null
          winning_bid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_reports: {
        Row: {
          report_url: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          report_url: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          report_url?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_reports_slug_fkey"
            columns: ["slug"]
            isOneToOne: true
            referencedRelation: "content"
            referencedColumns: ["slug"]
          },
        ]
      }
      sectors: {
        Row: {
          description: string | null
          id: Database["public"]["Enums"]["sector"]
          name: string
        }
        Insert: {
          description?: string | null
          id: Database["public"]["Enums"]["sector"]
          name: string
        }
        Update: {
          description?: string | null
          id?: Database["public"]["Enums"]["sector"]
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      technologies: {
        Row: {
          id: Database["public"]["Enums"]["technology"]
          sector: Database["public"]["Enums"]["sector"] | null
        }
        Insert: {
          id: Database["public"]["Enums"]["technology"]
          sector?: Database["public"]["Enums"]["sector"] | null
        }
        Update: {
          id?: Database["public"]["Enums"]["technology"]
          sector?: Database["public"]["Enums"]["sector"] | null
        }
        Relationships: [
          {
            foreignKeyName: "technologies_sector_fkey"
            columns: ["sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          is_active: boolean | null
          last_login_at: string | null
          name: string
          phone_number: string | null
          profile_picture_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          is_active?: boolean | null
          last_login_at?: string | null
          name: string
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          is_active?: boolean | null
          last_login_at?: string | null
          name?: string
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      company_portfolios: {
        Row: {
          company_id: string | null
          company_name: string | null
          deals_count: number | null
          deals_value: number | null
          in_construction_portfolio: number | null
          in_development_portfolio: number | null
          operational_portfolio: number | null
          total_portfolio: number | null
        }
        Relationships: []
      }
      deal_details: {
        Row: {
          asset_lifecycle: Json | null
          asset_names: string[] | null
          colocated_storage_capacity: number | null
          companies_categories: Json | null
          deal_id: string | null
          deal_update: string | null
          involved_companies: string[] | null
          segments: Database["public"]["Enums"]["segment"][] | null
          sub_sectors: Database["public"]["Enums"]["sub_sector"][] | null
          total_capacity: number | null
        }
        Relationships: []
      }
      deals_by_month: {
        Row: {
          deal_count: number | null
          month: string | null
          total_amount: number | null
        }
        Relationships: []
      }
      deals_by_month_and_type: {
        Row: {
          deal_count: number | null
          deal_type: Database["public"]["Enums"]["deal_type"] | null
          month: string | null
        }
        Relationships: []
      }
      financing_deals_by_month_and_type: {
        Row: {
          deal_count: number | null
          financing_type:
            | Database["public"]["Enums"]["deal_financing_type"]
            | null
          month: string | null
        }
        Relationships: []
      }
      ppa_deals_by_duration: {
        Row: {
          deal_count: number | null
          ppa_duration_years: number | null
        }
        Relationships: []
      }
      ppa_deals_by_offtaker_sector: {
        Row: {
          deal_count: number | null
          offtaker_sector: Database["public"]["Enums"]["sector"] | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_sectors_sector_fkey"
            columns: ["offtaker_sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      ppa_deals_by_subtype: {
        Row: {
          deal_count: number | null
          subtype: Database["public"]["Enums"]["deal_subtype"] | null
        }
        Relationships: []
      }
      projects_by_month_and_sector: {
        Row: {
          month: string | null
          sector: Database["public"]["Enums"]["sector"] | null
          total_capacity_mw: number | null
          total_investment_millions: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_sectors_sector_fkey"
            columns: ["sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_by_month_and_stage: {
        Row: {
          month: string | null
          project_count: number | null
          project_stage: Database["public"]["Enums"]["project_stage"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      client_profile:
        | "deal_advisor"
        | "developer_ipp"
        | "investor"
        | "epc_om"
        | "public_institution"
        | "individual"
      company_activity: "merger_acquisition" | "financing" | "offtaker"
      company_classification:
        | "private_equity"
        | "pe_backed"
        | "private"
        | "public"
        | "government"
        | "non_profit"
        | "development_finance_institution"
        | "advisor"
        | "independent_power_producer"
        | "epc_om"
        | "utility"
        | "micro_cap"
        | "small_cap"
        | "mid_cap"
        | "big_cap"
      company_size:
        | "1-10"
        | "11-50"
        | "51-250"
        | "251-1000"
        | "1001-5000"
        | "5001-10000"
        | "10000+"
      content_category:
        | "market-trends"
        | "policy-regulation"
        | "infographic"
        | "industry-insights"
        | "solar"
        | "wind"
        | "hydro"
        | "battery"
        | "hydrogen"
        | "biomass"
        | "geothermal"
        | "mergers-acquisitions"
        | "power-purchase-agreements"
        | "financing"
        | "projects"
        | "interviews"
        | "case-studies"
      content_status: "draft" | "published" | "archived"
      content_type: "blog" | "news" | "research"
      country_code:
        | "DZ"
        | "AO"
        | "BJ"
        | "BW"
        | "BF"
        | "BI"
        | "CM"
        | "CV"
        | "CF"
        | "TD"
        | "KM"
        | "CG"
        | "CD"
        | "CI"
        | "DJ"
        | "EG"
        | "GQ"
        | "ER"
        | "ET"
        | "GA"
        | "GM"
        | "GH"
        | "GN"
        | "GW"
        | "KE"
        | "LS"
        | "LR"
        | "LY"
        | "MG"
        | "ML"
        | "MW"
        | "MR"
        | "MU"
        | "YT"
        | "MA"
        | "MZ"
        | "NA"
        | "NE"
        | "NG"
        | "RE"
        | "RW"
        | "ST"
        | "SN"
        | "SC"
        | "SL"
        | "SO"
        | "ZA"
        | "SS"
        | "SD"
        | "SZ"
        | "TZ"
        | "TG"
        | "TN"
        | "UG"
        | "EH"
        | "ZM"
        | "ZW"
      deal_company_role:
        | "buyer"
        | "seller"
        | "offtaker"
        | "supplier"
        | "lead_arranger"
        | "investor"
        | "legal_advisor"
        | "technical_advisor"
        | "financial_advisor"
        | "advisor"
        | "grid_operator"
        | "joint_venture"
        | "financing"
      deal_financing_type: "debt" | "equity" | "grant" | "green_bond"
      deal_subtype:
        | "asset"
        | "ma_corporate"
        | "debt"
        | "equity"
        | "grant"
        | "utility"
        | "ppa_corporate"
        | "joint_venture"
        | "strategic_partnership_agreement"
        | "strategic_collaboration"
        | "early_stage"
        | "late_stage"
        | "ready_to_build"
        | "in_construction"
        | "operational"
        | "proposal"
        | "completed"
      deal_type:
        | "merger_acquisition"
        | "financing"
        | "power_purchase_agreement"
        | "project_update"
        | "joint_venture"
      financing_investor_type:
        | "private_equity"
        | "development_finance_institution"
        | "institutional"
        | "private"
        | "public"
        | "limited_partners"
        | "government"
        | "non_profit"
        | "venture_capital"
        | "developer"
        | "multilateral"
      financing_objective: "asset" | "corporate" | "government" | "cleantech"
      financing_subtype:
        | "project_finance"
        | "loan"
        | "grant"
        | "equity"
        | "private"
        | "senior_debt"
      geographic_region:
        | "north_africa"
        | "east_africa"
        | "west_africa"
        | "central_africa"
        | "southern_africa"
      m_a_specifics: "majority_stake" | "minority_stake" | "economic_interest"
      m_a_status: "announced" | "completed"
      m_a_structure:
        | "acquisition"
        | "merger"
        | "divestment"
        | "ownership_transfer"
      partnership_objective: "develop" | "build" | "operate" | "finance"
      project_company_role:
        | "special_purpose_vehicle"
        | "sponsor"
        | "contractor"
        | "operations_maintenance"
        | "equipment_supplier"
        | "lender"
        | "advisor"
        | "grid_operator"
        | "procurement_officer"
        | "tender_winner"
        | "organizer"
      project_contract_type:
        | "operate"
        | "build"
        | "own"
        | "transfer"
        | "maintain"
        | "design"
        | "finance"
        | "lease"
        | "rehabilitate"
      project_milestone:
        | "financial_closing"
        | "operational"
        | "commissioning"
        | "construction_started"
        | "awarded"
        | "in_construction"
        | "call_for_tender"
        | "pre_qualification_launched"
        | "epc_selection"
        | "initial_approval"
        | "project_update"
        | "1st_tranche"
        | "project_approved"
        | "construction_agreement"
        | "construction_restarted"
        | "development_capital_secured"
        | "funding_agreement"
        | "government_support"
        | "grant_approval"
        | "grid_connection_approved"
        | "implementation_agreement_signed"
        | "land_transfer"
        | "licenses_agreement"
        | "ppa_signed"
        | "eia_approval"
        | "mou_signed"
        | "partnership_agreement_signed"
        | "power_purchase_agreement"
        | "project_unveiled"
        | "site_visit"
        | "pre_feasibility_study_completed"
        | "supply_agreement"
      project_stage:
        | "proposal"
        | "memorandum_understanding"
        | "partnership_agreement"
        | "awarded"
        | "announced"
        | "completed"
        | "early_stage"
        | "late_stage"
        | "ready_to_build"
        | "not_to_proceed"
        | "in_development"
        | "in_construction"
        | "operational"
        | "revived"
        | "suspended"
        | "cancelled"
      project_tender_objective:
        | "engineering_procurement_construction"
        | "operations_maintenance"
        | "finance"
        | "commissioning"
        | "design"
        | "installation"
        | "supply"
        | "testing"
        | "transfer"
      revenue_model:
        | "purchasing_power_agreement"
        | "concession"
        | "turnkey"
        | "flexible"
        | "trading"
        | "rental"
        | "pay_as_you_go"
      sector:
        | "solar"
        | "wind"
        | "hydro"
        | "battery"
        | "hydrogen"
        | "biomass"
        | "geothermal"
        | "nuclear"
        | "oil_gas"
        | "renewables"
        | "non_renewables"
        | "utilities"
        | "telecom"
        | "transport"
        | "mining"
        | "real_estate"
        | "other"
      segment: "generation" | "storage" | "transmission" | "distribution"
      sub_sector:
        | "utility_scale"
        | "commercial_industrial"
        | "residential"
        | "offshore"
        | "onshore"
        | "cleantech"
        | "telecom"
      technology:
        | "photovoltaic"
        | "concentrated_solar_power"
        | "solar_home_systems"
        | "concentrated_photovoltaic"
        | "onshore_wind"
        | "offshore_wind"
        | "small_hydro"
        | "large_hydro"
        | "bess"
        | "lithium_ion"
        | "biogas"
        | "waste"
        | "oil"
        | "gas"
        | "coal"
        | "mini_grid"
        | "decentralised"
        | "high_voltage_transmission_lines"
        | "hydrogen"
        | "geothermal"
        | "nuclear"
      user_role: "admin" | "analyst_editor" | "subscriber" | "guest"
    }
    CompositeTypes: {
      project_evaluation_criteria: {
        technical: number | null
        financial: number | null
      }
      project_financing_type: {
        debt: number | null
        equity: number | null
        grants: number | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      client_profile: [
        "deal_advisor",
        "developer_ipp",
        "investor",
        "epc_om",
        "public_institution",
        "individual",
      ],
      company_activity: ["merger_acquisition", "financing", "offtaker"],
      company_classification: [
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
      ],
      company_size: [
        "1-10",
        "11-50",
        "51-250",
        "251-1000",
        "1001-5000",
        "5001-10000",
        "10000+",
      ],
      content_category: [
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
      ],
      content_status: ["draft", "published", "archived"],
      content_type: ["blog", "news", "research"],
      country_code: [
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
      ],
      deal_company_role: [
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
      ],
      deal_financing_type: ["debt", "equity", "grant", "green_bond"],
      deal_subtype: [
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
      ],
      deal_type: [
        "merger_acquisition",
        "financing",
        "power_purchase_agreement",
        "project_update",
        "joint_venture",
      ],
      financing_investor_type: [
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
      ],
      financing_objective: ["asset", "corporate", "government", "cleantech"],
      financing_subtype: [
        "project_finance",
        "loan",
        "grant",
        "equity",
        "private",
        "senior_debt",
      ],
      geographic_region: [
        "north_africa",
        "east_africa",
        "west_africa",
        "central_africa",
        "southern_africa",
      ],
      m_a_specifics: ["majority_stake", "minority_stake", "economic_interest"],
      m_a_status: ["announced", "completed"],
      m_a_structure: [
        "acquisition",
        "merger",
        "divestment",
        "ownership_transfer",
      ],
      partnership_objective: ["develop", "build", "operate", "finance"],
      project_company_role: [
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
        "organizer",
      ],
      project_contract_type: [
        "operate",
        "build",
        "own",
        "transfer",
        "maintain",
        "design",
        "finance",
        "lease",
        "rehabilitate",
      ],
      project_milestone: [
        "financial_closing",
        "operational",
        "commissioning",
        "construction_started",
        "awarded",
        "in_construction",
        "call_for_tender",
        "pre_qualification_launched",
        "epc_selection",
        "initial_approval",
        "project_update",
        "1st_tranche",
        "project_approved",
        "construction_agreement",
        "construction_restarted",
        "development_capital_secured",
        "funding_agreement",
        "government_support",
        "grant_approval",
        "grid_connection_approved",
        "implementation_agreement_signed",
        "land_transfer",
        "licenses_agreement",
        "ppa_signed",
        "eia_approval",
        "mou_signed",
        "partnership_agreement_signed",
        "power_purchase_agreement",
        "project_unveiled",
        "site_visit",
        "pre_feasibility_study_completed",
        "supply_agreement",
      ],
      project_stage: [
        "proposal",
        "memorandum_understanding",
        "partnership_agreement",
        "awarded",
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
      ],
      project_tender_objective: [
        "engineering_procurement_construction",
        "operations_maintenance",
        "finance",
        "commissioning",
        "design",
        "installation",
        "supply",
        "testing",
        "transfer",
      ],
      revenue_model: [
        "purchasing_power_agreement",
        "concession",
        "turnkey",
        "flexible",
        "trading",
        "rental",
        "pay_as_you_go",
      ],
      sector: [
        "solar",
        "wind",
        "hydro",
        "battery",
        "hydrogen",
        "biomass",
        "geothermal",
        "nuclear",
        "oil_gas",
        "renewables",
        "non_renewables",
        "utilities",
        "telecom",
        "transport",
        "mining",
        "real_estate",
        "other",
      ],
      segment: ["generation", "storage", "transmission", "distribution"],
      sub_sector: [
        "utility_scale",
        "commercial_industrial",
        "residential",
        "offshore",
        "onshore",
        "cleantech",
        "telecom",
      ],
      technology: [
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
      ],
      user_role: ["admin", "analyst_editor", "subscriber", "guest"],
    },
  },
} as const
