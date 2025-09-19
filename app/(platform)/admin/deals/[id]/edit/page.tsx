// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react"
// import { toast } from "sonner"
// import Link from "next/link"
// import { type Deal, DealsService } from "@/lib/models/deals"

// export default function EditDealPage() {
//   const params = useParams()
//   const router = useRouter()
//   const dealId = params.id as string

//   const [deal, setDeal] = useState<Deal | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [dealType, setDealType] = useState<string>("")
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({
//     description: true,
//     details: true,
//     financial: false,
//     advisors: false,
//     comments: false,
//   })

//   const [formData, setFormData] = useState({
//     title: "",
//     deal_type: "",
//     deal_status: "",
//     region: "",
//     country: "",
//     deal_value: "",
//     announced_date: "",
//     completed_date: "",
//     company_id: "",
//     project_id: "",
//   })

//   const dealTypes = ["M&A", "Financing", "JV", "PPA", "Project Update"]
//   const dealStatuses = ["Announced", "Completed", "Pending", "Cancelled"]

//   useEffect(() => {
//     loadDeal()
//   }, [dealId])

//   const loadDeal = async () => {
//     try {
//       const dealData = await DealsService.getById(dealId)
//       if (dealData) {
//         setDeal(dealData)
//         setFormData({
//           title: dealData.title,
//           deal_type: dealData.deal_type,
//           deal_status: dealData.deal_status,
//           region: dealData.region,
//           country: dealData.country,
//           deal_value: dealData.deal_value?.toString() || "",
//           announced_date: dealData.announced_date.split("T")[0],
//           completed_date: dealData.completed_date?.split("T")[0] || "",
//           company_id: dealData.company_id,
//           project_id: dealData.project_id || "",
//         })
//         setDealType(dealData.deal_type)
//       }
//     } catch (error) {
//       console.error("Error loading deal:", error)
//       toast.error("Failed to load deal")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleSection = (section: string) => {
//     setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       const updated = await DealsService.update(dealId, {
//         ...formData,
//         deal_value: formData.deal_value ? Number.parseFloat(formData.deal_value) : undefined,
//       })

//       if (updated) {
//         toast.success("Deal updated successfully")
//         router.push("/admin/deals")
//       } else {
//         toast.error("Failed to update deal")
//       }
//     } catch (error) {
//       toast.error("An error occurred")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     if (field === "deal_type") {
//       setDealType(value)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg">Loading deal...</div>
//       </div>
//     )
//   }

//   if (!deal) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-500">Deal not found</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex items-center space-x-4 mb-8">
//         <Button variant="ghost" size="sm" asChild>
//           <Link href="/admin/deals">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Deals
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-3xl font-bold">Edit Deal</h1>
//           <p className="text-muted-foreground">Update deal information</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Deal Description Section */}
//         <Card>
//           <Collapsible open={openSections.description} onOpenChange={() => toggleSection("description")}>
//             <CollapsibleTrigger asChild>
//               <CardHeader className="cursor-pointer hover:bg-muted/50">
//                 <CardTitle className="flex items-center justify-between">
//                   Deal Description
//                   {openSections.description ? (
//                     <ChevronDown className="h-4 w-4" />
//                   ) : (
//                     <ChevronRight className="h-4 w-4" />
//                   )}
//                 </CardTitle>
//               </CardHeader>
//             </CollapsibleTrigger>
//             <CollapsibleContent>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="title">Deal Title *</Label>
//                     <Input
//                       id="title"
//                       value={formData.title}
//                       onChange={(e) => handleInputChange("title", e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="deal_type">Deal Type *</Label>
//                     <Select value={formData.deal_type} onValueChange={(value) => handleInputChange("deal_type", value)}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select deal type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {dealTypes.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="deal_status">Deal Status</Label>
//                     <Select
//                       value={formData.deal_status}
//                       onValueChange={(value) => handleInputChange("deal_status", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {dealStatuses.map((status) => (
//                           <SelectItem key={status} value={status}>
//                             {status}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="region">Region</Label>
//                     <Input
//                       id="region"
//                       value={formData.region}
//                       onChange={(e) => handleInputChange("region", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="country">Country</Label>
//                     <Input
//                       id="country"
//                       value={formData.country}
//                       onChange={(e) => handleInputChange("country", e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </CollapsibleContent>
//           </Collapsible>
//         </Card>

//         {/* Financial Details Section */}
//         <Card>
//           <Collapsible open={openSections.financial} onOpenChange={() => toggleSection("financial")}>
//             <CollapsibleTrigger asChild>
//               <CardHeader className="cursor-pointer hover:bg-muted/50">
//                 <CardTitle className="flex items-center justify-between">
//                   Financial Details
//                   {openSections.financial ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
//                 </CardTitle>
//               </CardHeader>
//             </CollapsibleTrigger>
//             <CollapsibleContent>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="deal_value">Deal Value ($ million)</Label>
//                     <Input
//                       id="deal_value"
//                       type="number"
//                       value={formData.deal_value}
//                       onChange={(e) => handleInputChange("deal_value", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="announced_date">Announced Date</Label>
//                     <Input
//                       id="announced_date"
//                       type="date"
//                       value={formData.announced_date}
//                       onChange={(e) => handleInputChange("announced_date", e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="completed_date">Completed Date</Label>
//                     <Input
//                       id="completed_date"
//                       type="date"
//                       value={formData.completed_date}
//                       onChange={(e) => handleInputChange("completed_date", e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </CollapsibleContent>
//           </Collapsible>
//         </Card>

//         <div className="flex gap-4">
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Updating..." : "Update Deal"}
//           </Button>
//           <Button type="button" variant="outline" onClick={() => router.back()}>
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </div>
//   )
// }

export default function EditDealPage() {
    return <div>Test</div>
}