"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Loader2, Download } from "lucide-react";
import { getContent } from "@/app/actions/content";
import type { Content, ContentCategory } from "@/lib/types";
import { RESEARCH_PAGE_SIZE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface ResearchProps {
  initialReports: Content[];
  query?: string;
  category?: ContentCategory;
  hasNext: boolean;
}

export default function Research({
  initialReports,
  query,
  category,
  hasNext,
}: ResearchProps) {
  const [reports, setReports] = useState(initialReports);
  const [hasMore, setHasMore] = useState(hasNext);
  const [isPending, startTransition] = useTransition();

  const loaderRef = useRef<HTMLDivElement>(null);

  const loadReports = () => {
    startTransition(async () => {
      const { content: newReports, hasMore: canLoad } = await getContent({
        type: "research",
        query,
        category,
        cursor: reports[reports.length - 1]?.publicationDate ?? undefined,
        limit: RESEARCH_PAGE_SIZE,
      });

      setReports((prevReports) => [...prevReports, ...newReports]);
      setHasMore(canLoad);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          loadReports();
        }
      },
      { threshold: 1.0 }
    );

    const loaderElement = loaderRef.current;
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [hasMore, isPending, loadReports]);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {reports.map((report) => (
          <Card
            key={report.slug}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative">
              {/* <Image */}
              <img
                src={report.imageUrl || "/placeholder.svg"}
                alt={report.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                {report.category}
              </Badge>
              <div className="absolute top-3 right-3">
                <Badge
                  variant="secondary"
                  className="text-xs bg-akili-green text-white"
                >
                  {/* {report.fileSize} */}
                  MB
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {report.category}
                </Badge>
                <CardTitle className="text-lg leading-tight">
                  <Link href={`/research/${report?.slug}`}>
                    {report.title}
                  </Link>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {report.summary}
              </CardDescription>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center space-x-1 mb-1">
                    <User className="w-3 h-3" />
                    <span>{report.author?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(report.publicationDate)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-akili-green text-akili-green hover:bg-akili-green hover:text-white"
                  asChild
                >
                  <Link
                    href={report.researchReport?.reportUrl ?? ""}
                    target="_blank"
                    download
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 text-center">
        {isPending && (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        )}
        {!hasMore && reports.length > 0 && (
          <p className="text-muted-foreground">You've reached the end.</p>
        )}
      </div>

      {!isPending && reports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts found.</p>
        </div>
      )}
    </>
  );
}
