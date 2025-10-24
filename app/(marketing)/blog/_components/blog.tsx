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
import { BLOG_PAGE_SIZE } from "@/lib/constants";

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

interface BlogProps {
  initialPosts: Content[];
  query?: string;
  category?: ContentCategory;
  hasNext: boolean;
}

export default function Blog({
  initialPosts,
  query,
  category,
  hasNext,
}: BlogProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(hasNext);
  const [isPending, startTransition] = useTransition();

  const loadMorePosts = () => {
    startTransition(async () => {
      const { content: newPosts, hasMore: canLoad } = await getContent({
        type: "blog",
        query,
        category,
        cursor: posts[posts.length - 1]?.publicationDate ?? undefined,
        limit: BLOG_PAGE_SIZE,
      });

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(canLoad);
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {posts.map((post) => (
          <Card
            key={post.slug}
            className="hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="relative">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-3 left-3 bg-white text-gray-900 capitalize">
                {post.category.replace("-", " ")}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-akili-blue transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-3 text-base">
                {post.summary}
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.author?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.publicationDate)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-akili-blue hover:text-white"
                  >
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-akili-blue hover:text-white"
            onClick={loadMorePosts}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Posts"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
