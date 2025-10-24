import { cache } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  Heart,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/mathematics-node/mathematics-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";
import "katex/dist/katex.min.css";
import "@/components/tiptap-ui/table-dropdown-menu/table-dropdown-menu.scss";
import { getContentBySlug } from "@/app/actions/content";
import { Content } from "@/lib/types";

const getNewsArticle = cache(getContentBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await getNewsArticle((await params).slug, "news");
  return {
    title: `${article?.metaTitle ?? article?.title} | Akili Energy - News`,
    description: article?.metaDescription ?? article?.summary,
  };
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await getNewsArticle((await params).slug, "news");

  const relatedArticles: Content[] = (article as any).related;

  if (!article) {
    return (
      <div className="bg-gradient-soft-reverse dark:bg-gradient-soft-reverse">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/news-research">← Back to News & Research</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-akili-blue">
              Home
            </Link>
            <span>/</span>
            <Link href="/news-research" className="hover:text-akili-blue">
              News & Research
            </Link>
            <span>/</span>
            <span className="text-gray-900">{article.category}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="relative">
                <img
                // <Image
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-akili-blue text-white">
                    {article.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  {article.newsArticle?.content?.includes("<table>") && (
                    <Badge className="bg-akili-orange text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Data
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-8">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.publicationDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  {/* <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{article.likes} likes</span>
                  </div> */}
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {article.summary}
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={article.author.photoUrl || "/placeholder.svg"}
                        alt={article.author?.name}
                      />
                      <AvatarFallback>
                        {article.author?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {article.author?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {article.author.jobTitle}
                      </div>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: article.newsArticle?.content ?? "",
                  }}
                />

                {/* Tags */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Author Bio */}
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={article.author.photoUrl || "/placeholder.svg"}
                          alt={article.author?.name}
                        />
                        <AvatarFallback>
                          {article.author?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          About {article.author?.name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {article.author.bio}
                        </p>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </article>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/news-research">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to News & Research
                </Link>
              </Button>
              <div className="flex space-x-2">
                {relatedArticles.length > 0 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/news/${relatedArticles[0].slug}`}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Link>
                  </Button>
                )}
                {relatedArticles.length > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/news/${relatedArticles[1].slug}`}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>
                    Get the latest insights delivered to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button className="w-full bg-akili-green hover:bg-akili-green/90">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Platform CTA */}
              <Card className="bg-gradient-to-br from-akili-blue to-akili-green">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                  <h3 className="font-semibold mb-2 text-blue-800">
                    Explore Our Platform
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Access comprehensive energy market data and analytics
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/platform">Explore Platform</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related: Content) => (
                <Card
                  key={related.slug}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                    // <Image
                      src={related.imageUrl || "/placeholder.svg"}
                      alt={related.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                      {related.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {related.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-2">
                      {related.summary}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{related.author?.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/news-research/${related.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
