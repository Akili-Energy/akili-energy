"use client";;
import { use } from "react";

import type React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./_components/overview-tab";
import { ProjectsTab } from "./_components/projects-tab";
import { DealsTab } from "./_components/deals-tab";
import { FinancialsTab } from "./_components/financials-tab";
import { TeamTab } from "./_components/team-tab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CompanyPageProps {
  params: {
    id: string;
  };
}

const CompanyPage: React.FC<CompanyPageProps> = props => {
  const params = use(props.params);
  const { id } = params;

  const company = {
    id: id,
    name: "SolarTech Africa",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Leading solar energy solutions provider across East Africa",
    industry: "Solar Energy",
    location: "Nairobi, Kenya",
    website: "https://solartech-africa.com",
    status: "active",
    foundedYear: 2018,
    employees: "50-100",
    revenue: "$5M-10M",
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header with Back Button, Logo and Company Name */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/platform/companies">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
        </Button>
        <div className="flex items-center space-x-4">
          <Image
            src={company.logo || "/placeholder.svg"}
            alt={`${company.name} logo`}
            width={60}
            height={60}
            className="rounded-lg border"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">{company.description}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          {/* <TabsTrigger value="financials">Financials</TabsTrigger> */}
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab companyId={id} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab companyId={id} />
        </TabsContent>
        <TabsContent value="deals">
          <DealsTab companyId={id} />
        </TabsContent>
        {/* <TabsContent value="financials">
          <FinancialsTab companyId={id} />
        </TabsContent> */}
        <TabsContent value="team">
          <TeamTab companyId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyPage;
