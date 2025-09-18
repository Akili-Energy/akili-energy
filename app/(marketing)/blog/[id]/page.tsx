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

// Mock data for the blog post with embedded content
const getBlogPost = (id: string) => {
  const posts = {
    "1": {
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
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">Mali</td>
                  <td class="px-4 py-3 text-right">180</td>
                  <td class="px-4 py-3 text-right">250</td>
                  <td class="px-4 py-3 text-right">$380</td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium">Burkina Faso</td>
                  <td class="px-4 py-3 text-right">120</td>
                  <td class="px-4 py-3 text-right">180</td>
                  <td class="px-4 py-3 text-right">$290</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3>Investment Trends Visualization</h3>
          <p>The chart below illustrates the investment flow in West African solar projects over the past five years:</p>
          
          <div class="bg-gray-50 p-6 rounded-lg my-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold">Annual Solar Investment in West Africa</h4>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <div class="w-3 h-3 bg-akili-blue rounded"></div>
                <span>Investment ($M)</span>
                <div class="w-3 h-3 bg-akili-green rounded ml-4"></div>
                <span>Capacity (MW)</span>
              </div>
            </div>
            <div class="relative h-64">
              <svg viewBox="0 0 400 200" class="w-full h-full">
                <!-- Investment bars -->
                <rect x="40" y="160" width="30" height="40" fill="#12B99A" opacity="0.8"/>
                <rect x="90" y="140" width="30" height="60" fill="#12B99A" opacity="0.8"/>
                <rect x="140" y="100" width="30" height="100" fill="#12B99A" opacity="0.8"/>
                <rect x="190" y="80" width="30" height="120" fill="#12B99A" opacity="0.8"/>
                <rect x="240" y="40" width="30" height="160" fill="#12B99A" opacity="0.8"/>
                
                <!-- Capacity line -->
                <polyline points="55,180 105,165 155,130 205,110 255,70" 
                         fill="none" stroke="#021455" strokeWidth="3"/>
                
                <!-- Data points -->
                <circle cx="55" cy="180" r="4" fill="#021455"/>
                <circle cx="105" cy="165" r="4" fill="#021455"/>
                <circle cx="155" cy="130" r="4" fill="#021455"/>
                <circle cx="205" cy="110" r="4" fill="#021455"/>
                <circle cx="255" cy="70" r="4" fill="#021455"/>
                
                <!-- X-axis labels -->
                <text x="55" y="195" textAnchor="middle" class="text-xs fill-gray-600">2020</text>
                <text x="105" y="195" textAnchor="middle" class="text-xs fill-gray-600">2021</text>
                <text x="155" y="195" textAnchor="middle" class="text-xs fill-gray-600">2022</text>
                <text x="205" y="195" textAnchor="middle" class="text-xs fill-gray-600">2023</text>
                <text x="255" y="195" textAnchor="middle" class="text-xs fill-gray-600">2024</text>
              </svg>
            </div>
          </div>
          
          <h2>Country-Specific Analysis</h2>
          
          <h3>Nigeria: Massive Potential</h3>
          <p>With the largest economy in Africa, Nigeria represents the biggest opportunity. Recent policy reforms and the establishment of the Rural Electrification Agency have accelerated project development.</p>
          
          <h3>Ghana: Leading the Charge</h3>
          <p>Ghana has emerged as a regional leader with over 400 MW of operational solar capacity. The country's Renewable Energy Act and competitive procurement processes have attracted significant international investment.</p>
          
          <h3>Senegal: Innovative Approaches</h3>
          <p>Senegal has pioneered innovative financing mechanisms, including the successful deployment of hybrid solar-storage systems in rural areas.</p>
          
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

  return posts[id as keyof typeof posts] || null
}

const relatedPosts = [
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

export default async function BlogPost(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = getBlogPost(params.id)

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">← Back to Blog</Link>
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
            <Link href="/blog" className="hover:text-akili-blue">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900">{post.category}</span>
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
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-akili-blue text-white">{post.category}</Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  {post.hasCharts && (
                    <Badge className="bg-akili-green text-white">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Charts
                    </Badge>
                  )}
                  {post.hasTables && (
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
                    <span>{post.publishedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes} likes</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback>
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{post.author.name}</div>
                      <div className="text-sm text-gray-500">{post.author.title}</div>
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

                {/* Enhanced Content Notice */}
                <div className="bg-gradient-to-r from-akili-blue/5 to-akili-green/5 border border-akili-blue/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-akili-blue" />
                    <span className="font-medium text-akili-blue">Enhanced Content:</span>
                    <span className="text-gray-600">This article includes interactive charts and data tables</span>
                  </div>
                </div>

                {/* Article Content with embedded tables and charts */}
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Tags */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
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
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                        <AvatarFallback>
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">About {post.author.name}</h3>
                        <p className="text-gray-600 mb-3">{post.author.bio}</p>
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
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
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
              {/* Content Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Article Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <BarChart3 className="w-4 h-4 text-akili-green" />
                      <span>Interactive Charts</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-akili-orange" />
                      <span>Data Tables</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-akili-blue" />
                      <span>Expert Analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={relatedPost.image || "/placeholder.svg"}
                    alt={relatedPost.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-white text-gray-900">{relatedPost.category}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg leading-tight line-clamp-2">{relatedPost.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2">{relatedPost.excerpt}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{relatedPost.author}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${relatedPost.id}`}>Read More</Link>
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
