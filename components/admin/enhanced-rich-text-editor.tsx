"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  LinkIcon,
  ImageIcon,
  Table,
  Code,
  Undo,
  Redo,
  Indent,
  Outdent,
  Superscript,
  Subscript,
  Palette,
  Type,
  Eye,
  ChevronDown,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  PilcrowIcon,
} from "lucide-react"

interface EnhancedRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const fontFamilies = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Courier New", label: "Courier New" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
]

const fontSizes = [
  { value: "1", label: "10px" },
  { value: "2", label: "13px" },
  { value: "3", label: "16px" },
  { value: "4", label: "18px" },
  { value: "5", label: "24px" },
  { value: "6", label: "32px" },
  { value: "7", label: "48px" },
]

const colors = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#FFFFFF",
  "#FF0000",
  "#FF6600",
  "#FFCC00",
  "#00FF00",
  "#0066FF",
  "#6600FF",
  "#FF0066",
  "#FF3366",
  "#FF6699",
  "#66FF99",
  "#6699FF",
  "#9966FF",
  "#8B4513",
  "#A0522D",
  "#CD853F",
  "#DEB887",
  "#F4A460",
  "#D2691E",
  "#FF1493",
  "#FF69B4",
  "#FFB6C1",
  "#FFC0CB",
  "#DA70D6",
  "#BA55D3",
]

const symbols = [
  "©",
  "®",
  "™",
  "°",
  "±",
  "×",
  "÷",
  "≠",
  "≤",
  "≥",
  "∞",
  "∑",
  "∏",
  "∆",
  "Ω",
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "π",
  "σ",
  "φ",
  "ψ",
  "→",
  "←",
  "↑",
  "↓",
  "↔",
  "⇒",
  "⇐",
  "⇑",
  "⇓",
  "⇔",
  "∈",
  "∉",
  "∪",
  "∩",
  "⊂",
  "⊃",
  "⊆",
  "⊇",
  "∅",
  "∀",
  "∃",
  "∴",
  "∵",
  "∝",
]

