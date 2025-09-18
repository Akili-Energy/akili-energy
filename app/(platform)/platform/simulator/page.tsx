"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Calculator, Download, BarChart3, TrendingUp, DollarSign, Zap } from "lucide-react"

export default function FinancialSimulatorPage() {
  const [projectInputs, setProjectInputs] = useState({
    capacity: 100,
    capex: 1.2,
    opex: 2.5,
    tariff: 0.08,
    debt: 70,
    equity: 30,
    debtTerm: 15,
    interestRate: 8.5,
    inflationRate: 3.0,
    degradation: 0.5,
  })

  const [results, setResults] = useState({
    lcoe: 0.075,
    irr: 12.5,
    npv: 25.6,
    payback: 8.2,
    dscr: 1.35,
    totalRevenue: 180.5,
    totalCosts: 145.2,
    profit: 35.3,
  })

  const handleInputChange = (field: string, value: number) => {
    setProjectInputs((prev) => ({ ...prev, [field]: value }))
    // In a real app, this would trigger recalculation
    calculateResults()
  }

  const calculateResults = () => {
    // Simplified calculation logic - in real app, this would be more complex
    const lcoe = (projectInputs.capex * 1000000 + projectInputs.opex * 25) / (projectInputs.capacity * 8760 * 0.25 * 25)
    const irr = 10 + (projectInputs.tariff - 0.06) * 100
    const npv = projectInputs.capacity * 0.5 - 10
    const payback = projectInputs.capex / ((projectInputs.tariff * projectInputs.capacity * 8760 * 0.25) / 1000000)

    setResults({
      lcoe: lcoe,
      irr: Math.max(irr, 5),
      npv: npv,
      payback: payback,
      dscr: 1.2 + (projectInputs.tariff - 0.06) * 5,
      totalRevenue: (projectInputs.capacity * projectInputs.tariff * 8760 * 0.25 * 25) / 1000000,
      totalCosts: projectInputs.capacity * projectInputs.capex + projectInputs.opex * 25,
      profit:
        (projectInputs.capacity * projectInputs.tariff * 8760 * 0.25 * 25) / 1000000 -
        (projectInputs.capacity * projectInputs.capex + projectInputs.opex * 25),
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Simulator</h1>
          <p className="text-gray-600">Model and analyze financial scenarios for energy projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Model
          </Button>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Parameters</CardTitle>
              <CardDescription>Configure your project assumptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="capacity">Capacity (MW)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={projectInputs.capacity}
                    onChange={(e) => handleInputChange("capacity", Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="capex">CAPEX ($/MW)</Label>
                  <Input
                    id="capex"
                    type="number"
                    step="0.1"
                    value={projectInputs.capex}
                    onChange={(e) => handleInputChange("capex", Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Million USD per MW</p>
                </div>

                <div>
                  <Label htmlFor="opex">OPEX ($/MWh)</Label>
                  <Input
                    id="opex"
                    type="number"
                    step="0.1"
                    value={projectInputs.opex}
                    onChange={(e) => handleInputChange("opex", Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="tariff">Tariff ($/kWh)</Label>
                  <Input
                    id="tariff"
                    type="number"
                    step="0.001"
                    value={projectInputs.tariff}
                    onChange={(e) => handleInputChange("tariff", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financing Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Debt/Equity Ratio</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="debt" className="text-xs">
                      Debt (%)
                    </Label>
                    <Input
                      id="debt"
                      type="number"
                      value={projectInputs.debt}
                      onChange={(e) => handleInputChange("debt", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="equity" className="text-xs">
                      Equity (%)
                    </Label>
                    <Input
                      id="equity"
                      type="number"
                      value={projectInputs.equity}
                      onChange={(e) => handleInputChange("equity", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="debtTerm">Debt Term (years)</Label>
                <Input
                  id="debtTerm"
                  type="number"
                  value={projectInputs.debtTerm}
                  onChange={(e) => handleInputChange("debtTerm", Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={projectInputs.interestRate}
                  onChange={(e) => handleInputChange("interestRate", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={projectInputs.inflationRate}
                  onChange={(e) => handleInputChange("inflationRate", Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="degradation">Annual Degradation (%)</Label>
                <Input
                  id="degradation"
                  type="number"
                  step="0.1"
                  value={projectInputs.degradation}
                  onChange={(e) => handleInputChange("degradation", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LCOE</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${results.lcoe.toFixed(3)}</div>
                <p className="text-xs text-muted-foreground">per kWh</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IRR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.irr.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Internal Rate of Return</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NPV</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${results.npv.toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">Net Present Value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payback</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.payback.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">years</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Key financial metrics and project viability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Project Economics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total CAPEX:</span>
                          <span className="font-medium">
                            ${(projectInputs.capacity * projectInputs.capex).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual OPEX:</span>
                          <span className="font-medium">${projectInputs.opex.toFixed(1)}/MWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity Factor:</span>
                          <span className="font-medium">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Project Life:</span>
                          <span className="font-medium">25 years</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Financial Returns</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">DSCR (min):</span>
                          <span className="font-medium">{results.dscr.toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Revenue:</span>
                          <span className="font-medium">${results.totalRevenue.toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Costs:</span>
                          <span className="font-medium">${results.totalCosts.toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Net Profit:</span>
                          <span className="font-medium text-green-600">${results.profit.toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cashflow">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Analysis</CardTitle>
                  <CardDescription>25-year project cash flow projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-500">Cash Flow Chart</p>
                      <p className="text-sm text-gray-400">Annual cash flows over project lifetime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sensitivity">
              <Card>
                <CardHeader>
                  <CardTitle>Sensitivity Analysis</CardTitle>
                  <CardDescription>Impact of key variables on project returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label>Tariff Sensitivity</Label>
                      <div className="mt-2 space-y-2">
                        <Slider
                          value={[projectInputs.tariff * 1000]}
                          onValueChange={(value) => handleInputChange("tariff", value[0] / 1000)}
                          max={150}
                          min={40}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>$0.04/kWh</span>
                          <span>Current: ${projectInputs.tariff.toFixed(3)}/kWh</span>
                          <span>$0.15/kWh</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>CAPEX Sensitivity</Label>
                      <div className="mt-2 space-y-2">
                        <Slider
                          value={[projectInputs.capex * 10]}
                          onValueChange={(value) => handleInputChange("capex", value[0] / 10)}
                          max={25}
                          min={8}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>$0.8M/MW</span>
                          <span>Current: ${projectInputs.capex.toFixed(1)}M/MW</span>
                          <span>$2.5M/MW</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">IRR Range</p>
                        <p className="text-lg font-semibold">8.5% - 18.2%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">NPV Range</p>
                        <p className="text-lg font-semibold">-$5M - $65M</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">LCOE Range</p>
                        <p className="text-lg font-semibold">$0.055 - $0.095</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Analysis</CardTitle>
                  <CardDescription>Graphical representation of project metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BarChart3 className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-500">Revenue vs Costs</p>
                      </div>
                    </div>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <TrendingUp className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-500">IRR Waterfall</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
