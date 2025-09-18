"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, XCircle, Download } from "lucide-react"
import { toast } from "sonner"

interface BulkUploadProps {
  type: "companies" | "deals" | "projects"
  onUploadComplete?: () => void
}

interface UploadResult {
  success: number
  failed: number
  errors: string[]
}

export default function BulkUpload({ type, onUploadComplete }: BulkUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/admin/${type}/bulk-upload`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result: UploadResult = await response.json()
        setUploadResult(result)

        if (result.success > 0) {
          toast.success(`Successfully uploaded ${result.success} ${type}`)
          onUploadComplete?.()
        }

        if (result.failed > 0) {
          toast.error(`Failed to upload ${result.failed} ${type}`)
        }
      } else {
        toast.error("Upload failed")
      }
    } catch (error) {
      toast.error("An error occurred during upload")
    } finally {
      setIsUploading(false)
      setUploadProgress(100)
    }
  }

  const downloadTemplate = () => {
    // Generate CSV template based on type
    let headers: string[] = []

    switch (type) {
      case "companies":
        headers = [
          "name",
          "description",
          "sector",
          "headquarters",
          "country",
          "website",
          "founded_year",
          "employee_count",
        ]
        break
      case "deals":
        headers = [
          "title",
          "deal_type",
          "deal_status",
          "region",
          "country",
          "deal_value",
          "announced_date",
          "technology",
        ]
        break
      case "projects":
        headers = ["name", "description", "technology", "capacity_mw", "status", "region", "country", "announced_date"]
        break
    }

    const csvContent = headers.join(",") + "\n"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}_template.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload {type.charAt(0).toUpperCase() + type.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Template
          </Button>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Select CSV File"}
          </Button>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadResult && (
          <div className="space-y-2">
            <Alert
              className={uploadResult.failed === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}
            >
              <div className="flex items-center gap-2">
                {uploadResult.failed === 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-yellow-600" />
                )}
                <AlertDescription>
                  Upload completed: {uploadResult.success} successful, {uploadResult.failed} failed
                </AlertDescription>
              </div>
            </Alert>

            {uploadResult.errors.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-red-600 mb-1">Errors:</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {uploadResult.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {uploadResult.errors.length > 5 && <li>• ... and {uploadResult.errors.length - 5} more errors</li>}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Upload a CSV file to bulk create {type}. Make sure your CSV follows the template format.</p>
          <p className="mt-1">Maximum file size: 10MB</p>
        </div>
      </CardContent>
    </Card>
  )
}
