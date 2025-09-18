"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, DollarSign, Zap, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AnalyticsService } from "@/lib/services/analytics";

const kpiData = [
  {
    id: "deals",
    title: "Total Deals",
    value: "275",
    change: "+15.2%",
    icon: TrendingUp,
    color: "blue",
    subtitle: "Active deals",
  },
  {
    id: "value",
    title: "Deal Value",
    value: "$4.7B",
    change: "+12.5%",
    icon: DollarSign,
    color: "green",
    subtitle: "Total value",
  },
  {
    id: "capacity",
    title: "Total Capacity",
    value: "5,720 MW",
    change: "+8.3%",
    icon: Zap,
    color: "orange",
    subtitle: "Installed capacity",
  },
  {
    id: "multiple",
    title: "Avg. EV Multiple",
    value: "$0.82M/MW",
    change: "-2.1%",
    icon: Building2,
    color: "blue",
    subtitle: "Valuation metric",
  },
];

export default function OverviewPage() {
  // Mocking state, can be replaced with real data fetching
  const [stats, setStats] = useState({
    totalDeals: 275,
    dealValue: 4700,
    totalCapacity: 5720,
    avgMultiple: 0.82,
  });

  // useEffect(() => {
  //   AnalyticsService.getDashboardStats().then(setStats);
  // }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-akili-blue/10 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-akili-blue" />
        </div>
        <h2 className="text-2xl font-bold text-akili-blue">Market Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.id}
              className={`border-l-4 ${
                kpi.color === "blue"
                  ? "border-l-akili-blue"
                  : kpi.color === "green"
                  ? "border-l-akili-green"
                  : "border-l-akili-orange"
              } hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">
                    {kpi.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                </div>
                <Icon
                  className={`h-5 w-5 ${
                    kpi.color === "blue"
                      ? "text-akili-blue"
                      : kpi.color === "green"
                      ? "text-akili-green"
                      : "text-akili-orange"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-akili-blue">
                  {kpi.value}
                </div>
                <p
                  className={`text-xs ${
                    kpi.change.startsWith("+")
                      ? "text-akili-green"
                      : "text-red-500"
                  }`}
                >
                  {kpi.change} from last quarter
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
