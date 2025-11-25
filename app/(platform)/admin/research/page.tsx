"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Download, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { getContent, deleteContent } from "@/app/actions/content";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have a debounce hook
import { toast } from "sonner";
import type { Content, ContentStatus } from "@/lib/types";
import Image from "next/image";
import { removeDuplicates } from "@/lib/utils";

export default function ResearchAdmin() {
  const [reports, setReports] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<Date | undefined>(undefined);

  const loaderRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to load reports, handling both initial/search loads and "load more"
  const loadReports = useCallback(
    async (isResearchearch = false) => {
      if (isLoading || (!hasMore && !isResearchearch)) return;
      setIsLoading(true);

      const currentCursor = isResearchearch ? undefined : cursor;

      try {
        // Get all statuses for the admin view by passing status: null
        const result = await getContent({
          type: "research",
          query: debouncedSearchTerm,
          cursor: currentCursor,
          status: null,
        });

        if (isResearchearch) {
          setReports(removeDuplicates(result.content, "slug"));
        } else {
          setReports((prev) => removeDuplicates([...prev, ...result.content], "slug"));
        }

        setHasMore(result.hasMore);
        if (result.content.length > 0) {
          setCursor(
            result.content[result.content.length - 1].publicationDate ??
              undefined
          );
        }
      } catch (error) {
        toast.error("Failed to fetch research reports.");
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearchTerm, cursor, hasMore, isLoading]
  );

  // Effect for debounced search: reset and fetch
  useEffect(() => {
    setReports([]);
    setCursor(undefined);
    setHasMore(true);
    loadReports(true);
  }, [debouncedSearchTerm]); // re-runs when debounced term changes

  // Effect for intersection observer (infinite scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
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
  }, [hasMore, isLoading, loadReports]);

  // Handler for deleting a report
  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    const result = await deleteContent(slug, "research");
    if (result.success) {
      toast.success(result.message);
      setReports(removeDuplicates(reports.filter((report) => report.slug !== slug), "slug"));
    } else {
      toast.error(result.message);
    }
  };

  const getStatusVariant = (status: ContentStatus) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Reports</h1>
          <p className="text-gray-600 mt-2">
            Manage research publications and policy briefs
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/research/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Report
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports by title or summary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md pl-10"
        />
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.slug}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Image
                    src={report.imageUrl || "/placeholder.svg"}
                    alt={report.title}
                    width={128}
                    height={160}
                    className="w-16 h-20 bg-gradient-to-br from-akili-blue/10 to-akili-green/10 rounded-lg flex items-center justify-center border object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold line-clamp-1">
                        {report.title}
                      </h3>
                      <Badge
                        variant={getStatusVariant((report as any).status)}
                        className="capitalize"
                      >
                        {(report as any).status}
                      </Badge>
                      {report.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                      {report.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {report.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="capitalize">📂 {report.category}</span>
                      <span>✍️ {report.author?.name}</span>
                      <span>
                        📅{" "}
                        {new Date(report.publicationDate!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={report.researchReport?.reportUrl ?? ""}
                      target="_blank"
                      download
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/research/${report.slug}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(report.slug)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 text-center">
        {isLoading && (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        )}
        {!hasMore && reports.length > 0 && (
          <p className="text-muted-foreground">You've reached the end.</p>
        )}
      </div>

      {!isLoading && reports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No research reports found.</p>
        </div>
      )}
    </div>
  );
}
