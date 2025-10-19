"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  overview,
  deal,
  project,
}: {
  overview: React.ReactNode;
  deal: React.ReactNode;
  project: React.ReactNode;
}) {
  const [filters, setFilters] = useState({
    sector: "all",
    dealType: "all",
    dateRange: "12m",
    region: "all",
  });

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="-my-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-akili-blue">
                Akili Energy Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive insights into African energy markets and deal flow
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Parallel Route for Overview KPI Cards */}
        {overview}

        <Tabs defaultValue="deals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deals">Deal Analytics</TabsTrigger>
            <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          </TabsList>

          {/* Parallel Route for Deal Analytics */}
          <TabsContent value="deals">{deal}</TabsContent>

          {/* Parallel Route for Project Analytics */}
          <TabsContent value="projects">{project}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
