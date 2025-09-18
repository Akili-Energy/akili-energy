"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, ExternalLink } from "lucide-react"

interface DealsTabProps {
  companyId: string
}

export function DealsTab({ companyId }: DealsTabProps) {
  // Mock data - in real app, this would come from API
  const deals = [
    {
      id: "1",
      title: "Series B Funding Round",
      type: "Equity",
      amount: "$150M",
      status: "Completed",
      date: "2023-08-15",
      investors: ["Green Climate Fund", "African Development Bank", "Investec"],
      description: "Series B funding to expand solar operations across East Africa",
    },
    {
      id: "2",
      title: "Project Finance - Kathu Solar",
      type: "Debt",
      amount: "$460M",
      status: "Completed",
      date: "2018-12-10",
      investors: ["World Bank", "Development Bank of Southern Africa"],
      description: "Project financing for 100MW concentrated solar power plant",
    },
    {
      id: "3",
      title: "Green Bond Issuance",
      type: "Bond",
      amount: "$200M",
      status: "In Progress",
      date: "2024-03-01",
      investors: ["Various Institutional Investors"],
      description: "Green bond to finance renewable energy projects portfolio",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Equity":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Debt":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Bond":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Company Deals</h3>
          <p className="text-sm text-muted-foreground">
            {deals.length} deals • Total value: $
            {deals.reduce((sum, d) => sum + Number.parseInt(d.amount.replace(/[$M]/g, "")), 0)}M
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <CardDescription className="mt-1">{deal.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(deal.type)}>{deal.type}</Badge>
                  <Badge className={getStatusColor(deal.status)}>{deal.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deal Value</p>
                    <p className="text-lg font-bold text-green-600">{deal.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{new Date(deal.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Investors</p>
                <div className="flex flex-wrap gap-2">
                  {deal.investors.map((investor, index) => (
                    <Badge key={index} variant="outline">
                      {investor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
