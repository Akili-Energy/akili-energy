"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  publishDate: string
  status: "draft" | "published" | "archived"
  source: string
  externalUrl?: string
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "AMEA Power Commissions 500 MW Abydos Solar Plant",
    excerpt: "AMEA Power has successfully commissioned its 500 MW Abydos solar photovoltaic plant in Egypt.",
    content: "Full article content here...",
    author: "Energy News Team",
    category: "Project Updates",
    tags: ["solar", "egypt", "amea power"],
    publishDate: "2024-12-14",
    status: "published",
    source: "Energy News Africa",
  },
]

export default function NewsAdmin() {
  const [news, setNews] = useState<NewsArticle[]>(mockNews)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setNews(news.filter((article) => article.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Articles</h1>
          <p className="text-gray-600 mt-2">Manage news articles and industry updates</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search articles by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* News List */}
      <div className="grid gap-4">
        {filteredNews.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{article.title}</h3>
                    <Badge
                      variant={
                        article.status === "published"
                          ? "default"
                          : article.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {article.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{article.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>✍️ {article.author}</span>
                    <span>📂 {article.category}</span>
                    <span>📅 {new Date(article.publishDate).toLocaleDateString()}</span>
                    <span>📰 {article.source}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/news-research/${article.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/news/${article.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
