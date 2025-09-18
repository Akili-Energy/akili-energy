"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, PieChart } from "lucide-react"

interface FinancialsTabProps {
  companyId: string
}

export function FinancialsTab({ companyId }: FinancialsTabProps) {
  // Mock data - in real app, this would come from API
  const financials = {
    revenue: {
      current: "$285M",
      previous: "$220M",
      growth: "+29.5%",
      trend: "up",
    },
    ebitda: {
      current: "$95M",
      previous: "$72M",
      growth: "+31.9%",
      trend: "up",
    },
    netIncome: {
      current: "$45M",
      previous: "$28M",
      growth: "+60.7%",
      trend: "up",
    },
    totalAssets: {
      current: "$1.8B",
      previous: "$1.5B",
      growth: "+20.0%",
      trend: "up",
    },
  }

  const keyRatios = [
    { name: "ROE", value: "12.5%", description: "Return on Equity" },
    { name: "ROA", value: "2.5%", description: "Return on Assets" },
    { name: "Debt/Equity", value: "0.65", description: "Debt to Equity Ratio" },
    { name: "Current Ratio", value: "1.8", description: "Current Assets / Current Liabilities" },
    { name: "EBITDA Margin", value: "33.3%", description: "EBITDA / Revenue" },
    { name: "Asset Turnover", value: "0.16", description: "Revenue / Total Assets" },
  ]

  const revenueBreakdown = [
    { segment: "Solar Development", amount: "$120M", percentage: "42%" },
    { segment: "O&M Services", amount: "$85M", percentage: "30%" },
    { segment: "EPC Contracts", amount: "$55M", percentage: "19%" },
    { segment: "Consulting", amount: "$25M", percentage: "9%" },
  ]

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{financials.revenue.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{financials.revenue.growth}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">EBITDA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{financials.ebitda.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{financials.ebitda.growth}</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{financials.netIncome.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{financials.netIncome.growth}</span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{financials.totalAssets.current}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{financials.totalAssets.growth}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Financial Ratios */}
        <Card>
          <CardHeader>
            <CardTitle>Key Financial Ratios</CardTitle>
            <CardDescription>Important financial performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyRatios.map((ratio) => (
                <div key={ratio.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{ratio.name}</p>
                    <p className="text-sm text-muted-foreground">{ratio.description}</p>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {ratio.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue by business segment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((segment) => (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{segment.segment}</p>
                    <div className="text-right">
                      <p className="font-bold">{segment.amount}</p>
                      <p className="text-sm text-muted-foreground">{segment.percentage}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-akili-orange h-2 rounded-full" style={{ width: segment.percentage }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
