"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Countries } from "@/components/countries-flags";
import { Building2, MapPin, Globe, Activity, Zap } from "lucide-react";
import type { Company } from "@/lib/types";
import { useLanguage } from "@/components/language-context";

interface OverviewTabProps {
  company: Company;
}

export function OverviewTab({ company }: OverviewTabProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{company.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Founded</h4>
                <p className="text-gray-600">
                  {company.foundingDate
                    ? new Date(company.foundingDate).getFullYear()
                    : "-"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Company Size</h4>
                <p className="text-gray-600">{company.size || "-"}</p>
              </div>
            </div>

            <Separator />

            {company.sectors?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Sectors</h4>
                <div className="flex flex-wrap gap-2">
                  {company.sectors.map((sector) => (
                    <Badge key={sector} variant="secondary">
                      {t(`common.sectors.${sector}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(company.activities ?? []).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Main Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {company.activities?.map((activity) => (
                    <Badge key={activity} variant="outline">
                      {t(`companies.activities.${activity}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {company.technologies?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Technology</h4>
                <div className="flex flex-wrap gap-2">
                  {company.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {t(`common.technologies.${tech}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Geographic Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Headquarters</h4>
              <p className="text-gray-600">{company.hqAddress}</p>
              {company.hqCountry && (
                <Countries countries={[company.hqCountry]} />
              )}
            </div>

            <Separator />

            {company.operatingCountries?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Operating Countries</h4>
                <Countries countries={company.operatingCountries} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Portfolio at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Portfolio
              </p>
              <p className="text-2xl font-bold">{company.portfolio?.total} MW</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                In Development
              </p>
              <p className="text-xl font-semibold">
                {company.portfolio?.inDevelopment} MW
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                In Construction
              </p>
              <p className="text-xl font-semibold text-akili-orange">
                {company.portfolio?.inConstruction} MW
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Operational
              </p>
              <p className="text-xl font-semibold text-green-600">
                {company.portfolio?.operational} MW
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
