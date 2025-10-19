import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/app/actions/content";
import { contentCategory } from "@/lib/db/schema";
import Blog from "./_components/blog"; // Import the new client component
import { ContentCategory } from "@/lib/types";
import { BLOG_PAGE_SIZE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Akili Energy Blog",
  description: "Insights, analysis, and perspectives on Africa's energy transformation.",
};

// Set a constant for how many posts to load per page
export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: ContentCategory }>;
}) {
  const { q: query = undefined, category: category = undefined } =
    (await searchParams) ?? {};

  // Fetch initial posts: one extra to identify the featured post
  const { content: initialPostsData, hasMore } = await getContent({
    type: "blog",
    query,
    category,
    limit: BLOG_PAGE_SIZE + 1,
  });

  const featuredPost =
    initialPostsData.find((p) => p.featured) || initialPostsData[0];
  const regularPosts = initialPostsData
    .filter((p) => p.slug !== featuredPost?.slug)
    .slice(0, BLOG_PAGE_SIZE);

  return (
    <div className="bg-gradient-soft-reverse dark:bg-gradient-soft-reverse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Akili Energy Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, analysis, and perspectives on Africa's energy
            transformation.
          </p>
        </div>

        <form className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              name="q"
              placeholder="Search blog posts..."
              className="pl-12 py-3"
              defaultValue={query}
            />
          </div>
        </form>

        {featuredPost && (
          <Card className="mb-12 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <Image
                  src={featuredPost.imageUrl || "/placeholder.svg"}
                  alt={featuredPost.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-akili-blue text-white">
                  Featured
                </Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <Badge variant="secondary" className="capitalize">
                    {featuredPost.category.replace("-", " ")}
                  </Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {featuredPost.summary}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredPost.publicationDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="bg-akili-blue hover:bg-akili-blue/90"
                  >
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Full Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/blog">
            <Badge
              variant={!category ? "default" : "outline"}
              className="cursor-pointer"
            >
              All Posts
            </Badge>
          </Link>
          {contentCategory.enumValues.map((cat) => (
            <Link href={`/blog?category=${cat}`} key={cat}>
              <Badge
                variant={category === cat ? "default" : "outline"}
                className="cursor-pointer capitalize"
              >
                {cat.replace("-", " ")}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Use the Client Component to render the list and handle "Load More" */}
        <Blog
          initialPosts={regularPosts}
          query={query}
          category={category}
          hasNext={hasMore}
        />
      </div>
    </div>
  );
}
