"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Download, FileText } from "lucide-react"
import Link from "next/link"

interface ResearchReport {
  id: string
  title: string
  description: string
  category: string
  type: "report" | "brief" | "analysis"
  status: "published" | "draft" | "review"
  publishDate: string
  author: string
  fileSize: string
  downloadCount: number
  tags: string[]
}

const mockReports: ResearchReport[] = [
  {
    id: "1",
    title: "Q1 2025 African Energy Investment Report",
    description: "Comprehensive analysis of energy investments across Africa in the first quarter of 2025",
    category: "Market Analysis",
    type: "report",
    status: "published",
    publishDate: "2025-03-15",
    author: "Dr. Sarah Johnson",
    fileSize: "2.4 MB",
    downloadCount: 1247,
    tags: ["investment", "quarterly", "africa"],
  },
  {
    id: "2",
    title: "New Mini-Grid Regulation in Nigeria",
    description: "Policy brief on the latest regulatory framework for mini-grid development in Nigeria",
    category: "Policy & Regulation",
    type: "brief",
    status: "published",
    publishDate: "2025-03-21",
    author: "Michael Chen",
    fileSize: "1.8 MB",
    downloadCount: 892,
    tags: ["nigeria", "mini-grid", "regulation"],
  },
]

export default function ResearchAdmin() {
  const [reports, setReports] = useState<ResearchReport[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setReports(reports.filter((report) => report.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "review":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return "📊"
      case "brief":
        return "📋"
      case "analysis":
        return "📈"
      default:
        return "📄"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Reports</h1>
          <p className="text-gray-600 mt-2">Manage research publications and policy briefs</p>
        </div>
        <Button asChild>
          <Link href="/admin/research/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Report
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <Input
          placeholder="Search reports by title, category, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-akili-blue/10 to-akili-green/10 rounded-lg flex items-center justify-center border">
                    <FileText className="w-8 h-8 text-akili-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{report.title}</h3>
                      <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                      <span className="text-lg">{getTypeIcon(report.type)}</span>
                    </div>

                    <p className="text-gray-600 mb-3">{report.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {report.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>📂 {report.category}</span>
                      <span>✍️ {report.author}</span>
                      <span>📅 {new Date(report.publishDate).toLocaleDateString()}</span>
                      <span>📁 {report.fileSize}</span>
                      <span>⬇️ {report.downloadCount} downloads</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/research/${report.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(report.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No research reports found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
