import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, User, ArrowRight, Download, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UnifiedHeader } from "@/components/unified-header"

const newsArticles = [
  {
    id: 1,
    title: "AMEA Power Commissions 500 MW Abydos Solar Power Plant in Egypt",
    excerpt:
      "Major milestone in Egypt's renewable energy expansion with the commissioning of one of Africa's largest solar installations.",
    author: "Energy News Africa",
    date: "April 16, 2025",
    category: "Project Updates",
    image: "/placeholder.svg?height=200&width=300",
    urgent: true,
  },
  {
    id: 2,
    title: "AfDB Approves $185M for REPP 2 Renewable Energy Fund",
    excerpt:
      "Multi-country renewable energy initiative receives significant funding boost for projects across Central and West Africa.",
    author: "Development Finance Today",
    date: "April 15, 2025",
    category: "Financing",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Nigeria Launches New Mini-Grid Regulation Framework",
    excerpt:
      "Comprehensive regulatory update aims to accelerate rural electrification through decentralized energy solutions.",
    author: "Policy Watch Africa",
    date: "April 14, 2025",
    category: "Policy & Regulation",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Senegal Signs 200 MW Wind Power Agreement with International Consortium",
    excerpt: "Strategic partnership to develop large-scale wind energy project in northern Senegal region.",
    author: "West Africa Energy",
    date: "April 13, 2025",
    category: "Deals & Partnerships",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const reports = [
  {
    id: 1,
    title: "The 10 Principal Developers Active in East Africa",
    type: "Infographic",
    author: "Akili Research Studio",
    date: "April 5, 2025",
    description: "A quick visualization of the most active asset developers by volume, country, and technology.",
    category: "Market Analysis",
    image: "/placeholder.svg?height=200&width=300",
    fileSize: "1.2 MB",
  },
  {
    id: 2,
    title: "Deep Dive: The Slowdown of Commercial PPA Financing in Ghana",
    type: "Analysis",
    author: "Aïcha Diarra, Analyst",
    date: "March 28, 2025",
    description:
      "Comprehensive analysis of the factors contributing to the decline in commercial PPA financing in Ghana's energy sector.",
    category: "Country Focus",
    image: "/placeholder.svg?height=200&width=300",
    fileSize: "3.4 MB",
  },
  {
    id: 3,
    title: "Policy Brief: New Mini-Grid Regulation in Nigeria",
    type: "Policy Brief",
    author: "Centre de Veille Réglementaire Akili",
    date: "March 21, 2025",
    description:
      "This memo synthesizes the latest regulatory developments and their implications for investors and developers.",
    category: "Policy & Regulation",
    image: "/placeholder.svg?height=200&width=300",
    fileSize: "0.8 MB",
  },
]

const featuredReport = {
  title: "Leading Women in Africa's Agricultural Ecosystem",
  description:
    "Leading Women in Africa's Agricultural Ecosystem is the second in a series of reports utilizing the AgTech platform powered by Briter Intelligence showcasing the inspiring AgTech landscape in Africa. This report highlights the significant contributions to the sector, women in agriculture, rural development, economic growth and community resilience.",
  author: "Briter Bridges",
  date: "February 7th, 2025",
  image: "/placeholder.svg?height=400&width=600",
  fileSize: "2.4 MB",
  pages: 45,
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">📰 Insights that Power Your Energy Decisions</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Follow the latest news, market analysis, and sector reports on renewable energy and energy infrastructure in
            Africa and beyond. Akili Green connects you to the most relevant intelligence to anticipate, decide and
            invest with confidence.
          </p>
        </div>

        {/* Research Center CTA */}
        <Card className="mb-12 bg-gradient-to-r from-akili-blue to-akili-green text-white border-0">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">✅ Explore the Research Center</h2>
              <p className="text-blue-100">
                A complete library of reports, infographics, strategic presentations, and more.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/platform">Access Research Center →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NEWS SECTION - Now First */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">📈 Latest News</h2>
            <Button variant="outline" asChild>
              <Link href="/news/all">View All News</Link>
            </Button>
          </div>

          {/* Breaking News Banner */}
          <Card className="mb-8 border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-500 text-white animate-pulse">BREAKING</Badge>
                <p className="font-medium text-red-900">
                  Major $500M renewable energy fund announced for Sub-Saharan Africa development
                </p>
                <Button variant="ghost" size="sm" className="text-red-700 hover:text-red-900">
                  Read More →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-white text-gray-900 text-xs">{article.category}</Badge>
                  {article.urgent && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs animate-pulse">URGENT</Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm leading-tight line-clamp-3 group-hover:text-akili-blue transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3 line-clamp-2 text-xs">{article.excerpt}</CardDescription>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="h-6 px-2 text-xs">
                      <Link href={`/news/${article.id}`}>Read</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FEATURED RESEARCH SECTION - Now Second */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🔬 Featured Research</h2>

          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 space-y-6">
                  <div>
                    <Badge className="mb-4 bg-akili-green text-white">Featured Report</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredReport.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{featuredReport.description}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredReport.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredReport.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{featuredReport.pages} pages</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button asChild className="bg-akili-blue hover:bg-akili-blue/90">
                      <Link href="/news/1">
                        Read Full Report <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src={featuredReport.image || "/placeholder.svg"}
                    alt={featuredReport.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
            <CardDescription>Find specific research and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search reports..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="market">Market Analysis</SelectItem>
                  <SelectItem value="policy">Policy & Regulation</SelectItem>
                  <SelectItem value="investment">Investment Trends</SelectItem>
                  <SelectItem value="technology">Technology Focus</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="infographic">Infographics</SelectItem>
                  <SelectItem value="brief">Policy Briefs</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Image
                  src={report.image || "/placeholder.svg"}
                  alt={report.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-white text-gray-900">{report.type}</Badge>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="text-xs bg-akili-green text-white">
                    {report.fileSize}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {report.category}
                  </Badge>
                  <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{report.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center space-x-1 mb-1">
                      <User className="w-3 h-3" />
                      <span>{report.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{report.date}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-akili-green text-akili-green hover:bg-akili-green hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gray-900 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">📫 Stay Informed</h2>
            <p className="text-gray-300 mb-6">
              Receive our monthly newsletter: insights, exclusive reports, event invitations.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <Input placeholder="Enter your email" className="bg-white text-gray-900" />
              <Button variant="secondary">Subscribe Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
