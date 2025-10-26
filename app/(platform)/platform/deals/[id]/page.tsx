"use client";

import { getDealById } from "@/app/actions/deals";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Countries } from "@/components/countries-flags";
import { PlatformLink } from "@/components/platform-link";
import { TooltipText } from "@/components/tooltip-text";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEAL_ADVISORS, TECHNOLOGIES_SECTORS } from "@/lib/constants";
import {
  MergerAcquisition,
  Financing,
  PowerPurchaseAgreement,
  FetchDealResult,
} from "@/lib/types";
import {
  ArrowLeft,
  ExternalLink,
  Building2,
  Calendar,
  MapPin,
  Download,
  Zap,
  Users,
  FileText,
} from "lucide-react";
import { useParams } from "next/navigation";
import { SectorsIconsTooltip } from "@/components/sector-icon";
import { useLanguage } from "@/components/language-context";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();

  const router = useRouter();

  const { t } = useLanguage();

  const [deal, setDeal] = useState<FetchDealResult>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Redirect Project Updates to project pages
    startTransition(async () => {
      const dealDetail = await getDealById(params?.id ?? "");
      setDeal(dealDetail);

      if (
        dealDetail &&
        dealDetail.type === "project_update" &&
        dealDetail.assets?.length
      ) {
        router.push(`/platform/projects/${dealDetail.assets[0].id}`);
      }
    });
  }, [router]);

  if (!deal) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Deal not found</h1>
          <p className="text-gray-600 mt-2">
            The requested deal could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link href="/platform/deals">Back to Deals</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Render different layouts based on deal type
  const renderDealContent = () => {
    switch (deal.type) {
      case "merger_acquisition":
        return <MergerAcquisitionContent deal={deal as MergerAcquisition} />;
      case "financing":
        return <FinancingContent deal={deal as Financing} />;
      case "power_purchase_agreement":
        return (
          <PowerPurchaseAgreementContent
            deal={deal as PowerPurchaseAgreement}
          />
        );
      case "joint_venture":
        return <JointVentureContent deal={deal} />;
      default:
        return <DefaultDealContent deal={deal} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/platform/deals">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Deals
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deal.update}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{t(`deals.types.${deal.type}`)}</Badge>
              {/* <Badge variant="outline">{deal.dealStatus}</Badge> */}
            </div>
          </div>
        </div>
        {deal.pressReleaseUrl && (
          <Link href={deal.pressReleaseUrl} target="_blank">
            <Button>
              <ExternalLink className="w-4 h-4 mr-2" />
              Press Release
            </Button>
          </Link>
        )}
      </div>

      {renderDealContent()}
    </div>
  );
}

