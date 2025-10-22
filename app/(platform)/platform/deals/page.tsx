"use client";
import { getDeals } from "@/app/actions/deals";
import { SectorsIconsTooltip } from "@/components/sector-icon";
import { TooltipText } from "@/components/tooltip-text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  SECTORS,
  REGIONS_COUNTRIES,
  DEAL_TYPES_SUBTYPES,
  DEFAULT_PAGE_SIZE,
} from "@/lib/constants";
import {
  geographicRegion,
  countryCode,
  dealType,
  dealSubtype,
} from "@/lib/db/schema";
import {
  FetchDealsResults,
  Sector,
  Region,
  Country,
  DealType,
  DealSubtype,
  Pagination,
  DealFilters,
} from "@/lib/types";
import { Search, FilterX, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useLanguage } from "@/components/language-context";
import { Countries } from "@/components/countries-flags";
import { useDebounce } from "@/hooks/use-debounce";

const DEAL_TYPE_COLORS: Record<DealType, string> = {
  merger_acquisition: "bg-blue-100 text-blue-800 border-blue-200",
  financing: "bg-green-100 text-green-800 border-green-200",
  project_update: "bg-orange-100 text-orange-800 border-orange-200",
  power_purchase_agreement: "bg-purple-100 text-purple-800 border-purple-200",
  joint_venture: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function DealsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [deals, setDeals] = useState<FetchDealsResults>([]);
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region>();
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<DealFilters>();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchDeals = (newFilter?: DealFilters, order?: Pagination) =>
    startTransition(async () => {
      const { deals: allDeals, total } = await getDeals({
        filters: { ...filters, ...newFilter },
        order,
        cursor:
          deals.length > 0
            ? order === "previous"
              ? deals[0].date
              : deals[deals.length - 1].date
            : undefined,
        search: debouncedSearchTerm,
      });
      setDeals(
        allDeals.toSorted((a, b) => b.date.getTime() - a.date.getTime())
      );
      setCount(total);
      setCurrentPage(
        order === "previous"
          ? Math.max(1, currentPage - 1)
          : order === "next"
          ? Math.min(Math.ceil(total / DEFAULT_PAGE_SIZE), currentPage + 1)
          : 1
      );
      setFilters((prev) => ({
        ...prev,
        ...(newFilter ?? {}),
      }));
    });

  useEffect(() => {
    fetchDeals();
  }, [debouncedSearchTerm]);

  const filteredDeals = deals.filter(
    ({ regions, countries }) =>
      (selectedRegion ? regions.includes(selectedRegion) : true) &&
      (selectedCountry ? countries.includes(selectedCountry) : true)
  );

  const handleDealClick = ({
    id,
    type,
    assets,
  }: Partial<FetchDealsResults[number]>) => {
    // If it's a Project Update and has a projectId, redirect to project page
    if (type === "project_update" && assets?.length && assets[0]?.id) {
      router.push(`/platform/projects/${assets[0].id}`);
    } else {
      // Otherwise go to deal detail page
      router.push(`/platform/deals/${id}`);
    }
  };

  const onRegionChange = (value: string) => {
    const region = value as Region;
    setSelectedRegion(region);
    if (!REGIONS_COUNTRIES[region].includes(selectedCountry as Country)) {
      setSelectedCountry(undefined);
    }
  };

  const onCountryChange = (value: string) => {
    const country = value as Country;
    setSelectedCountry(country);
    for (const key in REGIONS_COUNTRIES) {
      const region = key as Region;
      if (
        REGIONS_COUNTRIES[region].includes(country) &&
        selectedRegion !== region
      ) {
        setSelectedRegion(region);
      }
    }
  };

  const onDealTypeChange = async (value: string) => {
    const dealType = value as DealType;
    await fetchDeals({ type: dealType });
    setFilters((prev) => ({
      ...prev,
      type: dealType,
      subtype: !DEAL_TYPES_SUBTYPES[dealType].includes(
        prev?.subtype as DealSubtype
      )
        ? undefined
        : prev?.subtype,
    }));
  };

  const onDealSubtypeChange = async (value: string) => {
    const subtype = value as DealSubtype;
    await fetchDeals({ subtype });
    setFilters((prev) => ({
      ...prev,
      subtype,
      type:
        (Object.keys(DEAL_TYPES_SUBTYPES).find(
          (key) =>
            DEAL_TYPES_SUBTYPES[key as DealType].includes(subtype) &&
            prev?.type !== key
        ) as DealType) ?? prev?.type,
    }));
  };

  const resetFilters = async () => {
    setSearchTerm("");
    setFilters({});
    setSelectedRegion(undefined);
    setSelectedCountry(undefined);
    await fetchDeals(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-akili-blue">Deals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track M&A, financing, and project updates across Africa's energy
            sector
          </p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine your search to find specific deals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {geographicRegion.enumValues.map((region) => (
                  <SelectItem key={region} value={region}>
                    {t(`common.regions.${region}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={onCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {(selectedRegion
                  ? REGIONS_COUNTRIES[selectedRegion]
                  : countryCode.enumValues
                )
                  .toSorted()
                  .map((country, index) => (
                    <SelectItem key={index} value={country}>
                      {t(`common.countries.${country}`)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={filters?.type} onValueChange={onDealTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Deal Type" />
              </SelectTrigger>
              <SelectContent>
                {dealType.enumValues.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`deals.types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters?.subtype}
              onValueChange={onDealSubtypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Deal Subtype" />
              </SelectTrigger>
              <SelectContent>
                {(filters?.type
                  ? DEAL_TYPES_SUBTYPES[filters?.type]
                  : dealSubtype.enumValues
                ).map((subtype) => (
                  <SelectItem key={subtype} value={subtype}>
                    {t(`deals.subtypes.${subtype}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters?.sector}
              onValueChange={(value) => fetchDeals({ sector: value as Sector })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {t(`common.sectors.${sector}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-akili-orange text-akili-orange hover:bg-akili-orange hover:text-white"
              onClick={resetFilters}
            >
              <FilterX className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals ({filteredDeals.length})</CardTitle>
          <CardDescription>
            Showing {filteredDeals.length} of {count} latest transactions and
            updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">Deal Update</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Deal Type</TableHead>
                  <TableHead>Deal Sub-Type</TableHead>
                  <TableHead>Amount ($M)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredDeals.map(
                  ({
                    id,
                    update,
                    type,
                    subtype,
                    amount,
                    currency,
                    date,
                    regions,
                    countries,
                    sectors,
                    assets,
                  }) => (
                    <TableRow
                      key={id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="max-w-xs">
                        <Link
                          href={`/platform/${
                            type === "project_update" &&
                            assets.length &&
                            assets[0].id
                              ? `projects/${assets[0].id}`
                              : `deals/${id}`
                          }`}
                          className="hover:text-blue-800 transition-colors"
                        >
                          <div className="line-clamp-2 font-medium cursor-pointer">
                            {update}
                            {type === "project_update" && (
                              <ExternalLink className="w-3 h-3 inline ml-1" />
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <TooltipText values={assets.map((a) => a.name)} />
                      </TableCell>
                      <TableCell>
                        <SectorsIconsTooltip sectors={sectors} />
                      </TableCell>
                      <TableCell>
                        <TooltipText
                          values={regions.map((r) => t(`common.regions.${r}`))}
                        />
                      </TableCell>
                      <TableCell className="truncate">
                        <Countries countries={countries} max={3} />
                      </TableCell>
                      <TableCell className="truncate">
                        <Badge className={DEAL_TYPE_COLORS[type]}>
                          {t(`deals.types.${type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {t(`deals.subtypes.${subtype}`)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {amount &&
                          `${amount}${
                            currency?.toLowerCase() !== "usd"
                              ? `M${currency}`
                              : ""
                          }`}
                      </TableCell>
                      <TableCell>{date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDealClick({ id, type, assets })}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchDeals(undefined, "previous")}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchDeals(undefined, "next")}
                  disabled={
                    currentPage === Math.ceil(count / DEFAULT_PAGE_SIZE)
                  }
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * DEFAULT_PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * DEFAULT_PAGE_SIZE, count)}
                  </span>{" "}
                  of <span className="font-medium">{count}</span> results
                </p>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDeals(undefined, "previous")}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDeals(undefined, "next")}
                    disabled={
                      currentPage === Math.ceil(count / DEFAULT_PAGE_SIZE)
                    }
                    className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
