"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Company } from "@/lib/types";

interface TeamTabProps {
  team: Company["team"];
}

export function TeamTab({ team }: TeamTabProps) {
  if (!team || team.length === 0) {
    return (
       <div className="text-center py-10">
          <p className="text-muted-foreground">No team members listed for this company.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="flex items-start space-x-4 p-4 border rounded-lg bg-card text-card-foreground"
          >
            {/* We can add Avatars later if profile pictures are stored */}
            {/* <Avatar>
              <AvatarImage src={member.photoUrl} alt={member.name}/>
              <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
            </Avatar> */}
            <div className="flex-1">
              <h4 className="font-semibold">{member.name}</h4>
              {/* Note: Employee role is on the join table, not the employee table. 
                  This would require a data model adjustment to show here directly, 
                  or we can show a generic bio. */}
              {/* <p className="text-sm text-gray-600 mb-2">{member.role}</p> */}
              <p className="text-sm text-gray-500 mb-2">{member.about}</p>
              {member.linkedinProfile && (
                <Button variant="link" asChild className="p-0 h-auto">
                    <a
                        href={member.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center"
                    >
                        LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}