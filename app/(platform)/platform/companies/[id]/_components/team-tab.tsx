"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Linkedin } from "lucide-react"

interface TeamTabProps {
  companyId: string
}

export function TeamTab({ companyId }: TeamTabProps) {
  // Mock data - in real app, this would come from API
  const teamMembers = [
    {
      id: "1",
      name: "Sarah Johnson",
      position: "Chief Executive Officer",
      department: "Executive",
      experience: "15+ years",
      education: "MBA Stanford, BSc Engineering",
      email: "sarah.johnson@solartech.com",
      linkedin: "linkedin.com/in/sarahjohnson",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Experienced energy executive with a track record of scaling renewable energy companies across emerging markets.",
    },
    {
      id: "2",
      name: "Michael Chen",
      position: "Chief Technology Officer",
      department: "Technology",
      experience: "12+ years",
      education: "PhD Electrical Engineering MIT",
      email: "michael.chen@solartech.com",
      linkedin: "linkedin.com/in/michaelchen",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Technology leader specializing in solar energy systems and grid integration solutions.",
    },
    {
      id: "3",
      name: "Amara Okafor",
      position: "Chief Financial Officer",
      department: "Finance",
      experience: "10+ years",
      education: "CFA, MBA Wharton",
      email: "amara.okafor@solartech.com",
      linkedin: "linkedin.com/in/amaraokafor",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Finance professional with extensive experience in project finance and capital markets in Africa.",
    },
    {
      id: "4",
      name: "David Williams",
      position: "VP of Development",
      department: "Development",
      experience: "8+ years",
      education: "MSc Renewable Energy",
      email: "david.williams@solartech.com",
      linkedin: "linkedin.com/in/davidwilliams",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Project development expert with a focus on utility-scale solar and energy storage projects.",
    },
    {
      id: "5",
      name: "Lisa Patel",
      position: "Head of Operations",
      department: "Operations",
      experience: "9+ years",
      education: "BSc Industrial Engineering",
      email: "lisa.patel@solartech.com",
      linkedin: "linkedin.com/in/lisapatel",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Operations leader with expertise in managing large-scale renewable energy installations.",
    },
  ]

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Executive":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Technology":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Finance":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Development":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Operations":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Leadership Team</h3>
          <p className="text-sm text-muted-foreground">{teamMembers.length} key team members</p>
        </div>
      </div>

      <div className="grid gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xl font-semibold">{member.name}</h4>
                        <p className="text-lg text-muted-foreground">{member.position}</p>
                      </div>
                      <Badge className={getDepartmentColor(member.department)}>{member.department}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{member.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-sm text-muted-foreground">{member.education}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
