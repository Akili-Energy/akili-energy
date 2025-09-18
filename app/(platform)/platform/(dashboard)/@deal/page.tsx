"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Tooltip,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  PieChartIcon,
  Award,
  Briefcase,
  MapPin,
  Calendar,
  TrendingUp,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { getDealsAnalytics } from "@/app/actions/actions";
import { useLanguage } from "@/components/language-context";
import { getCountryFlag } from "@/lib/utils";

export default function DealAnalyticsPage() {
  const { t } = useLanguage();

  const [analytics, setAnalytics] =
    useState<Awaited<ReturnType<typeof getDealsAnalytics>>>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getDealsAnalytics();
      setAnalytics(data);
    });
  }, []);

  return (
    <div className="p-6 space-y-8">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-akili-green/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-akili-green" />
          </div>
          <h2 className="text-2xl font-bold text-akili-blue">Deal Analytics</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-akili-blue" />
              Monthly Deal Volume by Type
            </CardTitle>
            <CardDescription>
              Stacked column chart showing deal count segmented by type over
              time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                financing: { label: "Financing", color: "#10b981" },
                merger_acquisition: { label: "M&A", color: "#3b82f6" },
                power_purchase_agreement: { label: "PPA", color: "#f59e0b" },
                project_update: { label: "Project Update", color: "#ef4444" },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.dealsByMonthAndType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Deal Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="financing"
                    stackId="a"
                    fill="var(--color-financing)"
                    name="Financing"
                  />
                  <Bar
                    dataKey="merger_acquisition"
                    stackId="a"
                    fill="var(--color-merger_acquisition)"
                    name="M&A"
                  />
                  <Bar
                    dataKey="power_purchase_agreement"
                    stackId="a"
                    fill="var(--color-power_purchase_agreement)"
                    name="PPA"
                  />
                  <Bar
                    dataKey="project_update"
                    stackId="a"
                    fill="var(--color-project_update)"
                    name="Project Update"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-akili-green" />
              Financing Deals Volume by Type vs Value Trends
            </CardTitle>
            <CardDescription>
              Monthly financing deals volume (bars) categorized by financing
              type vs amount (line)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                debt: { label: "Debt", color: "#10b981" },
                equity: { label: "Equity", color: "#3b82f6" },
                grant: { label: "Grant", color: "#f59e0b" },
                green_bond: { label: "Green Bond", color: "#ef4444" },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={analytics?.financingDealsByMonthAndType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "Deal Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Amount ($M)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="debt"
                    stackId="a"
                    fill="var(--color-debt)"
                    name="Debt"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="equity"
                    stackId="a"
                    fill="var(--color-equity)"
                    name="Equity"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="grant"
                    stackId="a"
                    fill="var(--color-grant)"
                    name="Grant"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="green_bond"
                    stackId="a"
                    fill="var(--color-green_bond)"
                    name="Green Bond"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Deal Value"
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-akili-blue" />
                PPA by Offtaker Sector
              </CardTitle>
              <CardDescription>
                PPA deal volume by offtaker company sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics?.ppaDealsByOfftakerSector.map((d) => ({
                    ...d,
                    offtakerSector: t(`common.sectors.${d.offtakerSector}`),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="offtakerSector" />
                  <YAxis
                    yAxisId="left"
                    dataKey="dealCount"
                    label={{
                      value: "Deal Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="dealCount" fill="#f59e0b" name="Deal Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-akili-blue" />
                PPA by Subtype
              </CardTitle>
              <CardDescription>
                PPA deal volume distribution by subtype
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics?.ppaDealsBySubtype.map((d) => ({
                    ...d,
                    subtype: t(`deals.subtypes.${d.subtype}`),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subtype" />
                  <YAxis
                    yAxisId="left"
                    dataKey="dealCount"
                    label={{
                      value: "Deal Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="dealCount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-akili-blue" />
                PPA by Offtaker Sector
              </CardTitle>
              <CardDescription>
                PPA deal volume by offtaker company sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics?.ppaDealsByDuration.map((ppa) =>
                    ppa.duration ? ppa : { ...ppa, duration: "undisclosed" }
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="duration"
                    label={{
                      value: "Duration",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    dataKey="dealCount"
                    label={{
                      value: "Deal Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="dealCount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-akili-green/10 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-akili-green" />
          </div>
          <h2 className="text-2xl font-bold text-akili-blue">
            Geographic Hotspots
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-akili-orange" />
                Top Countries by Deal Value
              </CardTitle>
              <CardDescription>
                Leading markets in African energy sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics?.topCountriesByDealValue ?? []).map(
                  ({
                    countryCode,
                    dealValue,
                    dealCount,
                    totalCapacity,
                    rank,
                  }) => (
                    <div
                      key={countryCode}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-akili-blue/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {rank}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getCountryFlag(countryCode)}
                          </span>
                          <div>
                            <p className="font-medium">
                              {t(`common.countries.${countryCode}`)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {dealCount} deals
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-akili-green">
                          ${dealValue}M
                        </p>
                        {totalCapacity && (
                          <p className="text-sm text-gray-500">
                            {totalCapacity} MW
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-akili-orange" />
                Top Companies by Fundraising
              </CardTitle>
              <CardDescription>
                Leading companies in African energy sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics?.topCompaniesByFinancingAndCapacity ?? []).map(
                  (
                    {
                      companyId,
                      companyName,
                      totalFundraising,
                      totalCapacity,
                      logoUrl,
                      dealCount,
                    },
                    i
                  ) => (
                    <div
                      key={companyId}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-akili-blue/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {/* {getCountryFlag(countryCode)} */}
                          </span>
                          <div>
                            <p className="font-medium">{companyName}</p>
                            <p className="text-sm text-gray-500">
                              {dealCount} deals
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-akili-green">
                          ${totalFundraising}M
                        </p>
                        <p className="text-sm text-gray-500">
                          {totalCapacity} MW
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-akili-orange/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-akili-orange" />
            </div>
            <h2 className="text-2xl font-bold text-akili-blue">
              Recent Market Activity
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/platform/deals">
              View All Deals <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Latest Deals</CardTitle>
            <CardDescription>
              Real-time updates on deals and project developments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.latestDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/platform/deals/${deal.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm text-akili-blue max-w-lg truncate group-hover:text-akili-blue/80 group-hover:underline">
                        {deal.update}
                      </p>
                      <Badge
                        variant="secondary"
                        className={"text-xs bg-akili-blue/10 text-akili-blue"}
                      >
                        {t(`deals.types.${deal.type}`)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={"text-xs border-akili-blue text-akili-blue"}
                      >
                        {t(`deals.subtypes.${deal.subtype}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{deal.asset}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{deal.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{deal.date.toLocaleDateString()}</span>
                      </span>
                      {deal.sectors.length && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600"
                        >
                          {deal.sectors.length > 1
                            ? "Multiple"
                            : t(`common.sectors.${deal.sectors[0]}`)}
                        </Badge>
                      )}
                      {deal.projectStage && (
                        <Badge variant="outline" className="text-xs">
                          {t(`projects.stages.${deal.projectStage}`)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {deal.amount && (
                      <p className="font-semibold text-akili-green">
                        ${deal.amount}M
                      </p>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-akili-blue transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
