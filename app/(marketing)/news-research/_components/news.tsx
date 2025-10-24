"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/app/actions/content";
import { Content, ContentCategory } from "@/lib/types";
import { NEWS_PAGE_SIZE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface NewsProps {
  initialArticles: Content[];
  hasNext: boolean;
}

export default function News({
  initialArticles,
  hasNext,
}: NewsProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(hasNext);
  const [isPending, startTransition] = useTransition();

  const viewMoreArticles = () => {
    startTransition(async () => {
      const { content: newArticles, hasMore: canLoad } = await getContent({
        type: "news",
        cursor: articles[articles.length - 1]?.publicationDate ?? undefined,
        limit: NEWS_PAGE_SIZE,
      });

      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setHasMore(canLoad);
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Card
            key={article.slug}
            className="hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="relative">
              {/* <Image */}
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-3 left-3 bg-white text-gray-900 text-xs">
                {article.category}
              </Badge>
              {article.featured && (
                <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs animate-pulse">
                  URGENT
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm leading-tight line-clamp-3 group-hover:text-akili-blue transition-colors">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3 line-clamp-2 text-xs">
                {article.summary}
              </CardDescription>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publicationDate)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-6 px-2 text-xs"
                >
                  <Link href={`/news/${article.slug}`}>Read</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {hasMore && (
          <div className="text-center col-span-4">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-akili-blue hover:text-white"
              onClick={viewMoreArticles}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "View More Articles"
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
