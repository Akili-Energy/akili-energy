"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { getContent, deleteContent } from "@/app/actions/content";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have a debounce hook
import { toast } from "sonner";
import type { Content, ContentStatus } from "@/lib/types";
import Image from 'next/image'
import { removeDuplicates } from "@/lib/utils";


export default function NewsAdmin() {
  const [articles, setArticles] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<Date | undefined>(undefined);

  const loaderRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Function to load articles, handling both initial/search loads and "load more"
  const loadArticles = useCallback(
    async (isNewSearch = false) => {
      if (isLoading || (!hasMore && !isNewSearch)) return;
      setIsLoading(true);

      const currentCursor = isNewSearch ? undefined : cursor;

      try {
        // Get all statuses for the admin view by passing status: null
        const result = await getContent({
          type: "news",
          query: debouncedSearchTerm,
          cursor: currentCursor,
          status: null,
        });

        if (isNewSearch) {
          setArticles(removeDuplicates(result.content, "slug"));
        } else {
          setArticles((prev) => removeDuplicates([...prev, ...result.content], "slug"));
        }

        setHasMore(result.hasMore);
        if (result.content.length > 0) {
          setCursor(
            result.content[result.content.length - 1].publicationDate ??
              undefined
          );
        }
      } catch (error) {
        toast.error("Failed to fetch news articles.");
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearchTerm, cursor, hasMore, isLoading]
  );

  // Effect for debounced search: reset and fetch
  useEffect(() => {
    setArticles([]);
    setCursor(undefined);
    setHasMore(true);
    loadArticles(true);
  }, [debouncedSearchTerm]); // re-runs when debounced term changes

  // Effect for intersection observer (infinite scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadArticles();
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
  }, [hasMore, isLoading, loadArticles]);

  // Handler for deleting a article
  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    const result = await deleteContent(slug, "news");
    if (result.success) {
      toast.success(result.message);
      setArticles(
        removeDuplicates(articles.filter((article) => article.slug !== slug), "slug")
      );
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Articles</h1>
          <p className="text-gray-600 mt-2">
            Manage news articles and industry updates
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles by title or summary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md pl-10"
        />
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.slug}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 mr-4">
                  <Image
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    width={256}
                    height={160}
                    className="w-32 h-20 rounded-lg object-cover border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold line-clamp-1">
                        {article.title}
                      </h3>
                      <Badge
                        variant={getStatusVariant((article as any).status)}
                        className="capitalize"
                      >
                        {(article as any).status}
                      </Badge>
                      {article.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>✍️ {article.author?.name}</span>
                      <span className="capitalize">
                        📂 {article.category.replace("-", " ")}
                      </span>
                      <span>
                        📅{" "}
                        {new Date(
                          article.publicationDate!
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="icon" asChild disabled={(article as any).status !== "published"}>
                    <Link href={`/news/${article.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/news/${article.slug}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(article.slug)}
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
        {!hasMore && articles.length > 0 && (
          <p className="text-muted-foreground">You've reached the end.</p>
        )}
      </div>

      {!isLoading && articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles found.</p>
        </div>
      )}
    </div>
  );
}
