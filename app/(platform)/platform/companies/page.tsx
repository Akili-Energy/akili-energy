"use client";

import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";
import { getCompanies } from "@/app/actions/companies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, List, Grid3X3, FilterX, Loader2 } from "lucide-react";
import {
  companyClassification,
  companyOperatingStatus,
  companySector,
  countryCode,
} from "@/lib/db/schema";
import {
  FetchCompaniesResults,
  CompanyFilters,
  CompanyClassification,
  CompanySector,
  Country,
  Pagination,
  Cursor,
} from "@/lib/types";
import { Countries } from "@/components/countries-flags";
import { SectorsIconsTooltip } from "@/components/sector-icon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserRole } from "@/app/actions/auth";

const PAGE_SIZE = 12; // divisible by 3 for card view

export default function CompaniesPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const [companies, setCompanies] = useState<FetchCompaniesResults>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<CompanyFilters>({});
  const [cursors, setCursors] = useState<{ next?: Cursor; previous?: Cursor }>(
    {}
  );
  const [isGuestUser, setIsGuestUser] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await getUserRole();
      if (userRole === null || userRole === undefined) {
        toast.error("Invalid user. Please log in again.");
        router.replace("/login");
      }
      setIsGuestUser(userRole === "guest");
    };
    fetchUserRole();
  }, []);

  // Ref for the observer target element
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchCompanies = useCallback(
    (order?: Pagination, append = false) => {
      startTransition(async () => {
        // Determine the cursor to use based on the fetch order
        const cursor =
          order && companies.length > 0 ? cursors[order] : undefined;

        const {
          companies: fetchedCompanies,
          total: totalCount,
          nextCursor,
          prevCursor,
        } = (await getCompanies(filters, order, cursor, searchTerm, PAGE_SIZE))!;

        // Append new data or replace existing data
        if (append && order === "next") {
          setCompanies((prev) => [...prev, ...fetchedCompanies]);
        } else {
          setCompanies(fetchedCompanies);
        }

        setTotal(totalCount);
        setCursors({ next: nextCursor, previous: prevCursor });
      });
    },
    [searchTerm, filters, companies, cursors]
  );

  // Effect for initial load and when filters/search change
  useEffect(() => {
    // This fetches the first page and resets the list
    fetchCompanies();
  }, [filters, searchTerm]);

  // Effect for infinite scrolling
  useEffect(() => {
    if (viewMode !== "cards" || isPending || !cursors.next) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // If the observer target is visible, fetch more data
        if (entries[0].isIntersecting && !isPending && !isGuestUser) {
          fetchCompanies("next", true);
        }
      },
      { threshold: 1.0 } // Trigger when the element is fully visible
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    // Cleanup observer on component unmount or dependency change
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [
    viewMode,
    companies,
    cursors.next,
    isPending,
    isGuestUser,
    fetchCompanies,
  ]);

  const handleFilterChange = <K extends keyof CompanyFilters>(
    key: K,
    value: CompanyFilters[K] | "all"
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "all") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-akili-blue">Companies</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore energy companies and their portfolios across Africa
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine your search to find specific companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isGuestUser}
              />
            </div>
            <Select
              value={filters.classification || "all"}
              onValueChange={(v) =>
                handleFilterChange(
                  "classification",
                  v as CompanyClassification | "all"
                )
              }
              disabled={isGuestUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                {companyClassification.enumValues.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`companies.classification.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.sector || "all"}
              onValueChange={(v) =>
                handleFilterChange("sector", v as CompanySector | "all")
              }
              disabled={isGuestUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {companySector.enumValues.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`common.sectors.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.country || "all"}
              onValueChange={(v) =>
                handleFilterChange("country", v as Country | "all")
              }
              disabled={isGuestUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="HQ Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All HQ Countries</SelectItem>
                {countryCode.enumValues.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`common.countries.${c}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-akili-orange text-akili-orange hover:bg-akili-orange hover:text-white"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid/Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Companies ({total})</CardTitle>
              <CardDescription>Energy companies and developers</CardDescription>
            </div>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPending && companies.length === 0 && (
            <div className="text-center py-10">Loading companies...</div>
          )}
          {!isPending && companies.length === 0 && (
            <div className="text-center py-10">No companies found.</div>
          )}

          {/* Card View */}
          {viewMode === "cards" && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/platform/companies/${company.id}`}
                          className="hover:text-akili-blue transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={company.logoUrl || ""}
                                alt={company.name}
                                className="h-10 w-10 object-contain bg-muted"
                              />
                              <AvatarFallback>
                                {company.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <CardTitle className="cursor-pointer">
                              {company.name}
                            </CardTitle>
                          </div>
                        </Link>
                        {company.classification &&
                          company.classification.length > 0 && (
                            <Badge variant="outline">
                              {company.classification[0]}
                            </Badge>
                          )}
                      </div>
                      <CardDescription>
                        {company.hqCountry &&
                          t(`common.countries.${company.hqCountry}`)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {company.description}
                      </p>
                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {company.sectors.map((sector, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {t(`common.sectors.${sector}`)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Founded
                          </p>
                          <p className="font-medium">
                            {company.foundingDate?.getFullYear() || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Size
                          </p>
                          <p className="font-medium">{company.size || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Operating Countries
                          </p>
                          <Countries
                            countries={company.operatingCountries}
                            max={5}
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          {company.operatingStatus &&
                            company.operatingStatus.length > 0 && (
                              <Badge
                                variant={
                                  company.operatingStatus[0] === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {company.operatingStatus[0]}
                              </Badge>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end pt-4 border-t">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/platform/companies/${company.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Observer Target and Loading Indicator for Card View */}
              <div
                ref={observerRef}
                className="h-10 flex items-center justify-center"
              >
                {isPending && companies.length > 0 && (
                  <Loader2 className="h-8 w-8 animate-spin text-akili-blue" />
                )}
              </div>
            </>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Sectors</TableHead>
                    <TableHead>HQ Country</TableHead>
                    <TableHead>Operating In</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/platform/companies/${company.id}`}
                          className="hover:text-akili-blue transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={company.logoUrl || ""}
                                alt={company.name}
                                className="h-8 w-8 object-contain bg-muted"
                              />
                              <AvatarFallback>
                                {company.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="cursor-pointer">
                              {company.name}
                            </span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <SectorsIconsTooltip sectors={company.sectors} />
                      </TableCell>
                      <TableCell>
                        <Countries
                          countries={
                            company.hqCountry ? [company.hqCountry] : []
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Countries
                          countries={company.operatingCountries}
                          max={3}
                        />
                      </TableCell>
                      <TableCell>
                        {company.classification?.map((c) => (
                          <Badge key={c} variant="outline" className="mr-1">
                            {t(`companies.classification.${c}`)}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/platform/companies/${company.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls for Table View */}
          {viewMode === "table" && !isPending && companies.length > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-3 mt-6">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{companies.length}</span>{" "}
                of <span className="font-medium">{total}</span> results
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCompanies("previous")}
                  disabled={isPending || !cursors.previous || isGuestUser}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCompanies("next")}
                  disabled={isPending || !cursors.next || isGuestUser}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
