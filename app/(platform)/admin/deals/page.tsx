"use client";
import { deleteDeal, getDeals } from "@/app/actions/deals";
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
import {
  Search,
  FilterX,
  ExternalLink,
  Eye,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useLanguage } from "@/components/language-context";
import { Countries } from "@/components/countries-flags";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

const DEAL_TYPE_COLORS: Record<DealType, string> = {
  merger_acquisition: "bg-blue-100 text-blue-800 border-blue-200",
  financing: "bg-green-100 text-green-800 border-green-200",
  project_update: "bg-orange-100 text-orange-800 border-orange-200",
  power_purchase_agreement: "bg-purple-100 text-purple-800 border-purple-200",
  joint_venture: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function AdminDealsPage() {
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

  const fetchDeals = useCallback(
    (newFilter?: DealFilters, order?: Pagination) =>
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
        setCurrentPage((prev) =>
          order === "previous"
            ? Math.max(1, prev - 1)
            : order === "next"
            ? Math.min(Math.ceil(total / DEFAULT_PAGE_SIZE), prev + 1)
            : 1
        );
        setFilters((prev) => ({
          ...prev,
          ...newFilter,
        }));
      }),
    [filters, debouncedSearchTerm]
  );

  useEffect(() => {
    fetchDeals();
  }, [debouncedSearchTerm]);

  const filteredDeals = deals.filter(
    ({ regions, countries }) =>
      (selectedRegion ? regions.includes(selectedRegion) : true) &&
      (selectedCountry ? countries.includes(selectedCountry) : true)
  );

  const onRegionChange = (value: string) => {
    const region = value === "all" ? undefined : (value as Region);
    setSelectedRegion(region);
    if (
      region &&
      !REGIONS_COUNTRIES[region].includes(selectedCountry as Country)
    ) {
      setSelectedCountry(undefined);
    }
  };

  const onCountryChange = (value: string) => {
    const country = value === "all" ? undefined : (value as Country);
    setSelectedCountry(country);
    for (const key in REGIONS_COUNTRIES) {
      const region = key as Region;
      if (
        country &&
        REGIONS_COUNTRIES[region].includes(country) &&
        selectedRegion !== region
      ) {
        setSelectedRegion(region);
      }
    }
  };

  const onDealTypeChange = async (value: string) => {
    const dealType = value === "all" ? undefined : (value as DealType);
    await fetchDeals({
      type: dealType,
      subtype:
        dealType &&
        !DEAL_TYPES_SUBTYPES[dealType].includes(filters?.subtype as DealSubtype)
          ? undefined
          : filters?.subtype,
    });
  };

  const onDealSubtypeChange = async (value: string) => {
    const dealSubtype = value === "all" ? undefined : (value as DealSubtype);
    await fetchDeals({
      subtype: dealSubtype,
      type:
        (Object.keys(DEAL_TYPES_SUBTYPES).find(
          (key) =>
            dealSubtype &&
            DEAL_TYPES_SUBTYPES[key as DealType].includes(dealSubtype) &&
            filters?.type !== key
        ) as DealType) ?? filters?.type,
    });
  };

  const resetFilters = async () => {
    setSearchTerm("");
    setSelectedRegion(undefined);
    setSelectedCountry(undefined);
    await fetchDeals({
      sector: undefined,
      type: undefined,
      subtype: undefined,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      const { message, success } = await deleteDeal(id);
      await fetchDeals();
      toast[success ? "success" : "error"](message);
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deals Management</h1>
          <p className="text-muted-foreground">
            Manage energy deals and transactions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/deals/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Link>
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m-6">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedRegion ?? "all"}
            onValueChange={onRegionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {geographicRegion.enumValues.map((region) => (
                <SelectItem key={region} value={region}>
                  {t(`common.regions.${region}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedCountry ?? "all"}
            onValueChange={onCountryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
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
          <Select
            value={filters?.type ?? "all"}
            onValueChange={onDealTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Deal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deal Types</SelectItem>
              {dealType.enumValues.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`deals.types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters?.subtype ?? "all"}
            onValueChange={onDealSubtypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Deal Subtype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deal Subtypes</SelectItem>
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
            value={filters?.sector ?? "all"}
            onValueChange={(value) =>
              fetchDeals({
                sector: value === "all" ? undefined : (value as Sector),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
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
      </Card>

      {/* Deals Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto pt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px] sticky left-0 bg-background z-20 border-r">
                    Deal Update
                  </TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Sector</TableHead>
                  {/* <TableHead>Region</TableHead> */}
                  <TableHead>Country</TableHead>
                  <TableHead>Deal Type</TableHead>
                  <TableHead>Deal Sub-Type</TableHead>
                  <TableHead>Amount ($M)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="sticky right-0 bg-background z-20 border-l"></TableHead>
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
                      <TableCell className="max-w-xs sticky left-0 bg-background z-10 border-r">
                        <div className="line-clamp-2 font-medium cursor-pointer">
                          {update}
                          {type === "project_update" && (
                            <ExternalLink className="w-3 h-3 inline ml-1" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <TooltipText values={assets.map((a) => a.name)} />
                      </TableCell>
                      <TableCell>
                        <SectorsIconsTooltip sectors={sectors} />
                      </TableCell>
                      {/* <TableCell>
                        <TooltipText
                          values={regions.map((r) => t(`common.regions.${r}`))}0
                        />
                      </TableCell> */}
                      <TableCell className="truncate">
                        <Countries countries={countries} max={3} />
                      </TableCell>
                      <TableCell className="truncate">
                        <Badge className={DEAL_TYPE_COLORS[type]}>
                          {t(`deals.types.${type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400 truncate">
                        {!!subtype && t(`deals.subtypes.${subtype}`)}
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
                      <TableCell className="text-right flex justify-end gap-1 sticky right-0 bg-background z-10 border-l">
                        <Button variant="ghost" size="sm" asChild>
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
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/deals/${id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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
