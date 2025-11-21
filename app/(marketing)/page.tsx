import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Zap,
  Target,
  DollarSign,
  Facebook,
  Twitter,
  Linkedin,
  Calendar,
  Leaf,
  Download,
  Bell,
  FileText,
  Maximize,
  MoreVertical,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";
import { AkiliLogo } from "@/components/akili-logo";
import DemoInteractiveMap from "@/components/demo-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Hero from "@/components/hero";
import HomeCarousel from "@/components/home-carousel";
import { getDictionary } from "@/lib/get-dictionary";
import { getContent } from "../actions/content";
import { cache } from "react";
import Image from "next/image";

const recentDeals = [
  {
    deal: "Abydos Solar Plant",
    sector: "Solar",
    country: "Egypt",
    type: "Project",
    value: 500,
    date: "14/12/2024",
    company: "AMEA Power",
    amount: "$500M",
    status: "Project",
  },
  {
    deal: "REPP 2",
    sector: "Multi-country",
    country: "Multi-country",
    type: "Financing",
    value: 105,
    date: "09/12/2024",
  },
  {
    deal: "Doornhoek Solar Power",
    sector: "Solar",
    country: "South Africa",
    type: "Project",
    value: 120,
    date: "01/05/2026",
  },
  {
    deal: "Mmadinare Solar Complex",
    sector: "Solar",
    country: "Botswana",
    type: "Project",
    value: 58,
    date: "02/12/2026",
  },
  {
    deal: "Forfana Solar PV Park",
    sector: "Solar",
    country: "Tunisia",
    type: "Project",
    value: 7.89,
    date: "09/02/2025",
  },
];

const getNewsResearch = cache(getContent);

