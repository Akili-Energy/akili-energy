import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Download,
  FileText,
  ArrowLeft,
  User,
} from "lucide-react";
import { cache } from "react";
import { getContentBySlug } from "@/app/actions/content";
import { cacheLife } from "next/cache";
import { formatDate } from "@/lib/utils";

const getResearchReport = cache(getContentBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const report = await getResearchReport((await params).slug, "research");

  if (!report) {
    return {
      title: "Research Report Not Found | Akili Energy",
      description:
        "The research report you are looking for could not be found.",
    };
  }

  return {
    title: `${report?.metaTitle ?? report?.title} | Akili Energy - Research`,
    description: report?.metaDescription ?? report?.summary,
  };
}

export default async function ResearchReportPage({ params }: { params: Promise<{ slug: string }> }) {
  "use cache";
  // This cache will revalidate after an hour even if no explicit
  // revalidate instruction was received
  cacheLife("hours");

  const report = await getResearchReport((await params).slug, "research");


  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-akili-blue hover:text-akili-green transition-colors"
            >
              Akili
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/research"
              className="text-akili-blue hover:text-akili-green transition-colors"
            >
              Research Centre
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400 truncate max-w-md">
              {report.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Publication Date and Category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {formatDate(report.publicationDate)}
                </div>
                <Badge
                  variant="outline"
                  className="border-akili-green text-akili-green"
                >
                  {report.category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {report.title}
              </h1>

              {/* Author */}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>By {report.author?.name}</span>
              </div>

              {/* Executive Summary */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Executive Summary
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {report.summary}
                  </p>
                </div>
              </div>

              {/* Key Insights Section */}
              <div className="bg-gradient-to-br from-akili-blue/5 to-akili-green/5 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-akili-blue dark:text-akili-green flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Key Research Insights
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Market Analysis
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Comprehensive analysis of current market trends and
                      opportunities in the African energy sector.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Strategic Recommendations
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Actionable insights for investors, developers, and
                      policymakers in the energy ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Download Full Report
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get access to the complete research report with detailed
                  analysis, data visualizations, and strategic recommendations.
                </p>
                <Button
                  size="lg"
                  className="bg-akili-green hover:bg-akili-green/90 text-white px-8 py-3"
                  asChild
                >
                  <Link
                    href={report.researchReport?.reportUrl ?? ""}
                    target="_blank"
                    download
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Report
                  </Link>
                </Button>
              </div>

              {/* Tags */}
              {report.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map(({id, name}) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="bg-akili-blue/10 text-akili-blue hover:bg-akili-blue/20 dark:bg-akili-green/10 dark:text-akili-green dark:hover:bg-akili-green/20"
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with Report Cover */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={report.imageUrl || "/placeholder.svg"}
                    alt={`${report.title} report cover`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-akili-green text-white mb-2">
                      <FileText className="w-3 h-3 mr-1" />
                      Research Report
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Published {formatDate(report.publicationDate)}
                      </p>
                    </div>

                    <Button
                      className="w-full bg-akili-green hover:bg-akili-green/90 text-white"
                      asChild
                    >
                      <Link href={report.researchReport?.reportUrl ?? ""}
                      target="_blank"
                      download>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Link>
                    </Button>

                    <div className="pt-4 border-t text-left space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Author:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {report.author?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Category:
                        </span>
                        <span className="font-medium text-akili-green">
                          {report.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
