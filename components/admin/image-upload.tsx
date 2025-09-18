"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  placeholder?: string
}

export default function ImageUpload({ value, onChange, onRemove, placeholder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload - in real app, upload to your storage service
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onChange(result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  if (value) {
    return (
      <div className="relative">
        <img
          src={value || "/placeholder.svg"}
          alt="Uploaded image"
          className="w-full h-48 object-cover rounded-lg border"
        />
        <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">{placeholder || "Upload an image"}</p>
      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Choose Image"}
      </Button>
    </div>
  )
}
