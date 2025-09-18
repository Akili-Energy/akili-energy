"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Code2,
  Link,
  ImageIcon,
  Table,
  Minus,
  Palette,
  Highlighter,
  Undo,
  Redo,
  Indent,
  Outdent,
  Eye,
  ChevronDown,
  Calculator,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

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
  "#FFFF00",
  "#CCFF00",
  "#66FF00",
  "#00FF00",
  "#00FF66",
  "#00FFCC",
  "#00FFFF",
  "#00CCFF",
  "#0066FF",
  "#0000FF",
  "#6600FF",
  "#CC00FF",
  "#FF00FF",
  "#FF00CC",
  "#FF0066",
  "#800000",
  "#804000",
  "#808000",
  "#408000",
  "#008000",
  "#008040",
  "#008080",
  "#004080",
  "#000080",
  "#400080",
  "#800080",
  "#800040",
  "#400000",
  "#402000",
  "#404000",
  "#204000",
  "#004000",
  "#004020",
  "#004040",
  "#002040",
  "#000040",
  "#200040",
  "#400040",
  "#400020",
]

const highlightColors = [
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#FF00FF",
  "#FF0000",
  "#0000FF",
  "#FFA500",
  "#800080",
  "#008000",
  "#FFC0CB",
  "#FFE4B5",
  "#E6E6FA",
  "#F0E68C",
  "#DDA0DD",
  "#98FB98",
  "#F5DEB3",
  "#D3D3D3",
  "#A9A9A9",
]

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [equation, setEquation] = useState("")
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  // Format state tracking
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    superscript: false,
    subscript: false,
  })

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
      updateStats()
    }
  }, [content])

  // Update word and character count
  const updateStats = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || ""
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount(words)
      setCharCount(text.length)
    }
  }, [])

  // Handle content change
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      updateStats()
    }
  }, [onChange, updateStats])

  // Update format state
  const updateFormatState = useCallback(() => {
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikeThrough"),
      superscript: document.queryCommandState("superscript"),
      subscript: document.queryCommandState("subscript"),
    })
  }, [])

  // Handle selection change
  const handleSelectionChange = useCallback(() => {
    updateFormatState()
  }, [updateFormatState])

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [handleSelectionChange])

  // Execute command
  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleInput()
      updateFormatState()
    },
    [handleInput, updateFormatState],
  )

  // Format text
  const formatText = useCallback(
    (command: string, value?: string) => {
      execCommand(command, value)
    },
    [execCommand],
  )

  // Set heading
  const setHeading = useCallback(
    (level: string) => {
      execCommand("formatBlock", level)
    },
    [execCommand],
  )

  // Insert link
  const insertLink = useCallback(() => {
    if (linkUrl) {
      const selection = window.getSelection()
      const text = linkText || selection?.toString() || linkUrl

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const link = document.createElement("a")
        link.href = linkUrl
        link.textContent = text
        link.className = "text-blue-600 underline hover:text-blue-800 cursor-pointer"
        link.target = "_blank"
        link.rel = "noopener noreferrer"

        range.insertNode(link)
        range.setStartAfter(link)
        range.setEndAfter(link)
        selection.removeAllRanges()
        selection.addRange(range)
      }

      setLinkUrl("")
      setLinkText("")
      handleInput()
    }
  }, [linkUrl, linkText, handleInput])

  // Insert image with resizing functionality
  const insertImage = useCallback(() => {
    if (imageUrl) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        const container = document.createElement("div")
        container.className = "image-container relative inline-block group my-2"
        container.draggable = true
        container.style.cursor = "move"

        const img = document.createElement("img")
        img.src = imageUrl
        img.alt = imageAlt || "Image"
        img.className = "max-w-full h-auto rounded-lg"
        img.style.maxWidth = "100%"
        img.style.minWidth = "100px"
        img.style.minHeight = "50px"

        // Add resize handles
        const resizeHandle = document.createElement("div")
        resizeHandle.className =
          "absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        resizeHandle.style.transform = "translate(50%, 50%)"

        // Image resizing functionality
        let startX = 0,
          startY = 0,
          startWidth = 0,
          startHeight = 0

        const handleMouseDown = (e: MouseEvent) => {
          e.preventDefault()
          setIsResizing(true)
          startX = e.clientX
          startY = e.clientY
          startWidth = img.offsetWidth
          startHeight = img.offsetHeight

          const handleMouseMove = (e: MouseEvent) => {
            const width = startWidth + (e.clientX - startX)
            const height = startHeight + (e.clientY - startY)

            if (width > 50 && height > 25) {
              img.style.width = `${width}px`
              img.style.height = `${height}px`
            }
          }

          const handleMouseUp = () => {
            setIsResizing(false)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            handleInput()
          }

          document.addEventListener("mousemove", handleMouseMove)
          document.addEventListener("mouseup", handleMouseUp)
        }

        resizeHandle.addEventListener("mousedown", handleMouseDown)

        // Drag functionality
        container.addEventListener("dragstart", (e) => {
          setDraggedElement(container)
          e.dataTransfer?.setData("text/html", container.outerHTML)
        })

        container.addEventListener("dragend", () => {
          setDraggedElement(null)
        })

        container.appendChild(img)
        container.appendChild(resizeHandle)

        range.deleteContents()
        range.insertNode(container)
        range.setStartAfter(container)
        range.setEndAfter(container)
        selection.removeAllRanges()
        selection.addRange(range)
      }

      setImageUrl("")
      setImageAlt("")
      handleInput()
    }
  }, [imageUrl, imageAlt, handleInput])

  // Insert table with advanced operations
  const insertTable = useCallback(() => {
    let tableHTML = `
      <div class="table-container my-4" draggable="true" style="cursor: move;">
        <table class="border-collapse border border-gray-300 w-full">
          <tbody>
    `

    for (let i = 0; i < tableRows; i++) {
      tableHTML += "<tr>"
      for (let j = 0; j < tableCols; j++) {
        const cellClass =
          i === 0
            ? "border border-gray-300 px-4 py-2 bg-gray-100 font-semibold relative group"
            : "border border-gray-300 px-4 py-2 relative group"

        tableHTML += `
          <${i === 0 ? "th" : "td"} class="${cellClass}" contenteditable="true">
            ${i === 0 ? `Header ${j + 1}` : `Cell ${i},${j + 1}`}
            <div class="table-controls absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="add-row-before text-xs bg-blue-500 text-white px-1 rounded" title="Add row before">+↑</button>
              <button class="add-row-after text-xs bg-blue-500 text-white px-1 rounded" title="Add row after">+↓</button>
              <button class="add-col-before text-xs bg-blue-500 text-white px-1 rounded" title="Add column before">+←</button>
              <button class="add-col-after text-xs bg-blue-500 text-white px-1 rounded" title="Add column after">+→</button>
              <button class="delete-row text-xs bg-red-500 text-white px-1 rounded" title="Delete row">-R</button>
              <button class="delete-col text-xs bg-red-500 text-white px-1 rounded" title="Delete column">-C</button>
            </div>
          </${i === 0 ? "th" : "td"}>
        `
      }
      tableHTML += "</tr>"
    }

    tableHTML += `
          </tbody>
        </table>
      </div>
    `

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const div = document.createElement("div")
      div.innerHTML = tableHTML

      const tableContainer = div.firstElementChild as HTMLElement

      // Add drag functionality to table
      tableContainer.addEventListener("dragstart", (e) => {
        setDraggedElement(tableContainer)
        e.dataTransfer?.setData("text/html", tableContainer.outerHTML)
      })

      // Add table operation event listeners
      tableContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        const cell = target.closest("td, th") as HTMLTableCellElement
        const row = cell?.parentElement as HTMLTableRowElement
        const table = tableContainer.querySelector("table") as HTMLTableElement

        if (target.classList.contains("add-row-before")) {
          const newRow = row.cloneNode(true) as HTMLTableRowElement
          newRow.querySelectorAll("td, th").forEach((cell, index) => {
            cell.textContent = `New Cell ${index + 1}`
          })
          row.parentElement?.insertBefore(newRow, row)
          handleInput()
        } else if (target.classList.contains("add-row-after")) {
          const newRow = row.cloneNode(true) as HTMLTableRowElement
          newRow.querySelectorAll("td, th").forEach((cell, index) => {
            cell.textContent = `New Cell ${index + 1}`
          })
          row.parentElement?.insertBefore(newRow, row.nextSibling)
          handleInput()
        } else if (target.classList.contains("add-col-before")) {
          const cellIndex = Array.from(row.children).indexOf(cell)
          table.querySelectorAll("tr").forEach((row, rowIndex) => {
            const newCell = document.createElement(rowIndex === 0 ? "th" : "td")
            newCell.className =
              rowIndex === 0
                ? "border border-gray-300 px-4 py-2 bg-gray-100 font-semibold"
                : "border border-gray-300 px-4 py-2"
            newCell.contentEditable = "true"
            newCell.textContent = rowIndex === 0 ? "New Header" : "New Cell"
            row.insertBefore(newCell, row.children[cellIndex])
          })
          handleInput()
        } else if (target.classList.contains("add-col-after")) {
          const cellIndex = Array.from(row.children).indexOf(cell)
          table.querySelectorAll("tr").forEach((row, rowIndex) => {
            const newCell = document.createElement(rowIndex === 0 ? "th" : "td")
            newCell.className =
              rowIndex === 0
                ? "border border-gray-300 px-4 py-2 bg-gray-100 font-semibold"
                : "border border-gray-300 px-4 py-2"
            newCell.contentEditable = "true"
            newCell.textContent = rowIndex === 0 ? "New Header" : "New Cell"
            row.insertBefore(newCell, row.children[cellIndex + 1])
          })
          handleInput()
        } else if (target.classList.contains("delete-row")) {
          if (table.querySelectorAll("tr").length > 1) {
            row.remove()
            handleInput()
          }
        } else if (target.classList.contains("delete-col")) {
          const cellIndex = Array.from(row.children).indexOf(cell)
          if (table.querySelectorAll("tr")[0].children.length > 1) {
            table.querySelectorAll("tr").forEach((row) => {
              row.children[cellIndex]?.remove()
            })
            handleInput()
          }
        }
      })

      range.insertNode(tableContainer)
      range.setStartAfter(tableContainer)
      range.setEndAfter(tableContainer)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    handleInput()
  }, [tableRows, tableCols, handleInput])

  // Insert task list
  const insertTaskList = useCallback(() => {
    const taskHTML = `
      <div class="task-item flex items-center my-2 p-2 border rounded draggable-element" draggable="true" style="cursor: move;">
        <input type="checkbox" class="mr-3 cursor-pointer" />
        <span contenteditable="true" class="flex-1">Task item - click to edit</span>
        <button class="ml-2 text-red-500 hover:text-red-700 delete-task" title="Delete task">×</button>
      </div>
    `

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const div = document.createElement("div")
      div.innerHTML = taskHTML
      const taskElement = div.firstElementChild as HTMLElement

      // Add drag functionality
      taskElement.addEventListener("dragstart", (e) => {
        setDraggedElement(taskElement)
        e.dataTransfer?.setData("text/html", taskElement.outerHTML)
      })

      // Add delete functionality
      taskElement.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("delete-task")) {
          taskElement.remove()
          handleInput()
        }
      })

      range.insertNode(taskElement)
      range.setStartAfter(taskElement)
      range.setEndAfter(taskElement)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    handleInput()
  }, [handleInput])

  // Insert code block
  const insertCodeBlock = useCallback(() => {
    const codeHTML = `
      <div class="code-block-container my-4 draggable-element" draggable="true" style="cursor: move;">
        <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto border"><code contenteditable="true" class="font-mono text-sm">// Your code here
console.log("Hello, World!");</code></pre>
      </div>
    `

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const div = document.createElement("div")
      div.innerHTML = codeHTML
      const codeElement = div.firstElementChild as HTMLElement

      // Add drag functionality
      codeElement.addEventListener("dragstart", (e) => {
        setDraggedElement(codeElement)
        e.dataTransfer?.setData("text/html", codeElement.outerHTML)
      })

      range.insertNode(codeElement)
      range.setStartAfter(codeElement)
      range.setEndAfter(codeElement)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    handleInput()
  }, [handleInput])

  // Insert blockquote
  const insertBlockquote = useCallback(() => {
    const quoteHTML = `
      <div class="blockquote-container my-4 draggable-element" draggable="true" style="cursor: move;">
        <blockquote class="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-700 bg-gray-50 rounded-r">
          <p contenteditable="true">Quote text here - click to edit</p>
        </blockquote>
      </div>
    `

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const div = document.createElement("div")
      div.innerHTML = quoteHTML
      const quoteElement = div.firstElementChild as HTMLElement

      // Add drag functionality
      quoteElement.addEventListener("dragstart", (e) => {
        setDraggedElement(quoteElement)
        e.dataTransfer?.setData("text/html", quoteElement.outerHTML)
      })

      range.insertNode(quoteElement)
      range.setStartAfter(quoteElement)
      range.setEndAfter(quoteElement)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    handleInput()
  }, [handleInput])

  // Insert equation
  const insertEquation = useCallback(() => {
    if (equation) {
      const equationHTML = `
        <div class="equation-container inline-block mx-2 draggable-element" draggable="true" style="cursor: move;">
          <span class="bg-blue-50 border border-blue-200 px-3 py-1 rounded font-mono text-sm">
            ${equation}
          </span>
        </div>
      `

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const div = document.createElement("div")
        div.innerHTML = equationHTML
        const equationElement = div.firstElementChild as HTMLElement

        // Add drag functionality
        equationElement.addEventListener("dragstart", (e) => {
          setDraggedElement(equationElement)
          e.dataTransfer?.setData("text/html", equationElement.outerHTML)
        })

        range.insertNode(equationElement)
        range.setStartAfter(equationElement)
        range.setEndAfter(equationElement)
        selection.removeAllRanges()
        selection.addRange(range)
      }

      setEquation("")
      handleInput()
    }
  }, [equation, handleInput])

  // Insert toggle/collapsible section
  const insertToggle = useCallback(() => {
    const toggleHTML = `
      <div class="toggle-container my-4 border rounded-lg draggable-element" draggable="true" style="cursor: move;">
        <div class="toggle-header bg-gray-100 p-3 cursor-pointer flex items-center justify-between" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <span contenteditable="true" onclick="event.stopPropagation()">Toggle Section Title - Click to edit</span>
          <span class="toggle-icon">▼</span>
        </div>
        <div class="toggle-content p-3 border-t">
          <p contenteditable="true">Toggle content goes here. Click to edit this text.</p>
        </div>
      </div>
    `

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const div = document.createElement("div")
      div.innerHTML = toggleHTML
      const toggleElement = div.firstElementChild as HTMLElement

      // Add drag functionality
      toggleElement.addEventListener("dragstart", (e) => {
        setDraggedElement(toggleElement)
        e.dataTransfer?.setData("text/html", toggleElement.outerHTML)
      })

      range.insertNode(toggleElement)
      range.setStartAfter(toggleElement)
      range.setEndAfter(toggleElement)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    handleInput()
  }, [handleInput])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()

      if (draggedElement) {
        const dropTarget = e.target as HTMLElement
        const editorElement = editorRef.current

        if (editorElement && editorElement.contains(dropTarget)) {
          // Find the closest droppable element
          let targetElement = dropTarget
          while (targetElement && targetElement !== editorElement) {
            if (targetElement.tagName === "P" || targetElement.classList.contains("draggable-element")) {
              break
            }
            targetElement = targetElement.parentElement as HTMLElement
          }

          if (targetElement && targetElement !== draggedElement) {
            // Insert the dragged element before the target
            targetElement.parentElement?.insertBefore(draggedElement, targetElement)
            handleInput()
          }
        }
      }
    },
    [draggedElement, handleInput],
  )

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault()
            formatText("bold")
            break
          case "i":
            e.preventDefault()
            formatText("italic")
            break
          case "u":
            e.preventDefault()
            formatText("underline")
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              formatText("redo")
            } else {
              formatText("undo")
            }
            break
          case "k":
            e.preventDefault()
            // Focus on link input
            break
        }
      }
    },
    [formatText],
  )

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn("h-8 w-8 p-0", isActive && "bg-blue-100 text-blue-700")}
      type="button"
    >
      {children}
    </Button>
  )

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 bg-gray-50">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo/Redo */}
          <ToolbarButton onClick={() => formatText("undo")} title="Undo (Ctrl+Z)">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("redo")} title="Redo (Ctrl+Shift+Z)">
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <Select onValueChange={setHeading}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="div">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <ToolbarButton onClick={() => formatText("bold")} isActive={formatState.bold} title="Bold (Ctrl+B)">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("italic")} isActive={formatState.italic} title="Italic (Ctrl+I)">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => formatText("underline")}
            isActive={formatState.underline}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => formatText("strikeThrough")}
            isActive={formatState.strikethrough}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => formatText("superscript")}
            isActive={formatState.superscript}
            title="Superscript"
          >
            <Superscript className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("subscript")} isActive={formatState.subscript} title="Subscript">
            <Subscript className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Colors */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Color">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-6 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => formatText("foreColor", color)}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Highlight Color">
                <Highlighter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-6 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => formatText("backColor", color)}
                    title={color}
                  />
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => formatText("removeFormat")}>
                Remove Highlight
              </Button>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <ToolbarButton onClick={() => formatText("justifyLeft")} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("justifyCenter")} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("justifyRight")} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("justifyFull")} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton onClick={() => formatText("insertUnorderedList")} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("insertOrderedList")} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertTaskList} title="Task List">
            <CheckSquare className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Indentation */}
          <ToolbarButton onClick={() => formatText("indent")} title="Increase Indent">
            <Indent className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText("outdent")} title="Decrease Indent">
            <Outdent className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Content Elements */}
          <ToolbarButton onClick={() => formatText("formatBlock", "<code>")} title="Inline Code">
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertCodeBlock} title="Code Block">
            <Code2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertBlockquote} title="Blockquote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Link */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Link (Ctrl+K)">
                <Link className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="link-text">Link Text (optional)</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text"
                  />
                </div>
                <Button onClick={insertLink} className="w-full">
                  Insert Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Image */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Image">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Description of the image"
                  />
                </div>
                <Button onClick={insertImage} className="w-full">
                  Insert Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Table */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Table">
                <Table className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Table</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="table-rows">Rows</Label>
                  <Input
                    id="table-rows"
                    type="number"
                    value={tableRows}
                    onChange={(e) => setTableRows(Number.parseInt(e.target.value) || 3)}
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="table-cols">Columns</Label>
                  <Input
                    id="table-cols"
                    type="number"
                    value={tableCols}
                    onChange={(e) => setTableCols(Number.parseInt(e.target.value) || 3)}
                    min="1"
                    max="10"
                  />
                </div>
                <Button onClick={insertTable} className="w-full">
                  Insert Table
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* More Tools */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More Tools">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => formatText("insertHorizontalRule")}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Divider
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Equation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Equation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="equation">Equation (LaTeX or plain text)</Label>
                        <Input
                          id="equation"
                          value={equation}
                          onChange={(e) => setEquation(e.target.value)}
                          placeholder="E = mc²"
                        />
                      </div>
                      <Button onClick={insertEquation} className="w-full">
                        Insert Equation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={insertToggle}>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Toggle Section
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Preview */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Preview">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Content Preview</DialogTitle>
              </DialogHeader>
              <div
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 border rounded-lg bg-white"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[500px] p-4 outline-none prose max-w-none"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        style={{
          minHeight: "500px",
        }}
      />

      {/* Footer */}
      <div className="border-t p-2 text-sm text-gray-500 flex justify-between items-center bg-gray-50">
        <span>
          {wordCount} words, {charCount} characters
        </span>
        <span className="text-xs">
          Drag elements to reorder • Resize images by dragging corners • Use Ctrl+shortcuts for quick formatting
        </span>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .draggable-element:hover {
          outline: 2px dashed #3b82f6;
          outline-offset: 2px;
        }
        
        .image-container:hover .resize-handle {
          opacity: 1;
        }
        
        .table-controls {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
        }
        
        .table-controls button {
          font-size: 10px;
          padding: 1px 3px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
