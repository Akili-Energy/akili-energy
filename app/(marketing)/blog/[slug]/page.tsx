import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getContentBySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";

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
import { cache } from "react";
import { formatDate } from "@/lib/utils";
import { Content } from "@/lib/types";

const getBlogPost = cache(getContentBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getBlogPost((await params).slug, "blog");
  return {
    title: `${post?.metaTitle ?? post?.metaTitle} | Akili Energy - Blog`,
    description: post?.metaDescription ?? post?.summary,
  };
}


export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getBlogPost((await params).slug, "blog");

  if (!post || !post.blogPost || !post.author) {
    notFound();
  }

  return (
    <>
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-akili-blue">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-akili-blue">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900 capitalize">
              {post.category.replace("-", " ")}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <Badge className="bg-akili-blue text-white capitalize">
                    {post.category.replace("-", " ")}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publicationDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {post.summary}
                </p>

                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={post.author.photoUrl || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {post.author.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {post.author.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.author.jobTitle}
                      </div>
                    </div>
                  </div>
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

                <div
                  className="prose prose-sm sm:prose-base 3xl:prose-lg max-w-none tiptap"
                  dangerouslySetInnerHTML={{ __html: post.blogPost.content }}
                />

                {post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
                )}
              </div>
            </article>

            <div className="flex justify-between items-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={post.author.photoUrl || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {post.author.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {post.author.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {post.author.jobTitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    {post.author.bio}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get the latest insights delivered to your inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md text-sm mb-3"
                  />
                  <Button className="w-full bg-akili-green hover:bg-akili-green/90">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {(post as any).related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Posts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(post as any).related.map((relatedPost: Content) => (
                <Card
                  key={relatedPost.slug}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={relatedPost.imageUrl || "/placeholder.svg"}
                      alt={relatedPost.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-gray-900 capitalize">
                      {relatedPost.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-2">
                      {relatedPost.summary}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{relatedPost.author.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${relatedPost.slug}`}>
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
