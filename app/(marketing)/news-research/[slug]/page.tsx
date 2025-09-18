import { UnifiedHeader } from "@/components/unified-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for news articles
const getNewsArticle = (slug: string) => {
  const articles = {
    "solar-energy-west-africa-opportunities": {
      id: "1",
      title: "The Future of Solar Energy in West Africa: Opportunities and Challenges",
      excerpt:
        "Exploring the rapid growth of solar installations across West African markets and the key factors driving this transformation.",
      content: `
        <div class="prose prose-lg max-w-none">
          <p class="lead">West Africa is experiencing an unprecedented solar energy boom, with installed capacity growing by over 300% in the past five years. This transformation is reshaping the region's energy landscape and creating new opportunities for investors, developers, and communities alike.</p>
          
          <h2>Market Dynamics and Growth Drivers</h2>
          <p>The solar energy sector in West Africa has been propelled by several key factors:</p>
          
          <div class="bg-blue-50 p-6 rounded-lg my-6">
            <h3 class="text-lg font-semibold mb-4">Key Market Statistics</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-2xl font-bold text-akili-blue">2.5 GW</div>
                <div class="text-sm text-gray-600">Total installed solar capacity</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-akili-green">$4.2B</div>
                <div class="text-sm text-gray-600">Investment pipeline</div>
              </div>
            </div>
          </div>
          
          <h3>Regional Solar Capacity Analysis</h3>
          <p>The following table shows the current solar capacity distribution across West African countries:</p>
          
          <div class="overflow-x-auto my-6">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead class="bg-akili-blue text-white">
                <tr>
                  <th class="px-4 py-3 text-left">Country</th>
                  <th class="px-4 py-3 text-right">Installed Capacity (MW)</th>
                  <th class="px-4 py-3 text-right">Projects in Pipeline (MW)</th>
                  <th class="px-4 py-3 text-right">Investment ($M)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">Nigeria</td>
                  <td class="px-4 py-3 text-right">850</td>
                  <td class="px-4 py-3 text-right">1,200</td>
                  <td class="px-4 py-3 text-right">$1,800</td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">Ghana</td>
                  <td class="px-4 py-3 text-right">420</td>
                  <td class="px-4 py-3 text-right">600</td>
                  <td class="px-4 py-3 text-right">$950</td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">Senegal</td>
                  <td class="px-4 py-3 text-right">280</td>
                  <td class="px-4 py-3 text-right">400</td>
                  <td class="px-4 py-3 text-right">$620</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h2>Future Outlook</h2>
          <p>Looking ahead, we expect continued strong growth in the West African solar market, driven by:</p>
          
          <ul>
            <li>Increasing energy demand from economic growth</li>
            <li>Continued technology cost reductions</li>
            <li>Growing awareness of climate change impacts</li>
            <li>Improved access to international financing</li>
          </ul>
          
          <div class="bg-akili-green/10 p-6 rounded-lg my-6">
            <h3 class="text-lg font-semibold mb-2">Key Takeaway</h3>
            <p class="mb-0">West Africa's solar energy sector is at an inflection point. While challenges remain, the combination of supportive policies, declining costs, and growing demand creates a compelling investment opportunity for those willing to navigate the complexities of emerging markets.</p>
          </div>
        </div>
      `,
      author: {
        name: "Sarah Okonkwo",
        title: "Senior Energy Analyst",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "Sarah is a senior energy analyst with over 8 years of experience covering African energy markets. She holds an MSc in Energy Economics from the University of Oxford.",
      },
      publishedDate: "April 15, 2025",
      readTime: "8 min read",
      category: "Solar Energy",
      tags: ["West Africa", "Solar", "Investment", "Policy", "Market Analysis"],
      image: "/placeholder.svg?height=400&width=800",
      likes: 42,
      shares: 18,
      isBookmarked: false,
      hasCharts: true,
      hasTables: true,
    },
  }

  return articles[slug as keyof typeof articles] || null
}

const relatedArticles = [
  {
    id: "2",
    title: "Hydropower Renaissance: Large-Scale Projects Across Central Africa",
    excerpt: "Analyzing the resurgence of hydropower development and its impact on regional energy security.",
    author: "Dr. Amina Hassan",
    date: "April 10, 2025",
    readTime: "10 min read",
    category: "Hydropower",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Green Bonds and Climate Finance: Unlocking Capital for African Energy",
    excerpt: "How innovative financing mechanisms are accelerating renewable energy deployment.",
    author: "Robert Kimani",
    date: "April 8, 2025",
    readTime: "6 min read",
    category: "Finance",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default async function NewsArticle(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = getNewsArticle(params.slug)

  if (!article) {
    return (
      <div className="min-h-screen  bg-gradient-soft-reverse dark:bg-gradient-soft-reverse">
        <UnifiedHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/news-research">← Back to News & Research</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

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
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-akili-blue text-white">{article.category}</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  {article.hasCharts && (
                    <Badge className="bg-akili-green text-white">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Charts
                    </Badge>
                  )}
                  {article.hasTables && (
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
                    <span>{article.publishedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{article.likes} likes</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                      <AvatarFallback>
                        {article.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{article.author.name}</div>
                      <div className="text-sm text-gray-500">{article.author.title}</div>
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
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* Tags */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Author Bio */}
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                        <AvatarFallback>
                          {article.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">About {article.author.name}</h3>
                        <p className="text-gray-600 mb-3">{article.author.bio}</p>
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
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>Get the latest insights delivered to your inbox</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button className="w-full bg-akili-green hover:bg-akili-green/90">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Platform CTA */}
              <Card className="bg-gradient-to-br from-akili-blue to-akili-green text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Explore Our Platform</h3>
                  <p className="text-sm text-blue-100 mb-4">Access comprehensive energy market data and analytics</p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/platform">Explore Platform</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={relatedArticle.image || "/placeholder.svg"}
                    alt={relatedArticle.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-white text-gray-900">{relatedArticle.category}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg leading-tight line-clamp-2">{relatedArticle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2">{relatedArticle.excerpt}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{relatedArticle.author}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/news-research/${relatedArticle.id}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