export default function EnhancedRichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: EnhancedRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  // Function to restore selection after a command
  const restoreSelection = useCallback((range: Range | null) => {
    if (range) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [])

  // Function to save current selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0)
    }
    return null
  }, [])

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      const savedRange = saveSelection()
      document.execCommand(command, false, value)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
      restoreSelection(savedRange) // Restore selection after command
      editorRef.current?.focus()
    },
    [onChange, restoreSelection, saveSelection],
  )

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  // Update format state based on selection
  useEffect(() => {
    const handleSelectionChange = () => {
      setCurrentFormat({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      })
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [])

  const insertLink = () => {
    if (linkUrl && linkText) {
      executeCommand("insertHTML", `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      executeCommand(
        "insertHTML",
        `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 4px;" />`,
      )
      setImageUrl("")
      setImageAlt("")
    }
  }

  const insertTable = () => {
    let tableHTML = `<table style="border-collapse: collapse; width: 100%; margin: 16px 0; border: 1px solid #e2e8f0;">`
    for (let i = 0; i < tableRows; i++) {
      tableHTML += "<tr>"
      for (let j = 0; j < tableCols; j++) {
        const cellStyle =
          "padding: 12px; border: 1px solid #e2e8f0; background-color: " + (i === 0 ? "#f8fafc" : "white") + ";"
        tableHTML +=
          i === 0
            ? `<th style="${cellStyle} font-weight: 600;">Header ${j + 1}</th>`
            : `<td style="${cellStyle}">Cell ${i}-${j + 1}</td>`
      }
      tableHTML += "</tr>"
    }
    tableHTML += "</table><br>"
    executeCommand("insertHTML", tableHTML)
  }

  const insertSymbol = (symbol: string) => {
    executeCommand("insertText", symbol)
  }

  const insertEquation = () => {
    const equation = prompt("Enter LaTeX equation (without $$ delimiters):")
    if (equation) {
      executeCommand(
        "insertHTML",
        `<span class="equation" style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: 'Times New Roman', serif;">$$${equation}$$</span>`,
      )
    }
  }

  const insertToggle = () => {
    const title = prompt("Enter toggle title:")
    if (title) {
      executeCommand(
        "insertHTML",
        `
        <details style="margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <summary style="cursor: pointer; font-weight: 600; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; user-select: none;">${title}</summary>
          <div style="padding: 16px;">
            <p>Toggle content here...</p>
          </div>
        </details>
      `,
      )
    }
  }

  const insertTodoList = () => {
    executeCommand(
      "insertHTML",
      `
      <div style="margin: 8px 0;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" style="margin-right: 8px;" />
          <span>Todo item</span>
        </label>
      </div>
    `,
    )
  }

  const insertBlockquote = () => {
    executeCommand("formatBlock", "blockquote")
    // Apply custom styling to blockquote
    setTimeout(() => {
      const blockquotes = editorRef.current?.querySelectorAll("blockquote")
      blockquotes?.forEach((bq) => {
        bq.setAttribute(
          "style",
          "border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; font-style: italic; color: #64748b; background: #f8fafc; padding: 16px; border-radius: 0 8px 8px 0;",
        )
      })
    }, 100)
  }

  const insertCodeBlock = () => {
    const code = prompt("Enter code:")
    if (code) {
      executeCommand(
        "insertHTML",
        `
        <pre style="background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; font-family: 'Courier New', monospace; font-size: 14px;"><code>${code}</code></pre>
      `,
      )
    }
  }

  const ToolbarButton = ({
    onClick,
    children,
    title,
    active = false,
  }: {
    onClick: () => void
    children: React.ReactNode
    title: string
    active?: boolean
  }) => (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className={`h-8 w-8 p-0 ${active ? "bg-blue-100 text-blue-700" : ""}`}
    >
      {children}
    </Button>
  )

  const ColorPicker = ({
    onColorSelect,
    children,
    title,
  }: {
    onColorSelect: (color: string) => void
    children: React.ReactNode
    title: string
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title={title}>
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform shadow-sm"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex flex-wrap gap-1 items-center">
          {/* History */}
          <ToolbarButton onClick={() => executeCommand("undo")} title="Undo (Ctrl+Z)">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("redo")} title="Redo (Ctrl+Y)">
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Block Formats */}
          <ToolbarButton onClick={() => executeCommand("formatBlock", "p")} title="Paragraph">
            <PilcrowIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("formatBlock", "h1")} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("formatBlock", "h2")} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("formatBlock", "h3")} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Font Family */}
          <Select onValueChange={(value) => executeCommand("fontName", value)}>
            <SelectTrigger className="w-36 h-8">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size */}
          <Select onValueChange={(value) => executeCommand("fontSize", value)}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Formatting */}
          <ToolbarButton onClick={() => executeCommand("bold")} title="Bold (Ctrl+B)" active={currentFormat.bold}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("italic")} title="Italic (Ctrl+I)" active={currentFormat.italic}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("underline")}
            title="Underline (Ctrl+U)"
            active={currentFormat.underline}
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("strikeThrough")} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("superscript")} title="Superscript">
            <Superscript className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("subscript")} title="Subscript">
            <Subscript className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Colors */}
          <ColorPicker onColorSelect={(color) => executeCommand("foreColor", color)} title="Text Color">
            <Type className="h-4 w-4" />
          </ColorPicker>
          <ColorPicker onColorSelect={(color) => executeCommand("backColor", color)} title="Highlight Color">
            <Palette className="h-4 w-4" />
          </ColorPicker>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Alignment */}
          <ToolbarButton onClick={() => executeCommand("justifyLeft")} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("justifyCenter")} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("justifyRight")} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("justifyFull")} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Lists */}
          <ToolbarButton onClick={() => executeCommand("insertUnorderedList")} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("insertOrderedList")} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertTodoList} title="Todo List">
            <CheckSquare className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Indent */}
          <ToolbarButton onClick={() => executeCommand("indent")} title="Indent">
            <Indent className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("outdent")} title="Outdent">
            <Outdent className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Code */}
          <ToolbarButton
            onClick={() =>
              executeCommand(
                "insertHTML",
                "<code style='background: #f1f5f9; padding: 2px 4px; border-radius: 3px; font-family: monospace;'>code</code>",
              )
            }
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertCodeBlock} title="Code Block">
            <div className="text-xs font-mono">{}</div>
          </ToolbarButton>

          {/* Blockquote */}
          <ToolbarButton onClick={insertBlockquote} title="Blockquote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Insert Elements */}
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Link">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkText">Link Text</Label>
                  <Input
                    id="linkText"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Enter link text"
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <Button onClick={insertLink} disabled={!linkUrl || !linkText}>
                  Insert Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Image">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="imageAlt">Alt Text</Label>
                  <Input
                    id="imageAlt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Image description"
                  />
                </div>
                <Button onClick={insertImage} disabled={!imageUrl}>
                  Insert Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Table">
                <Table className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Table</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tableRows">Rows</Label>
                  <Input
                    id="tableRows"
                    type="number"
                    value={tableRows}
                    onChange={(e) => setTableRows(Number(e.target.value))}
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="tableCols">Columns</Label>
                  <Input
                    id="tableCols"
                    type="number"
                    value={tableCols}
                    onChange={(e) => setTableCols(Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
                <Button onClick={insertTable}>Insert Table</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 px-2" title="Insert Symbol">
                Ω <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <ScrollArea className="h-48">
                <div className="grid grid-cols-8 gap-1 p-2">
                  {symbols.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded text-center font-mono"
                      onClick={() => insertSymbol(symbol)}
                      title={symbol}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <ToolbarButton onClick={insertEquation} title="Insert Equation">
            <span className="text-sm font-serif">∫</span>
          </ToolbarButton>

          <ToolbarButton onClick={insertToggle} title="Insert Toggle/Collapsible">
            <ChevronDown className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Preview */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Preview">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <Card>
                  <CardContent className="p-6">
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: value }}
                      style={{
                        lineHeight: "1.6",
                        color: "#374151",
                      }}
                    />
                  </CardContent>
                </Card>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] p-6 focus:outline-none prose prose-lg max-w-none"
        style={{
          minHeight: "400px",
          lineHeight: "1.6",
          direction: "ltr", // Force LTR direction
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        suppressContentEditableWarning={true}
        placeholder={placeholder}
      />
    </div>
  )
}
