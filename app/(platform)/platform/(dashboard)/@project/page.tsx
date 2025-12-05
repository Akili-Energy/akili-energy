"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ResponsiveContainer,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Target, BarChart3, PieChartIcon, Map } from "lucide-react";
import { getProjectsAnalytics } from "@/app/actions/actions";
import { useLanguage } from "@/components/language-context";
import { projectSector, projectStage } from "@/lib/db/schema";
import dynamic from "next/dynamic";
import { formatMonth } from "@/lib/utils";

export default function ProjectAnalyticsPage() {
  const { t, language } = useLanguage();

  const [analytics, setAnalytics] =
    useState<Awaited<ReturnType<typeof getProjectsAnalytics>>>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getProjectsAnalytics();
      setAnalytics(data);
    });
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 w-full max-w-[100vw] overflow-x-hidden">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-akili-orange/10 rounded-lg flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-akili-orange" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-akili-blue">
            Project Development Analytics
          </h2>
        </div>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
              Project Investment vs Capacity by Sector
            </CardTitle>
            <CardDescription>
              Monthly project amount vs capacity with sector breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[600px] h-[350px] md:h-[400px]">
                <ChartContainer
                  config={Object.fromEntries(
                    projectSector.enumValues.map((s) => [
                      s,
                      {
                        label: s,
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
                      data={analytics?.projectsByMonthAndSector.map((p) => ({
                        ...p,
                        month: formatMonth(language, p?.month),
                      }))}
                      margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} dy={10} />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Installed Capacity (MW)",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          style: {
                            textAnchor: "middle",
                            fill: "var(--muted-foreground)",
                          },
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Total Investments ($M)",
                          angle: 90,
                          position: "insideRight",
                          offset: 0,
                          style: {
                            textAnchor: "middle",
                            fill: "var(--muted-foreground)",
                          },
                        }}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        content={<ChartTooltipContent />}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                      />
                      {projectSector.enumValues.map((ps, i, arr) => (
                        <Bar
                          key={ps}
                          yAxisId="left"
                          dataKey={ps}
                          stackId="a"
                          fill={`var(--color-${ps})`}
                          name={t(`common.sectors.${ps}`)}
                          radius={
                            i === 0
                              ? [0, 0, 4, 4]
                              : i === arr.length - 1
                              ? [4, 4, 0, 0]
                              : [0, 0, 0, 0]
                          }
                        />
                      ))}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Investment"
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

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BarChart3 className="w-5 h-5 text-akili-blue shrink-0" />
              Project Distribution by Development Stage
            </CardTitle>
            <CardDescription>
              Monthly project count categorized by development stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[600px] h-[350px] md:h-[400px]">
                <ChartContainer
                  config={Object.fromEntries(
                    projectStage.enumValues.map((s) => [
                      s,
                      {
                        label: s,
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
                    <BarChart
                      data={analytics?.projectsByMonthAndStage.map((p) => ({
                        ...p,
                        month: formatMonth(language, p?.month),
                      }))}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="4 1 2" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} dy={10} />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Project Count",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
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
                      {projectStage.enumValues.map((stage, i, arr) => (
                        <Bar
                          key={stage}
                          yAxisId="left"
                          dataKey={stage}
                          stackId="a"
                          fill={`var(--color-${stage})`}
                          name={t(`projects.stages.${stage}`)}
                          radius={
                            i === 0
                              ? [0, 0, 4, 4]
                              : i === arr.length - 1
                              ? [4, 4, 0, 0]
                              : [0, 0, 0, 0]
                          }
                        />
                      ))}
                    </BarChart>
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
                <PieChartIcon className="w-5 h-5 text-akili-green shrink-0" />
                Project Distribution by Sector
              </CardTitle>
              <CardDescription>
                Current project portfolio breakdown by sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[300px] md:h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.projectsBySector}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="percentage"
                        nameKey="sector"
                      >
                        {analytics?.projectsBySector.map(({ color }, i) => {
                          return <Cell key={`cell-${i}`} fill={color} />;
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value}%`,
                          t(`common.sectors.${name}`),
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 grid content-start">
                  {analytics?.projectsBySector.map(
                    ({ sector, color, projectCount, percentage }) => (
                      <div
                        key={sector}
                        className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium truncate">
                            {t(`common.sectors.${sector}`)}
                          </span>
                        </div>
                        <div className="text-right ml-2 shrink-0">
                          <div className="font-semibold">{percentage}%</div>
                          <div className="text-xs text-gray-500">
                            {projectCount} projects
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Map className="w-5 h-5 text-akili-blue shrink-0" />
                Interactive Regional Map
              </CardTitle>
              <CardDescription>
                Hover over countries for project financing and capacity data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] md:h-[400px] w-full">
                <InteractiveMap
                  data={analytics?.countriesByCapacityAndFinancing ?? []}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

const InteractiveMap = dynamic(() => import("@/components/dashboard-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
