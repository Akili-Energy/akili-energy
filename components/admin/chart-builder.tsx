"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, BarChart3, LineChart, PieChart } from "lucide-react"

interface ChartData {
  type: "bar" | "line" | "pie"
  title: string
  data: Array<{ label: string; value: number }>
}

interface ChartBuilderProps {
  value: ChartData[]
  onChange: (charts: ChartData[]) => void
}

export default function ChartBuilder({ value, onChange }: ChartBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const addChart = () => {
    const newChart: ChartData = {
      type: "bar",
      title: "",
      data: [{ label: "", value: 0 }],
    }
    onChange([...value, newChart])
    setEditingIndex(value.length)
  }

  const updateChart = (index: number, chart: ChartData) => {
    const updated = [...value]
    updated[index] = chart
    onChange(updated)
  }

  const removeChart = (index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
    setEditingIndex(null)
  }

  const addDataPoint = (chartIndex: number) => {
    const chart = value[chartIndex]
    const updated = {
      ...chart,
      data: [...chart.data, { label: "", value: 0 }],
    }
    updateChart(chartIndex, updated)
  }

  const updateDataPoint = (
    chartIndex: number,
    dataIndex: number,
    field: "label" | "value",
    newValue: string | number,
  ) => {
    const chart = value[chartIndex]
    const updated = {
      ...chart,
      data: chart.data.map((item, i) => (i === dataIndex ? { ...item, [field]: newValue } : item)),
    }
    updateChart(chartIndex, updated)
  }

  const removeDataPoint = (chartIndex: number, dataIndex: number) => {
    const chart = value[chartIndex]
    const updated = {
      ...chart,
      data: chart.data.filter((_, i) => i !== dataIndex),
    }
    updateChart(chartIndex, updated)
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case "bar":
        return <BarChart3 className="h-4 w-4" />
      case "line":
        return <LineChart className="h-4 w-4" />
      case "pie":
        return <PieChart className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Charts & Graphs</Label>
        <Button type="button" onClick={addChart} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Chart
        </Button>
      </div>

      {value.map((chart, chartIndex) => (
        <Card key={chartIndex} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getChartIcon(chart.type)}
                <CardTitle className="text-sm">{chart.title || `Chart ${chartIndex + 1}`}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingIndex(editingIndex === chartIndex ? null : chartIndex)}
                >
                  {editingIndex === chartIndex ? "Done" : "Edit"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeChart(chartIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {editingIndex === chartIndex && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`chart-title-${chartIndex}`}>Chart Title</Label>
                  <Input
                    id={`chart-title-${chartIndex}`}
                    value={chart.title}
                    onChange={(e) => updateChart(chartIndex, { ...chart, title: e.target.value })}
                    placeholder="Enter chart title"
                  />
                </div>
                <div>
                  <Label htmlFor={`chart-type-${chartIndex}`}>Chart Type</Label>
                  <Select
                    value={chart.type}
                    onValueChange={(value: "bar" | "line" | "pie") =>
                      updateChart(chartIndex, { ...chart, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Data Points</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addDataPoint(chartIndex)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Point
                  </Button>
                </div>
                <div className="space-y-2">
                  {chart.data.map((dataPoint, dataIndex) => (
                    <div key={dataIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder="Label"
                        value={dataPoint.label}
                        onChange={(e) => updateDataPoint(chartIndex, dataIndex, "label", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Value"
                        value={dataPoint.value}
                        onChange={(e) =>
                          updateDataPoint(chartIndex, dataIndex, "value", Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDataPoint(chartIndex, dataIndex)}
                        disabled={chart.data.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {value.length === 0 && (
        <div className="text-center py-8 text-gray-500">No charts added yet. Click "Add Chart" to get started.</div>
      )}
    </div>
  )
}
