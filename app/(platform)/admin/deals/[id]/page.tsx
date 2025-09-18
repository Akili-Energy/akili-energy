"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  Users,
  ExternalLink,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Deal {
  id: string
  title: string
  deal_type: "M&A" | "Financing" | "JV" | "PPA" | "Project Update"
  deal_sub_type: string
  deal_status: string
  region: string
  country: string
  disclosed_amount: number
  announced_date: string
  completed_date?: string
  description: string
  strategy_rationale: string
  summary: string
  insights: string
  companies: Company[]
  advisors: Advisor[]
  created_at: string
  updated_at: string
}

interface Company {
  id: string
  name: string
  role: string
  classification: string
  sectors: string[]
  hq_country: string
}

interface Advisor {
  id: string
  name: string
  type: "Financial" | "Technical" | "Legal"
  role: string
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params.id as string

  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDealData()
  }, [dealId])

  const loadDealData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockDeal: Deal = {
        id: dealId,
        title: "Gaia Renewables Acquires Minority Stakes in Three Renewable Energy Assets",
        deal_type: "M&A",
        deal_sub_type: "M&A - Asset",
        deal_status: "Completed",
        region: "South Africa",
        country: "South Africa",
        disclosed_amount: 38400000,
        announced_date: "2024-03-19",
        completed_date: "2024-03-19",
        description:
          "Gaia Renewables 1, listed on the Cape Town Stock Exchange, has announced the acquisition of minority stakes in three high-quality renewable energy assets.",
        strategy_rationale:
          "This acquisition significantly enhances Gaia's renewable energy portfolio and deepens its role in South Africa's energy transition.",
        summary: `Gaia Renewables 1, listed on the Cape Town Stock Exchange, has announced the acquisition of minority stakes in three high-quality renewable energy assets. The company acquired a 10% stake in both the Linde and Kalkbult solar PV plants and a 21% stake in the Jeffreys Bay Wind Farm. This move significantly enhances Gaia's renewable energy portfolio and deepens its role in South Africa's energy transition.

Key Metrics:
• Acquisition Value: Over R700 million (~$38.4 million)
• Stake Acquired: 10% in Linde Solar Plant, 10% in Kalkbult Solar Plant, 21% in Jeffreys Bay Wind Farm
• Seller: IDEAS Renewable Energy Fund (managed by AIIM)
• Funding Structure: Combination of debt and equity, supplemented by preference share issuances

Asset Details:
• Technologies: Solar PV and Onshore Wind
• Development Context: Part of South Africa's first and second REIPPPP rounds
• Additional Holdings: Gaia already owns a 16% stake in the Tsitsikamma Community Wind Farm
• Financing Strategy: Issuance of preference shares to repay acquisition debt`,
        insights:
          "This acquisition demonstrates the continued consolidation in South Africa's renewable energy sector, with established players like Gaia expanding their portfolios through strategic acquisitions of operational assets.",
        companies: [
          {
            id: "1",
            name: "Gaia Renewables",
            role: "Acquirer",
            classification: "Listed",
            sectors: ["Solar", "Wind"],
            hq_country: "South Africa",
          },
          {
            id: "2",
            name: "IDEAS Renewable Energy Fund",
            role: "Seller",
            classification: "Fund",
            sectors: ["Renewable Energy"],
            hq_country: "South Africa",
          },
          {
            id: "3",
            name: "AIIM",
            role: "Fund Manager",
            classification: "Asset Manager",
            sectors: ["Infrastructure"],
            hq_country: "South Africa",
          },
        ],
        advisors: [
          {
            id: "1",
            name: "Rand Merchant Bank",
            type: "Financial",
            role: "Financial Advisor to Gaia Renewables",
          },
          {
            id: "2",
            name: "Webber Wentzel",
            type: "Legal",
            role: "Legal Advisor to Gaia Renewables",
          },
          {
            id: "3",
            name: "PwC",
            type: "Financial",
            role: "Financial Due Diligence",
          },
        ],
        created_at: "2024-03-19T00:00:00Z",
        updated_at: "2024-03-19T00:00:00Z",
      }

      setDeal(mockDeal)
    } catch (error) {
      console.error("Error loading deal data:", error)
      toast.error("Failed to load deal data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading deal details...</div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Deal not found</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/deals">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Deals
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold line-clamp-2">{deal.title}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{deal.deal_type}</Badge>
                <Badge variant="secondary">{deal.deal_sub_type}</Badge>
                <Badge variant={deal.deal_status === "Completed" ? "default" : "secondary"}>{deal.deal_status}</Badge>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/deals/${dealId}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Deal
            </Link>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="companies">Companies ({deal.companies.length})</TabsTrigger>
              <TabsTrigger value="advisors">Advisors ({deal.advisors.length})</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deal Information */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Deal Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600">{deal.description}</p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2">Strategy Rationale</h4>
                        <p className="text-gray-600">{deal.strategy_rationale}</p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2">Detailed Summary</h4>
                        <div className="text-gray-600 whitespace-pre-line">{deal.summary}</div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2">Market Insights</h4>
                        <p className="text-gray-600">{deal.insights}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Deal Stats & Key Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Deal Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        ${(deal.disclosed_amount / 1000000).toFixed(1)}M
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Disclosed Amount</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{deal.country}</div>
                          <div className="text-sm text-gray-500">{deal.region}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">Announced</div>
                          <div className="text-sm text-gray-500">{deal.announced_date}</div>
                        </div>
                      </div>

                      {deal.completed_date && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Completed</div>
                            <div className="text-sm text-gray-500">{deal.completed_date}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">Status</div>
                          <Badge variant={deal.deal_status === "Completed" ? "default" : "secondary"}>
                            {deal.deal_status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="companies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Companies Involved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deal.companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{company.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{company.role}</Badge>
                            <Badge variant="secondary">{company.classification}</Badge>
                            <span className="text-sm text-gray-500">{company.hq_country}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {company.sectors.map((sector) => (
                              <Badge key={sector} variant="outline" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/companies/${company.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advisors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Deal Advisors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deal.advisors.map((advisor) => (
                      <div key={advisor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{advisor.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{advisor.role}</p>
                        </div>
                        <Badge
                          variant={
                            advisor.type === "Financial"
                              ? "default"
                              : advisor.type === "Legal"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {advisor.type} Advisor
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Deal Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-semibold">Deal Announced</div>
                        <div className="text-sm text-gray-500">{deal.announced_date}</div>
                        <p className="text-sm text-gray-600 mt-1">
                          Initial announcement of the acquisition by Gaia Renewables
                        </p>
                      </div>
                    </div>

                    {deal.completed_date && (
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <div className="font-semibold">Deal Completed</div>
                          <div className="text-sm text-gray-500">{deal.completed_date}</div>
                          <p className="text-sm text-gray-600 mt-1">
                            Transaction successfully closed and assets transferred
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-semibold">Record Updated</div>
                        <div className="text-sm text-gray-500">{deal.updated_at.split("T")[0]}</div>
                        <p className="text-sm text-gray-600 mt-1">Latest update to deal information</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
