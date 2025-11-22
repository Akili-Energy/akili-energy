import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  User,
  ArrowRight,
  Download,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ContentCategory } from "@/lib/types";
import { getContent } from "@/app/actions/content";
import { formatDate } from "@/lib/utils";
import { contentCategory } from "@/lib/db/schema";
import { NEWS_PAGE_SIZE, RESEARCH_PAGE_SIZE } from "@/lib/constants";
import { Metadata } from "next";
import News from "./_components/news";
import Research from "./_components/research";

export const metadata: Metadata = {
  title: "News & Research | Akili Energy",
  description:
    "Explore the Research Center. A complete library of reports, infographic, strategic presentations, and more.",
};

export default async function NewsResearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: ContentCategory }>;
}) {
  const { q: query = undefined, category: category = undefined } =
    (await searchParams) ?? {};

  const news = getContent({
    type: "news",
    limit: NEWS_PAGE_SIZE + 1,
  });
  const research = getContent({
    type: "research",
    query,
    category,
    limit: RESEARCH_PAGE_SIZE + 1,
  });
  const [
    { content: initialArticles, hasMore: hasMoreNews },
    { content: initialReports, hasMore: hasMoreResearch },
  ] = await Promise.all([news, research]);

  const featuredArticle = initialArticles.find((p) => p.featured);
  const otherArticles = initialArticles
    .filter((p) => p.slug !== featuredArticle?.slug)
    .slice(0, NEWS_PAGE_SIZE);
  const featuredReport = initialReports.find((p) => p.featured);
  const otherReports = initialReports
    .filter((p) => p.slug !== featuredReport?.slug)
    .slice(0, RESEARCH_PAGE_SIZE);

  return (
    <div className="bg-gradient-soft-reverse dark:bg-gradient-soft-reverse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            📰 Insights that Power Your Energy Decisions
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Follow the latest news, market analysis, and sector reports on
            renewable energy and energy infrastructure in Africa and beyond.
            Akili Energy connects you to the most relevant intelligence to
            anticipate, decide and invest with confidence.
          </p>
        </div>

        {/* NEWS SECTION - Now First */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">📈 Latest News</h2>
            {/* <Button variant="outline" asChild>
              <Link href="/news-research/news">View All News</Link>
            </Button> */}
          </div>

          {/* Breaking News Banner */}
          {featuredArticle && (
            <Card className="mb-8 border-l-4 border-l-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    BREAKING
                  </Badge>
                  <p className="font-medium text-red-900">
                    {featuredArticle?.title}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-red-700 hover:text-red-900"
                  >
                    <Link href={`/news/${featuredArticle?.slug}`}>
                      Read More →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Grid */}
          <News initialArticles={otherArticles} hasNext={hasMoreNews} />
        </section>

        {/* FEATURED RESEARCH SECTION - Now Second */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            🔬 Featured Research
          </h2>

          {featuredReport && (
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="p-8 space-y-6">
                    <div>
                      <Badge className="mb-4 bg-akili-green text-white">
                        Featured Report
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {featuredReport?.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {featuredReport?.summary}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredReport?.author?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(featuredReport?.publicationDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>N pages</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        asChild
                        className="bg-akili-blue hover:bg-akili-blue/90"
                      >
                        <Link href={`/research/${featuredReport?.slug}`}>
                          Read Full Report{" "}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    {/* <Image */}
                    <img
                      src={featuredReport?.imageUrl || "/placeholder.svg"}
                      alt={featuredReport?.title}
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
            <CardDescription>
              Find specific research and analysis
            </CardDescription>
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
                  {contentCategory.enumValues.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="infographic">Infographic</SelectItem>
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
        <Research
          initialReports={otherReports}
          query={query}
          category={category}
          hasNext={hasMoreResearch}
        />

        {/* Newsletter Signup */}
        <Card className="bg-gray-900 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">📫 Stay Informed</h2>
            <p className="text-gray-300 mb-6">
              Receive our monthly newsletter: insights, exclusive reports, event
              invitations.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <Input
                placeholder="Enter your email"
                className="bg-white text-gray-900"
              />
              <Button variant="secondary">Subscribe Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
