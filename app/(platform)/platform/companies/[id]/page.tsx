"use client" 

import { getCompanyById } from "@/app/actions/companies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./_components/overview-tab";
import { ProjectsTab } from "./_components/projects-tab";
import { DealsTab } from "./_components/deals-tab";
import { TeamTab } from "./_components/team-tab";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { FetchCompanyResult } from "@/lib/types";
import { useState, useTransition, useEffect } from "react";

export default function CompanyPage() {
  const params = useParams<{ id: string }>();

  const [company, setCompany] = useState<FetchCompanyResult>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Redirect Project Updates to project pages
    startTransition(async () => {
      const companyDetail = await getCompanyById(params?.id ?? "");
      setCompany(companyDetail);
    });
  }, []);

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <div className="mb-4 md:mb-0">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/platform/companies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-4 flex-1">
          <Image
            src={company?.logoUrl || "/placeholder.svg"}
            alt={`${company?.name} logo`}
            width={60}
            height={60}
            className="rounded-lg border bg-white object-contain"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{company?.name}</h1>
            {/* <p className="text-gray-600 text-sm">{company?.description}</p> */}
          </div>
          {company?.website && (
            <Button variant="outline" asChild>
              <a
                href={company?.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab company={company} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab
            projects={company?.projects}
            portfolio={company?.portfolio}
          />
        </TabsContent>
        <TabsContent value="deals">
          <DealsTab deals={company?.deals} />
        </TabsContent>
        <TabsContent value="team">
          <TeamTab team={company?.team} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