// M&A Deal Content Component
function MergerAcquisitionContent({
  deal: {
    assets,
    companies,
    documents,
    financials,
    mergerAcquisition,
    locations,
    ...deal
  },
}: {
  deal: MergerAcquisition;
}) {
  const { t } = useLanguage();

  const financial = financials?.[0];
  const ebitda = financial?.ebitda ? Number(financial.ebitda) : 0;
  const revenue = financial?.revenue ? Number(financial.revenue) : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Deal Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Deal Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Region of Target
                </label>
                <div>
                  <TooltipText
                    values={deal.regions.map((r) => t(`common.regions.${r}`))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Countries of the Target
                </label>
                <Countries countries={deal.countries} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Technology
                </label>
                <p className="font-medium">
                  {deal.technologies.length
                    ? deal.technologies
                        .map((tech) => t(`common.technologies.${tech}`))
                        .join(", ")
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Sub-sector
                </label>
                <p className="font-medium">
                  {deal.subSectors.length
                    ? deal.subSectors
                        .map((s) => {
                          t(`common.subSectors.${s}`);
                        })
                        .join(", ")
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Segment
                </label>
                <p className="font-medium">
                  {deal.segments.length
                    ? deal.segments
                        .map((s) => {
                          t(`common.segments.${s}`);
                        })
                        .join(", ")
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Targets */}
        <Card>
          <CardHeader>
            <CardTitle>Acquisition Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(deal.subtype === "asset" &&
                assets.map(
                  ({
                    id,
                    name,
                    capacity,
                    lifecycle,
                    maturity,
                    equityTransactedPercentage,
                  }) => (
                    <div key={id} className="border rounded-lg p-4">
                      <div className="grid md:grid-cols-5 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Asset Name
                          </label>
                          <PlatformLink data={{ id, name }} type="projects" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Capacity (MW)
                          </label>
                          <p className="font-medium">{capacity ?? "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Maturity (Years)
                          </label>
                          <p className="font-medium">{maturity ?? "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Lifecycle
                          </label>
                          <p className="font-medium">{lifecycle ?? "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Equity Transacted
                          </label>
                          <p className="font-medium">
                            {equityTransactedPercentage
                              ? `${equityTransactedPercentage}%`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )) ||
                (deal.subtype === "ma_corporate" &&
                  companies
                    .filter((c) => c.role === "acquisition_target")
                    .map(({ id, name, classification, hqCountry }) => (
                      <div key={id} className="border rounded-lg p-4">
                        <div className="grid md:grid-cols-5 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Company Name
                            </label>
                            <PlatformLink
                              data={{ id, name }}
                              type="companies"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Category
                            </label>
                            <p className="font-medium">
                              {classification
                                ? t(
                                    `companies.classification.${classification}`
                                  )
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              HQ Country
                            </label>
                            <div className="font-medium truncate line-clamp-1">
                              <Countries
                                countries={hqCountry ? [hqCountry] : []}
                                max={1}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Sector
                            </label>
                            <div className="font-medium  truncate line-clamp-1">
                              {deal.sectors.length > 0 ? (
                                <SectorsIconsTooltip sectors={deal.sectors} />
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Technology
                            </label>
                            <p className="font-medium truncate line-clamp-1">
                              {deal.technologies.length > 0
                                ? deal.technologies
                                    .map((tech) =>
                                      t(`common.technologies.${tech}`)
                                    )
                                    .join(", ")
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  On-/Off-Grid
                </label>
                <p className="font-medium">
                  {deal.onOffGrid !== null
                    ? `${deal.onOffGrid ? "On" : "Off"}-grid`
                    : deal.onOffGrid === null
                    ? "On-grid/Off-grid"
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Co-located Storage Capacity (MWh)
                </label>
                <p className="font-medium">
                  {deal.subtype === "asset" &&
                  assets.every(({ colocatedStorageCapacity }) =>
                    Boolean(colocatedStorageCapacity)
                  )
                    ? `${assets
                        .map(({ colocatedStorageCapacity }) =>
                          Number(colocatedStorageCapacity)
                        )
                        .filter(Boolean)
                        .reduce((acc, val) => acc! + val!, 0)}
                    `
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  M&A Type
                </label>
                <p className="font-medium">
                  {t(`deals.subtypes.${deal.subtype}`)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Structure
                </label>
                <p className="font-medium">
                  {t(`deals.ma.structures.${mergerAcquisition?.structure}`)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Deal Specifics
                </label>
                <p className="font-medium">
                  {mergerAcquisition.specifics
                    ?.map((s) => t(`deals.ma.specifics.${s}`))
                    .join(", ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Value ($M)
                </label>
                <p className="font-medium">{deal.amount ?? "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Metric ($M/MW)
                </label>
                <p className="font-medium">
                  {deal.amount &&
                  assets.some(({ capacity }) => Boolean(capacity))
                    ? `${(
                        deal.amount /
                        (assets
                          .map(({ capacity }) => capacity)
                          .filter(Boolean)
                          .reduce((acc, val) => acc! + val!, 0) ?? 1)
                      ).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Financing Strategy
                </label>
                <p className="font-medium">
                  {mergerAcquisition.financingStrategy
                    ?.map((s) => t(`deals.financing.types.${s}`))
                    .join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Offtaker
                </label>
                <PlatformLink
                  data={
                    companies.filter(({ role }) => role === "offtaker")?.[0]
                  }
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Buyer(s)
                </label>
                <PlatformLink
                  data={companies.filter(({ role }) => role === "buyer")}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Seller(s)
                </label>
                <PlatformLink
                  data={companies.filter(({ role }) => role === "seller")}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Financial Advisors
                </label>
                <PlatformLink
                  data={companies.filter(
                    ({ role }) => role === "financial_advisor"
                  )}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Technical Advisors
                </label>
                <PlatformLink
                  data={companies.filter(
                    ({ role }) => role === "technical_advisor"
                  )}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Legal Advisors
                </label>
                <PlatformLink
                  data={companies.filter(
                    ({ role }) => role === "legal_advisor"
                  )}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Lead Arrangers
                </label>
                <PlatformLink
                  data={companies.filter(
                    ({ role }) => role === "lead_arranger"
                  )}
                  type="companies"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mergerAcquisition.strategyRationale && (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Strategy Rationale
                  </h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: mergerAcquisition.strategyRationale.replaceAll(
                        "\n",
                        "<br/>"
                      ),
                    }}
                  />
                </div>
                <Separator />
              </>
            )}
            {deal.impacts && (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: deal.impacts.replaceAll("\n", "<br/>"),
                    }}
                  />
                </div>
                <Separator />
              </>
            )}
            {deal.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p
                  className="text-gray-700 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{
                    __html: deal.description.replaceAll("\n", "<br/>"),
                  }}
                />
              </div>
            )}
            {deal.insights && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: deal.insights.replaceAll("\n", "<br/>"),
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Deal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Deal Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date Announced
              </label>
              <p className="font-medium">
                {deal.announcementDate
                  ? deal.announcementDate.toLocaleDateString()
                  : "-"}
              </p>
            </div>
            {deal.completionDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date Completed
                </label>
                <p className="font-medium">
                  {deal.completionDate.toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 mr-2">
                Deal Status
              </label>
              <Badge variant="default">{mergerAcquisition.status}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Financials */}
        {financial && ebitda && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deal Financials ({financial.year})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  EV/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.enterpriseValue
                    ? `${(Number(financial.enterpriseValue) / ebitda).toFixed(
                        2
                      )}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Revenue/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.revenue
                    ? `${(Number(financial.revenue) / ebitda).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Net Debt/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.debt
                    ? `${(Number(financial.debt) / ebitda).toFixed(2)}`
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Deal Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Address: </span>
              </div>
            </div>
            <div className="mt-4 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {locations.length > 0 && (
                <Map
                  locations={
                    locations as { name: string; position: [number, number] }[]
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Financing Deal Content Component
function FinancingContent({
  deal: {
    companies,
    assets: [asset],
    financials,
    financing,
    locations,
    ...deal
  },
}: {
  deal: Financing;
}) {
  const { t } = useLanguage();

  const financial = financials?.[0];
  const ebitda = financial?.ebitda ? Number(financial.ebitda) : 0;
  const revenue = financial?.revenue ? Number(financial.revenue) : 0;
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Deal Description */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Company
                </label>
                <PlatformLink
                  data={companies.find(({ role }) => role === "financing")}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Regions of Operations
                </label>
                <div>
                  <TooltipText
                    values={deal.regions.map((r) => t(`common.regions.${r}`))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Countries of Operations
                </label>
                <Countries countries={deal.countries} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Project
                </label>
                <PlatformLink data={asset} type="projects" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Main Sector
                </label>
                <p className="font-medium">
                  {deal.sectors.length ? deal.sectors?.[0] : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Technology
                </label>
                <p className="font-medium">
                  {deal.technologies.length
                    ? deal.technologies
                        .map((tech) => t(`common.technologies.${tech}`))
                        .join(", ")
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Sub-sector
                </label>
                <p className="font-medium">
                  {deal.subSectors.length
                    ? deal.subSectors
                        .map((s) => {
                          t(`common.subSectors.${s}`);
                        })
                        .join(", ")
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Segment
                </label>
                <p className="font-medium">
                  {deal.segments.length ? deal.segments.join(", ") : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Capacity (MW)
                </label>
                <p className="font-medium">{asset?.capacity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Lifecycle
                </label>
                <p className="font-medium">{asset?.lifecycle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  On-/Off-Grid
                </label>
                <p className="font-medium">
                  {`${asset?.onOffGrid ? "On" : "Off"}-grid`}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Co-located Storage Capacity (MWh)
                </label>
                <p className="font-medium">{asset?.colocatedStorageCapacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="font-medium">{deal.date?.toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Value
                </label>
                <p className="font-medium">{deal.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Metric ($M/MW)
                </label>
                <p className="font-medium">
                  {deal.amount && asset?.capacity
                    ? `$${(deal.amount / asset?.capacity).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Investment Vehicle
                </label>
                <p className="font-medium">{financing.vehicle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Financing Objective
                </label>
                <p className="font-medium">
                  {t(`deals.financing.objectives.${financing.objective}`)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Financing Type
                </label>
                <p className="font-medium">
                  {financing.financingType
                    ?.map((type) => t(`deals.financing.types.${type}`))
                    .join(", ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Financing Subtype
                </label>
                <p className="font-medium">
                  {financing.financingSubtype
                    ?.map((s) => t(`deals.financing.subtypes.${s}`))
                    .join(", ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Advisors
                </label>
                <PlatformLink
                  data={companies.filter(({ role }) =>
                    DEAL_ADVISORS.includes(role)
                  )}
                  type="companies"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investors Details */}
        <Card>
          <CardHeader>
            <CardTitle>Investors Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies
                .filter(({ role }) => role === "investor")
                .map(({ id, name, investorType, commitment }) => (
                  <div key={id} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Company
                        </label>
                        <PlatformLink data={{ id, name }} type="companies" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Type
                        </label>
                        <p className="font-medium">{investorType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Commitment ($M)
                        </label>
                        <p className="font-medium">{commitment}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deal.impacts && (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: deal.impacts.replaceAll("\n", "<br/>"),
                    }}
                  />
                </div>
                <Separator className="my-4" />
              </>
            )}
            {deal.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p
                  className="text-gray-700 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{
                    __html: deal.description.replaceAll("\n", "<br/>"),
                  }}
                />
              </div>
            )}
            {deal.insights && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: deal.insights.replaceAll("\n", "<br/>"),
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Deal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date Announced
              </label>
              <p className="font-medium">
                {deal.announcementDate
                  ? deal.announcementDate.toLocaleDateString()
                  : "-"}
              </p>
            </div>
            {deal.completionDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date Completed
                </label>
                <p className="font-medium">
                  {deal.completionDate.toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 mr-2">
                Deal Status
              </label>
              <Badge variant="default">
                {deal.completionDate ? "Completed" : "Announced"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Financials */}
        {financial && ebitda && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deal Financials ({financial.year})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  EV/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.enterpriseValue
                    ? `${(Number(financial.enterpriseValue) / ebitda).toFixed(
                        2
                      )}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Revenue/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.revenue
                    ? `${(Number(financial.revenue) / ebitda).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Net Debt/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.debt
                    ? `${(Number(financial.debt) / ebitda).toFixed(2)}`
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Deal Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Address: </span>
              </div>
            </div>
            <div className="mt-4 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {locations.length > 0 && (
                <Map
                  locations={
                    locations as { name: string; position: [number, number] }[]
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        {deal.documents.length && (
          <Card>
            <CardHeader>
              <CardTitle>Existing Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deal.documents?.map((doc: any) => (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Published by {doc.publisher}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// PPA Deal Content Component
function PowerPurchaseAgreementContent({
  deal: {
    companies,
    assets,
    financials,
    powerPurchaseAgreement,
    locations,
    ...deal
  },
}: {
  deal: PowerPurchaseAgreement;
}) {
  const { t } = useLanguage();

  const financial = financials?.[0];
  const ebitda = financial?.ebitda ? Number(financial.ebitda) : 0;

  const sectors =
    deal.sectors.length > 0
      ? deal.sectors
      : deal.technologies
          .map((tech) => TECHNOLOGIES_SECTORS[tech]?.projectSector)
          .filter(Boolean);
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Deal Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Deal Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Region
                </label>
                <div>
                  <TooltipText
                    values={deal.regions.map((r) => t(`common.regions.${r}`))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Country
                </label>
                <Countries countries={deal.countries} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Sector
                </label>
                <div className="font-medium  truncate line-clamp-1">
                  {sectors.length > 0 ? (
                    sectors.map((s) => t(`common.sectors.${s}`)).join(", ")
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Technology
                </label>
                <p className="font-medium">
                  {deal.technologies.length
                    ? deal.technologies
                        .map((tech) => t(`common.technologies.${tech}`))
                        .join(", ")
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map(
                ({
                  id,
                  name,
                  // capacity,
                  lifecycle,
                }) => (
                  <div key={id} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Asset Name
                        </label>
                        <PlatformLink data={{ id, name }} type="projects" />
                      </div>
                      {/* <div>
                          <label className="text-sm font-medium text-gray-500">
                            Capacity (MW)
                          </label>
                          <p className="font-medium">{capacity ?? "-"}</p>
                        </div> */}
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Lifecycle
                        </label>
                        <p className="font-medium">{lifecycle ?? "-"}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <p className="font-medium">
                    {t(`deals.subtypes.${deal.subtype}`)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Onsite/Offsite PPA
                  </label>
                  <p className="font-medium">
                    {powerPurchaseAgreement.onOffSite === null
                      ? "-"
                      : powerPurchaseAgreement.onOffSite
                      ? "Onsite"
                      : "Offsite"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    PPA Duration (Years)
                  </label>
                  <p className="font-medium">
                    {powerPurchaseAgreement.duration ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    PPA Specific
                  </label>
                  <p className="font-medium">
                    {powerPurchaseAgreement.details === null
                      ? "-"
                      : powerPurchaseAgreement.details
                      ? "Long-term"
                      : "Short-term"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Generated Power Offtaken (GWh/Yr)
                  </label>
                  <p className="font-medium">
                    {powerPurchaseAgreement.generatedPower ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Capacity Off-taken (MW)
                  </label>
                  <p className="font-medium">
                    {powerPurchaseAgreement.capacity ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Offtaker(s)
                </label>
                <PlatformLink
                  data={
                    companies.filter(({ role }) => role === "offtaker")?.[0]
                  }
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Supplier(s)
                </label>
                <PlatformLink
                  data={companies.filter(({ role }) => role === "supplier")}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Grid Operator(s)
                </label>
                <PlatformLink
                  data={companies.filter(
                    ({ role }) => role === "grid_operator"
                  )}
                  type="companies"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Advisor(s)
                </label>
                <PlatformLink
                  data={companies.filter(({ role }) => role === "advisor")}
                  type="companies"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.map(({ id, name, role, companiesSectors }) => (
                <div key={id} className="border rounded-lg p-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Company
                      </label>
                      <PlatformLink data={{ id, name }} type="companies" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Role
                      </label>
                      <p className="font-medium">{role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Sector
                      </label>
                      <div className="font-medium  truncate line-clamp-1">
                        {companiesSectors.length > 0 ? (
                          <SectorsIconsTooltip
                            sectors={companiesSectors.map((s) => s.sector)}
                          />
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Deal Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deal.impacts && (
              <>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    SDG Impacts
                  </h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: deal.impacts.replaceAll("\n", "<br/>"),
                    }}
                  />
                </div>
                <Separator />
              </>
            )}
            {deal.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p
                  className="text-gray-700 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{
                    __html: deal.description.replaceAll("\n", "<br/>"),
                  }}
                />
              </div>
            )}
            {deal.insights && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
                  <p
                    className="text-gray-700 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: deal.insights.replaceAll("\n", "<br/>"),
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Deal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Deal Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Announcement Date
              </label>
              <p className="font-medium">
                {deal.announcementDate
                  ? deal.announcementDate.toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Asset Operational Date
              </label>
              <p className="font-medium">
                {powerPurchaseAgreement.assetOperationalDate?.toLocaleDateString() ??
                  "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Supply Start Date
              </label>
              <p className="font-medium">
                {powerPurchaseAgreement.supplyStart?.toLocaleDateString() ??
                  "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financials */}
        {financial && ebitda && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deal Financials ({financial.year})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  EV/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.enterpriseValue
                    ? `${(Number(financial.enterpriseValue) / ebitda).toFixed(
                        2
                      )}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Revenue/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.revenue
                    ? `${(Number(financial.revenue) / ebitda).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Net Debt/EBITDA
                </label>
                <p className="font-medium">
                  {financial && ebitda > 0 && financial.debt
                    ? `${(Number(financial.debt) / ebitda).toFixed(2)}`
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Deal Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Address: </span>
              </div>
            </div>
            <div className="mt-4 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {locations.length > 0 && (
                <Map
                  locations={
                    locations as { name: string; position: [number, number] }[]
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Joint Venture Deal Content Component
function JointVentureContent({ deal }: { deal: any }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Deal Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Deal Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Announcement Date
                </label>
                <p className="font-medium">{deal.announcementDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Region
                </label>
                <p className="font-medium">{deal.region}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Country
                </label>
                <p className="font-medium">{deal.country.join(", ")}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Asset Name
                </label>
                <p className="font-medium">{deal.assetName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Amount ($M)
                </label>
                <p className="font-medium text-green-600">${deal.dealValue}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Asset Capacity (MW)
                </label>
                <p className="font-medium">{deal.powerCapacity}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Technology
                </label>
                <p className="font-medium">{deal.sector.join(", ")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Asset Life-cycle
                </label>
                <p className="font-medium">{deal.assetLifecycle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Development Stage
                </label>
                <p className="font-medium">{deal.developmentStage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Details */}
        <Card>
          <CardHeader>
            <CardTitle>Partnership Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Partnership Objectives
                </label>
                <div className="flex flex-wrap gap-2">
                  {deal.partnershipObjectives?.map(
                    (objective: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {objective}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">
                  Partners
                </label>
                <div className="space-y-3">
                  {deal.partners?.map((partner: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Partner Name
                          </label>
                          <p className="font-medium">{partner.name}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Stake
                          </label>
                          <p className="font-medium">{partner.stake}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Role
                          </label>
                          <p className="font-medium">{partner.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <p
                className="text-gray-700 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{
                  __html: deal.description.replaceAll("\n", "<br/>"),
                }}
              />
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
              <p
                className="text-gray-700 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{
                  __html: deal.insights.replaceAll("\n", "<br/>"),
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Deal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Deal Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Announced Date
              </label>
              <p className="font-medium">{deal.announcementDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Completed Date
              </label>
              <p className="font-medium">{deal.completionDate || "Pending"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Deal Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">City: {deal.city}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  Country: {deal.country.join(", ")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Existing Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                No additional documentation available
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Default Deal Content Component
function DefaultDealContent({ deal }: { deal: any }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{deal.dealSummary}</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="font-medium">{deal.dealStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="font-medium">{deal.announcementDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
