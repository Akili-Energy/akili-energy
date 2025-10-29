"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, ExternalLink, Handshake } from "lucide-react";
import type { Company } from "@/lib/types";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";

interface DealsTabProps {
  deals: Company["deals"];
}

export function DealsTab({ deals }: DealsTabProps) {
  const { t } = useLanguage();

  const totalValue = deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Company Deals</h3>
          <p className="text-sm text-muted-foreground">
            {deals.length} deals associated with this company.
            {totalValue > 0 &&
              ` • Total disclosed value: $${totalValue.toFixed(2)}M`}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {deals.map((deal) => (
            <Card key={deal.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {deal.update}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {t(`deals.types.${deal.type}`)}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/platform/deals/${deal.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">Value</p>
                    <p className="font-semibold">
                      {deal.amount ? `$${deal.amount}M` : "Undisclosed"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">Date</p>
                    <p>
                      {deal.date
                        ? new Date(deal.date).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Company Role
                    </p>
                    <p className="capitalize">
                      {t(`companies.roles.deals.${deal.role}`)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
