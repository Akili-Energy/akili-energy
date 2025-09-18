import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight, Clock, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UnifiedHeader } from "@/components/unified-header"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Solar Energy in West Africa: Opportunities and Challenges",
    excerpt:
      "Exploring the rapid growth of solar installations across West African markets and the key factors driving this transformation.",
    author: "Sarah Okonkwo",
    date: "April 15, 2025",
    readTime: "8 min read",
    category: "Solar Energy",
    image: "/placeholder.svg?height=300&width=400",
    featured: true,
    hasCharts: true,
    hasTables: true,
  },
  {
    id: 2,
    title: "Interview: Leading the Energy Transition in Kenya",
    excerpt:
      "A conversation with Dr. James Mwangi about Kenya's ambitious renewable energy goals and the role of private sector investment.",
    author: "Michael Tetougueni",
    date: "April 12, 2025",
    readTime: "12 min read",
    category: "Interviews",
    image: "/placeholder.svg?height=300&width=400",
    hasCharts: false,
    hasTables: true,
  },
  {
    id: 3,
    title: "Hydropower Renaissance: Large-Scale Projects Across Central Africa",
    excerpt:
      "Analyzing the resurgence of hydropower development and its impact on regional energy security and economic growth.",
    author: "Dr. Amina Hassan",
    date: "April 10, 2025",
    readTime: "10 min read",
    category: "Hydropower",
    image: "/placeholder.svg?height=300&width=400",
    hasCharts: true,
    hasTables: false,
  },
  {
    id: 4,
    title: "Green Bonds and Climate Finance: Unlocking Capital for African Energy",
    excerpt: "How innovative financing mechanisms are accelerating renewable energy deployment across the continent.",
    author: "Robert Kimani",
    date: "April 8, 2025",
    readTime: "6 min read",
    category: "Finance",
    image: "/placeholder.svg?height=300&width=400",
    hasCharts: true,
    hasTables: true,
  },
  {
    id: 5,
    title: "Mini-Grids Revolution: Bringing Power to Rural Communities",
    excerpt:
      "The transformative impact of decentralized energy solutions in addressing Africa's energy access challenges.",
    author: "Grace Mbeki",
    date: "April 5, 2025",
    readTime: "9 min read",
    category: "Energy Access",
    image: "/placeholder.svg?height=300&width=400",
    hasCharts: false,
    hasTables: true,
  },
  {
    id: 6,
    title: "Policy Spotlight: Nigeria's New Renewable Energy Incentives",
    excerpt:
      "Breaking down the latest policy changes and their implications for investors and developers in Nigeria's energy sector.",
    author: "Akili Policy Team",
    date: "April 3, 2025",
    readTime: "7 min read",
    category: "Policy",
    image: "/placeholder.svg?height=300&width=400",
    hasCharts: true,
    hasTables: false,
  },
]

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen  bg-gradient-soft-reverse dark:bg-gradient-soft-reverse">
      <UnifiedHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Akili Green Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, analysis, and perspectives on Africa's energy transformation. Stay informed with expert commentary
            and industry trends.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search blog posts..." className="pl-12 py-3" />
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-akili-blue text-white">Featured</Badge>
                <div className="absolute top-4 right-4 flex space-x-2">
                  {featuredPost.hasCharts && (
                    <Badge variant="secondary" className="bg-akili-green text-white">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Charts
                    </Badge>
                  )}
                  {featuredPost.hasTables && (
                    <Badge variant="secondary" className="bg-akili-orange text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Data
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{featuredPost.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button asChild className="bg-akili-blue hover:bg-akili-blue/90">
                    <Link href={`/blog/${featuredPost.id}`}>
                      Read Full Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            All Posts
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            Solar Energy
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            Hydropower
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            Finance
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            Policy
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            Interviews
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-akili-blue hover:text-white transition-colors">
            Energy Access
          </Badge>
        </div>

        {/* Blog Posts Grid - Two Columns */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {regularPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-white text-gray-900">{post.category}</Badge>
                <div className="absolute top-3 right-3 flex space-x-1">
                  {post.hasCharts && (
                    <Badge variant="secondary" className="bg-akili-green text-white text-xs">
                      <BarChart3 className="w-3 h-3" />
                    </Badge>
                  )}
                  {post.hasTables && (
                    <Badge variant="secondary" className="bg-akili-orange text-white text-xs">
                      <TrendingUp className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-akili-blue transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 line-clamp-3 text-base">{post.excerpt}</CardDescription>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-akili-blue hover:text-white">
                      <Link href={`/blog/${post.id}`}>Read More</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="hover:bg-akili-blue hover:text-white">
            Load More Posts
          </Button>
        </div>

        {/* Rich Content Features Info */}
        <Card className="mt-12 bg-gradient-to-r from-akili-blue/5 to-akili-green/5 border-akili-blue/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-akili-blue">Enhanced Content Experience</h3>
              <p className="text-gray-600">
                Our blog posts now feature embedded charts, data tables, and interactive visualizations to provide
                deeper insights into Africa's energy sector.
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-akili-green" />
                  <span>Interactive Charts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-akili-orange" />
                  <span>Data Tables</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
