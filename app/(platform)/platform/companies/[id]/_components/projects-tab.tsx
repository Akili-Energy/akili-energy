"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Zap, DollarSign, MapPin, Building2, TrendingUp } from "lucide-react";
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Company } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-context";

export function ProjectsTab({ projects, portfolio }: Pick<Company, "projects" | "portfolio">) {
  const { t } = useLanguage();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Total Portfolio
            </p>
            <p className="text-2xl font-bold">{portfolio?.total ?? 0} MW</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">
              In Construction
            </p>
            <p className="text-2xl font-bold text-akili-orange">
              {portfolio?.inConstruction ?? 0} MW
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">
              In Development
            </p>
            <p className="text-2xl font-bold">
              {portfolio?.inDevelopment ?? 0} MW
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Operational
            </p>
            <p className="text-2xl font-bold text-green-600">
              {portfolio?.operational ?? 0} MW
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>
            List of all projects associated with this company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Capacity (MW)</TableHead>
                <TableHead>Investment ($M)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link
                        href={`/platform/projects/${project.id}`}
                        className="font-medium"
                      >
                        {project.name}
                      </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {t(`common.countries.${project.country}`)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`companies.roles.projects.${project.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {t(`projects.stages.${project.stage}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.plantCapacity || "-"}</TableCell>
                  <TableCell>{project.investmentCosts || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
