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
  PieChart,
  Pie,
  Cell,
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
import { formatMonth, getCountryFlag } from "@/lib/utils";
import { dealFinancingType } from "@/lib/db/schema";

export default function DealAnalyticsPage() {
  const { language, t } = useLanguage();

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
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 w-full max-w-[100vw] overflow-x-hidden">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-akili-green/10 rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-akili-green" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-akili-blue">
            Deal Analytics
          </h2>
        </div>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
              Monthly Deal Volume by Type
            </CardTitle>
            <CardDescription>
              Stacked column chart showing deal count segmented by type over
              time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[600px] h-[350px] md:h-[400px]">
                <ChartContainer
                  config={{
                    financing: { label: "Financing", color: "#10b981" },
                    merger_acquisition: { label: "M&A", color: "#3b82f6" },
                    power_purchase_agreement: {
                      label: "PPA",
                      color: "#f59e0b",
                    },
                    project_update: {
                      label: "Project Update",
                      color: "#ef4444",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={300}
                  >
                    <BarChart
                      data={analytics?.dealsByMonthAndType
                        .filter((d) => d?.month.startsWith("2025"))
                        .map((d) => ({
                          ...d,
                          month: formatMonth(language, d?.month),
                        }))}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      // barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="4 1 2" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} dy={10} />
                      <YAxis
                        yAxisId="left"
                        dataKey="dealCount"
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Deal Count",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            textAnchor: "middle",
                            fill: "var(--muted-foreground)",
                          },
                        }}
                      />
                      <ChartTooltip
                        cursor={{ fill: "transparent" }}
                        content={<ChartTooltipContent />}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                      />
                      <Bar
                        dataKey="financing"
                        stackId="a"
                        fill="var(--color-financing)"
                        name="Financing"
                        radius={[0, 0, 4, 4]}
                      />
                      <Bar
                        dataKey="merger_acquisition"
                        stackId="a"
                        fill="var(--color-merger_acquisition)"
                        name="M&A"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="power_purchase_agreement"
                        stackId="a"
                        fill="var(--color-power_purchase_agreement)"
                        name="PPA"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="project_update"
                        stackId="a"
                        fill="var(--color-project_update)"
                        name="Project Update"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <PieChartIcon className="w-5 h-5 text-akili-green shrink-0" />
              Financing Deals: Volume vs Value
            </CardTitle>
            <CardDescription>
              Monthly financing deals volume (bars) vs amount (line)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[600px] h-[350px] md:h-[400px]">
                <ChartContainer
                  config={Object.fromEntries(
                    dealFinancingType.enumValues.map((type) => [
                      type,
                      {
                        label: t(`deals.financing.types.${type}`),
                        color: `#${Math.floor(Math.random() * 16777215)
                          .toString(16)
                          .padStart(6, "0")}`,
                      },
                    ])
                  )}
                  className="h-full w-full"
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={300}
                  >
                    <ComposedChart
                      data={analytics?.financingDealsByMonthAndType.map(
                        (d) => ({
                          ...d,
                          month: formatMonth(language, d?.month),
                        })
                      )}
                      margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      // barCategoryGap="25%"
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} dy={10} />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Count",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          style: { fill: "var(--muted-foreground)" },
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Amount ($M)",
                          angle: 90,
                          position: "insideRight",
                          offset: 0,
                          style: { fill: "var(--muted-foreground)" },
                        }}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        content={<ChartTooltipContent />}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                      />
                      {...dealFinancingType.enumValues.map((type) => (
                        <Bar
                          key={type}
                          yAxisId="left"
                          dataKey={type}
                          stackId="a"
                          fill={`var(--color-${type})`}
                          name={t(`deals.financing.types.${type}`)}
                        />
                      ))}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Deal Value"
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
                PPA by Offtaker Sector
              </CardTitle>
              <CardDescription>PPA deal volume by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.ppaDealsByOfftakerSector.map((d) => ({
                      ...d,
                      offtakerSector: t(`common.sectors.${d.offtakerSector}`),
                    }))}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="offtakerSector"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      yAxisId="left"
                      dataKey="dealCount"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="dealCount" fill="#f59e0b" name="Deal Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
                PPA by Duration
              </CardTitle>
              <CardDescription>PPA deal volume by duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.ppaDealsByDuration}
                    margin={{ top: 5, right: 5, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="durationRange"
                      tick={{ fontSize: 10 }}
                      label={{
                        value: "Duration (Years)",
                        position: "insideBottom",
                        offset: -10,
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      yAxisId="left"
                      dataKey="dealCount"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="dealCount" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
                PPA by Subtype
              </CardTitle>
              <CardDescription>
                PPA deal volume distribution by subtype
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.ppaDealsBySubtype.map((d) => ({
                        ...d,
                        subtype: t(`deals.subtypes.${d.subtype}`),
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="dealCount"
                      nameKey="subtype"
                    >
                      {analytics?.ppaDealsBySubtype.map(({ color }, i) => {
                        return <Cell key={`cell-${i}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
                M&A by Category
              </CardTitle>
              <CardDescription>
                M&A deal volume distribution by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.maDealsBySubtype.map((d) => ({
                        ...d,
                        subtype: t(`deals.subtypes.${d.subtype}`),
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="dealCount"
                      nameKey="subtype"
                    >
                      {analytics?.maDealsBySubtype.map(({ color }, i) => {
                        return <Cell key={`cell-${i}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-akili-green/10 rounded-lg flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-akili-green" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-akili-blue">
            Geographic Hotspots
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Award className="w-5 h-5 text-akili-orange shrink-0" />
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
                      // Stack on mobile, Row on desktop
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-akili-blue/10 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                          {rank}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg shrink-0">
                            {getCountryFlag(countryCode)}
                          </span>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {t(`common.countries.${countryCode}`)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {dealCount} deals
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:block items-center justify-between sm:text-right w-full sm:w-auto pl-11 sm:pl-0">
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
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Award className="w-5 h-5 text-akili-orange shrink-0" />
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
                      dealCount,
                    },
                    i
                  ) => (
                    <div
                      key={companyId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-akili-blue/10 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium line-clamp-1 break-all">
                              {companyName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {dealCount} deals
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:block items-center justify-between sm:text-right w-full sm:w-auto pl-11 sm:pl-0">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-akili-orange/10 rounded-lg flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-akili-orange" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-akili-blue">
              Recent Market Activity
            </h2>
          </div>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
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
                  href={
                    deal.type === "project_update" && deal.assetIds.length > 0
                      ? `/platform/projects/${deal.assetIds[0]}`
                      : `/platform/deals/${deal.id}`
                  }
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group gap-4 sm:gap-0"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm text-akili-blue w-full sm:w-auto sm:max-w-xs lg:max-w-lg truncate group-hover:text-akili-blue/80 group-hover:underline">
                        {deal.update}
                      </p>
                      <Badge
                        variant="secondary"
                        className={
                          "text-xs bg-akili-blue/10 text-akili-blue whitespace-nowrap"
                        }
                      >
                        {t(`deals.types.${deal.type}`)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          "text-xs border-akili-blue text-akili-blue whitespace-nowrap"
                        }
                      >
                        {t(`deals.subtypes.${deal.subtype}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {deal.asset}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                      <span className="flex items-center space-x-1 shrink-0">
                        <MapPin className="w-3 h-3" />
                        <span>{deal.location}</span>
                      </span>
                      <span className="flex items-center space-x-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span>{deal.date.toLocaleDateString()}</span>
                      </span>
                      {deal.sectors.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 shrink-0"
                        >
                          {deal.sectors.length > 1
                            ? "Multiple"
                            : t(`common.sectors.${deal.sectors[0]}`)}
                        </Badge>
                      )}
                      {deal.projectStage && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {t(`projects.stages.${deal.projectStage}`)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:text-right gap-2 sm:gap-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    {deal.amount && (
                      <p className="font-semibold text-akili-green whitespace-nowrap">
                        ${deal.amount}M
                      </p>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-gray-400 hidden sm:block group-hover:text-akili-blue transition-colors" />
                    <span className="text-xs text-gray-400 sm:hidden flex items-center gap-1">
                      View Details <ArrowUpRight className="w-3 h-3" />
                    </span>
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