export default async function LandingPage() {
  const dict = await getDictionary();

  const {
    content: [article, ...articles],
  } = await getNewsResearch({
    type: "news",
    limit: 3,
  });
  const {
    content: [report, ...reports],
  } = await getNewsResearch({
    type: "research",
    limit: 3,
  });

  const recent = [...reports, ...articles]
    .toSorted(
      (a, b) =>
        (b.publicationDate?.getTime() ?? 0) -
        (a.publicationDate?.getTime() ?? 0)
    )
    .slice(0, 2);

  const recentContent = [...recent, article, report]
    .toSorted(
      (a, b) =>
        (b.publicationDate?.getTime() ?? 0) -
        (a.publicationDate?.getTime() ?? 0)
    )
    .filter((x) => Boolean(x) && Object.keys(x).length !== 0)
    .slice(0, 3);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <Hero />

      {/* User Types Section - Enhanced Carousel */}
      <section className="py-20 bg-gradient-soft dark:bg-gradient-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              {dict.home.carousel.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {dict.home.carousel.subtitle}
            </p>
          </div>

          <HomeCarousel />
        </div>
      </section>

      {/* The Akili Platform Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-akili-blue dark:text-gray-900">
              {dict.home.platform.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-500 max-w-3xl mx-auto px-4">
              {dict.home.platform.subtitle}
            </p>
          </div>

          <Tabs defaultValue="deal-tracking" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 sm:mb-10 lg:mb-12 bg-gray-100 dark:text-gray-500 rounded-lg p-1 gap-1 sm:gap-0">
              <TabsTrigger
                value="deal-tracking"
                className="data-[state=active]:bg-white data-[state=active]:text-akili-blue data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm py-2"
              >
                {dict.home.platform.tabs.deal_tracking}
              </TabsTrigger>
              <TabsTrigger
                value="data-visualization"
                className="data-[state=active]:bg-white data-[state=active]:text-akili-blue data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm py-2"
              >
                {dict.home.platform.tabs.data_visualization}
              </TabsTrigger>
              <TabsTrigger
                value="financial-modeling"
                className="data-[state=active]:bg-white data-[state=active]:text-akili-blue data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm py-2"
              >
                {dict.home.platform.tabs.financial_modeling}
              </TabsTrigger>
              <TabsTrigger
                value="market-research"
                className="data-[state=active]:bg-white data-[state=active]:text-akili-blue data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm py-2"
              >
                {dict.home.platform.tabs.market_research}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deal-tracking">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Section: Comprehensive Deal Intelligence */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-akili-blue dark:text-gray-900">
                      {dict.home.platform.deal_tracking.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-500 leading-relaxed">
                      {dict.home.platform.deal_tracking.description}
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-akili-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                          {
                            dict.home.platform.deal_tracking.features.database
                              .title
                          }
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-500">
                          {
                            dict.home.platform.deal_tracking.features.database
                              .description
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-akili-orange rounded-lg flex items-center justify-center flex-shrink-0">
                        <Search className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                          {
                            dict.home.platform.deal_tracking.features.filtering
                              .title
                          }
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-500">
                          {
                            dict.home.platform.deal_tracking.features.filtering
                              .description
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-akili-blue rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                          {
                            dict.home.platform.deal_tracking.features.alerts
                              .title
                          }
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-500">
                          {
                            dict.home.platform.deal_tracking.features.alerts
                              .description
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="bg-akili-blue hover:bg-akili-blue/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 shadow-lg w-full sm:w-auto text-sm sm:text-base"
                    asChild
                  >
                    <Link href="/platform/deals">
                      {dict.home.platform.deal_tracking.cta}
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Right Section: Recent Energy Deals Table */}
                <Card className="bg-gray-50  dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {dict.home.platform.deal_tracking.table.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-900 h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-900 h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
                      >
                        <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-900 h-8 w-8 sm:h-10 sm:w-10"
                          >
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            {
                              dict.home.platform.deal_tracking.table.actions
                                .refresh
                            }
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {
                              dict.home.platform.deal_tracking.table.actions
                                .settings
                            }
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 dark:bg-gray-700">
                            <TableHead className="text-gray-700 dark:text-gray-300 text-xs">
                              {
                                dict.home.platform.deal_tracking.table.headers
                                  .deal
                              }
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300text-xs">
                              {
                                dict.home.platform.deal_tracking.table.headers
                                  .sector
                              }
                            </TableHead>
                            <TableHead className="text-gray-700   dark:text-gray-300 text-xs">
                              {
                                dict.home.platform.deal_tracking.table.headers
                                  .country
                              }
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 text-xs">
                              {
                                dict.home.platform.deal_tracking.table.headers
                                  .type
                              }
                            </TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300 text-xs">
                              {
                                dict.home.platform.deal_tracking.table.headers
                                  .value
                              }
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 text-xs">
                              {
                                dict.home.platform.deal_tracking.table.headers
                                  .date
                              }
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentDeals.map((deal, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <TableCell className="font-medium text-gray-900 dark:text-white text-sm">
                                {deal.deal}
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                {deal.sector}
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                {deal.country}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    deal.type === "Project"
                                      ? "bg-green-100 text-green-700"
                                      : deal.type === "Financing"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                  } text-xs`}
                                >
                                  {deal.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold text-gray-900 dark:text-white text-sm">
                                {deal.value}
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                {deal.date}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-3 p-4">
                      {recentDeals.map((deal, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 space-y-2 border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm flex-1">
                              {deal.deal}
                            </h4>
                            <Badge
                              className={`${
                                deal.type === "Project"
                                  ? "bg-green-100 text-green-700"
                                  : deal.type === "Financing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              } text-xs flex-shrink-0`}
                            >
                              {deal.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">
                                {
                                  dict.home.platform.deal_tracking.table
                                    .mobile_labels.sector
                                }
                              </span>
                              <span className="ml-1 text-gray-700">
                                {deal.sector}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {
                                  dict.home.platform.deal_tracking.table
                                    .mobile_labels.country
                                }
                              </span>
                              <span className="ml-1 text-gray-700">
                                {deal.country}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {
                                  dict.home.platform.deal_tracking.table
                                    .mobile_labels.value
                                }
                              </span>
                              <span className="ml-1 font-semibold text-gray-900">
                                £{deal.value}M
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {
                                  dict.home.platform.deal_tracking.table
                                    .mobile_labels.date
                                }
                              </span>
                              <span className="ml-1 text-gray-700">
                                {deal.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 text-right">
                      <Link
                        href="/platform/deals"
                        className="text-akili-blue dark:text-akili-green hover:underline inline-flex items-center text-sm"
                      >
                        {dict.home.platform.deal_tracking.table.view_all}
                        <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="data-visualization">
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {dict.home.platform.coming_soon.data_visualization}
              </div>
            </TabsContent>
            <TabsContent value="financial-modeling">
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {dict.home.platform.coming_soon.financial_modeling}
              </div>
            </TabsContent>
            <TabsContent value="market-research">
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {dict.home.platform.coming_soon.market_research}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Geographic Intelligence & Project Sectors Section */}
      <section className="py-20 bg-gradient-soft relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              {dict.home.geographic_intelligence.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {dict.home.geographic_intelligence.subtitle}
            </p>
          </div>

          {/* African Map with Regional Markers */}
          <DemoInteractiveMap />
        </div>
      </section>

      {/* Key Facts Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
              {dict.home.key_facts.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {dict.home.key_facts.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Profiles */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-blue/5 to-akili-green/5 border-akili-blue/20">
              <CardContent className="p-8">
                <Link href="/platform/companies" className="block">
                  <div className="w-16 h-16 bg-akili-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-blue/20 transition-colors duration-300">
                    <Building2 className="w-8 h-8 text-akili-blue" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-blue mb-2">
                    {dict.home.key_facts.cards.companies.count}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {dict.home.key_facts.cards.companies.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {dict.home.key_facts.cards.companies.description}
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Project Profiles */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-green/5 to-akili-orange/5 border-akili-green/20">
              <CardContent className="p-8">
                <Link href="/platform/projects" className="block">
                  <div className="w-16 h-16 bg-akili-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-green/20 transition-colors duration-300">
                    <Zap className="w-8 h-8 text-akili-green" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-green mb-2">
                    {dict.home.key_facts.cards.projects.count}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {dict.home.key_facts.cards.projects.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {dict.home.key_facts.cards.projects.description}
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Total Deals */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-orange/5 to-akili-blue/5 border-akili-orange/20">
              <CardContent className="p-8">
                <Link href="/platform/deals" className="block">
                  <div className="w-16 h-16 bg-akili-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-orange/20 transition-colors duration-300">
                    <BarChart3 className="w-8 h-8 text-akili-orange" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-orange mb-2">
                    {dict.home.key_facts.cards.deals.count}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {dict.home.key_facts.cards.deals.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {dict.home.key_facts.cards.deals.description}
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Project Finance 2025 */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-blue/5 to-akili-green/5 border-akili-blue/20">
              <CardContent className="p-8">
                <Link href="/platform/deals?type=financing" className="block">
                  <div className="w-16 h-16 bg-akili-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-blue/20 transition-colors duration-300">
                    <DollarSign className="w-8 h-8 text-akili-blue" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-blue mb-2">
                    {dict.home.key_facts.cards.financing.count}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {dict.home.key_facts.cards.financing.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {dict.home.key_facts.cards.financing.description}
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* M&A Deals 2025 */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-green/5 to-akili-orange/5 border-akili-green/20">
              <CardContent className="p-8">
                <Link href="/platform/deals?type=ma" className="block">
                  <div className="w-16 h-16 bg-akili-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-green/20 transition-colors duration-300">
                    <Target className="w-8 h-8 text-akili-green" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-green mb-2">
                    {dict.home.key_facts.cards.ma.count}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {dict.home.key_facts.cards.ma.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {dict.home.key_facts.cards.ma.description}
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Green Bond Deals 2025 */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-akili-orange/5 to-akili-blue/5 border-akili-orange/20">
              <CardContent className="p-8">
                <Link href="/platform/deals?type=green-bonds" className="block">
                  <div className="w-16 h-16 bg-akili-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-akili-orange/20 transition-colors duration-300">
                    <Leaf className="w-8 h-8 text-akili-orange" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-akili-orange mb-2">
                    {dict.home.key_facts.cards.green_bonds.count}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {dict.home.key_facts.cards.green_bonds.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {dict.home.key_facts.cards.green_bonds.description}
                  </p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Research Section */}
      {recentContent.filter((x) => Boolean(x) && Object.keys(x).length !== 0)
        .length > 0 && (
        <section className="py-20 bg-gradient-soft dark:bg-gradient-soft">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-akili-blue dark:text-akili-green">
                  {dict.home.news_research.title}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                  {dict.home.news_research.subtitle}
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="border-akili-blue text-akili-blue hover:bg-akili-blue hover:text-white dark:border-akili-green dark:text-akili-green dark:hover:bg-akili-green"
              >
                <Link href="/news-research">{dict.home.news_research.cta}</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentContent.map((newsResearch) => (
                <Card
                  key={newsResearch?.slug}
                  className="hover:shadow-lg transition-all duration-300 bg-card hover:scale-105"
                >
                  <div className="relative h-48">
                    <Image
                      src={newsResearch?.imageUrl || "/placeholder.svg"}
                      alt={`${newsResearch?.title}`}
                      fill
                      className="object-cover w-full h-48 bg-gradient-to-br from-akili-blue/10 to-akili-green/10 rounded-t-lg flex items-center justify-center"
                    />
                    <Badge className="absolute top-3 left-3 bg-akili-blue text-white">
                      {newsResearch?.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      {newsResearch?.type === "research" ? (
                        <Link
                          href={`/research/${newsResearch?.slug}`}
                          className="hover:underline hover:text-akili-blue"
                        >
                          {newsResearch?.title}
                        </Link>
                      ) : (
                        newsResearch?.title
                      )}
                    </CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {newsResearch?.publicationDate?.toLocaleDateString()}
                        </span>
                      </div>
                      {newsResearch?.researchReport?.reportUrl ? (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-akili-green text-akili-green hover:bg-akili-green hover:text-white"
                        >
                          <Link
                            href={newsResearch?.researchReport?.reportUrl ?? ""}
                            target="_blank"
                            download
                          >
                            <Download className="w-4 h-4 mr-1" />
                            {dict.home.news_research.download}
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/news/${newsResearch?.slug}`}>
                            {dict.home.news_research.read_more}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-akili">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-5xl font-bold">
              {dict.home.final_cta.title}
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              {dict.home.final_cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-akili-green hover:bg-akili-green/90 text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/platform">
                  {dict.home.final_cta.primary_cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-akili-blue border-2 border-white hover:bg-akili-blue hover:text-white font-semibold text-lg px-8 py-4 shadow-lg hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact">{dict.home.final_cta.secondary_cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-akili-blue text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AkiliLogo />
                <span className="text-xl font-bold">
                  <span className="text-white">Akili</span>
                  <span className="text-akili-green">Energy</span>
                </span>
              </div>
              <p className="text-gray-300">{dict.home.footer.description}</p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-300 hover:text-akili-green transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-akili-green transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-akili-green transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">
                {dict.home.footer.sections.platform.title}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="/platform"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.platform.links.dashboard}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/platform/deals"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.platform.links.deals}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/platform/projects"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.platform.links.projects}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/platform/companies"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.platform.links.companies}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">
                {dict.home.footer.sections.resources.title}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="/news-research"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.resources.links.research}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.resources.links.blog}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    {dict.home.footer.sections.resources.links.contact}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">
                {dict.home.footer.sections.contact.title}
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>contact@akilienergy.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-akili-blue/30 mt-8 pt-8 text-center text-gray-300">
            <p>{dict.home.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
