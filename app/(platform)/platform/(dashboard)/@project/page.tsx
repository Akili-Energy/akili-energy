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
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-akili-orange/10 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-akili-orange" />
          </div>
          <h2 className="text-2xl font-bold text-akili-blue">
            Project Development Analytics
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Investment vs Capacity by Sector</CardTitle>
            <CardDescription>
              Monthly project amount vs capacity with sector breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
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
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  data={analytics?.projectsByMonthAndSector.map((p) => ({
                    ...p,
                    month: formatMonth(language, p?.month),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "Installed Capacity (MW)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Total Investments ($M)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {projectSector.enumValues.map((ps) => (
                    <Bar
                      key={ps}
                      yAxisId="left"
                      dataKey={ps}
                      stackId="a"
                      fill={`var(--color-${ps})`}
                      name={t(`common.sectors.${ps}`)}
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
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Distribution by Development Stage</CardTitle>
            <CardDescription>
              Monthly project count categorized by development stage
            </CardDescription>
          </CardHeader>
          <CardContent>
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
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics?.projectsByMonthAndStage.map((p) => ({
                    ...p,
                    month: formatMonth(language, p?.month),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Project Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />

                  <Legend />
                  {projectStage.enumValues.map((stage) => (
                    <Bar
                      key={stage}
                      yAxisId="left"
                      dataKey={stage}
                      stackId="a"
                      fill={`var(--color-${stage})`}
                      name={t(`projects.stages.${stage}`)}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-akili-green" />
                Project Distribution by Sector
              </CardTitle>
              <CardDescription>
                Current project portfolio breakdown by sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={analytics?.projectsBySector}
                      cx="50%"
                      cy="50%"
                      // labelLine={false}
                      // label={({ name, value }) => `${name}: ${value}%`}
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="percentage"
                      nameKey="sector"
                    >
                      {analytics?.projectsBySector.map(({ color }, i) => {
                        console.log(color);
                        return <Cell key={`cell-${i}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value}%`,
                        t(`common.sectors.${name}`),
                      ]}
                    />
                    {/* <Legend /> */}
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 grid">
                  {analytics?.projectsBySector.map(
                    ({ sector, color, projectCount, percentage }) => (
                      <div
                        key={sector}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium">{sector}</span>
                        </div>
                        <div className="text-right">
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
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-akili-blue" />
                Interactive Regional Map
              </CardTitle>
              <CardDescription>
                Hover over countries for project financing and capacity data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] w-full">
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
