"use client";

import { getDeals } from "@/app/actions/deals";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useLanguage } from "@/components/language-context";
import { countryCode, dealSubtype, dealType, geographicRegion } from "@/lib/db/schema";
import { SECTORS } from "@/lib/constants";
import { FetchDealsResults } from "@/lib/types";
import { useState, useTransition, useEffect } from "react";

export default function AdminDealsPage() {
  const { t } = useLanguage();

  const dealFilters = [
    {
      column: "regions",
      title: "Region",
      options: geographicRegion.enumValues.map((region) => ({
        label: t(`common.regions.${region}`),
        value: region,
      })),
    },
    {
      column: "countries",
      title: "Country",
      options: countryCode.enumValues.map((country) => ({
        label: t(`common.countries.${country}`),
        value: country,
      })),
    },
    {
      column: "type",
      title: "Type",
      options: dealType.enumValues.map((type) => ({
        label: t(`deals.types.${type}`),
        value: type,
      })),
    },
    {
      column: "subtype",
      title: "Subtype",
      options: dealSubtype.enumValues.map((subtype) => ({
        label: t(`deals.subtypes.${subtype}`),
        value: subtype,
      })),
    },
    {
      column: "sectors",
      title: "Sector",
      options: SECTORS.map((sector) => ({
        label: t(`common.sectors.${sector}`),
        value: sector,
      })),
    },
  ];
  
  const [deals, setDeals] = useState<FetchDealsResults>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const { deals: allDeals } = await getDeals({ pageSize: 1000 });
      setDeals(
        allDeals.toSorted((a, b) => b.date.getTime() - a.date.getTime())
      );
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deals Management</h1>
          <p className="text-muted-foreground">
            View, create, and manage all energy deals and transactions.
          </p>
        </div>
        {/* <Button asChild>
          <Link href="/admin/deals/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Link>
        </Button> */}
      </div>

      {/* The DataTable component now handles everything else */}
      <DataTable columns={columns} data={deals} filters={dealFilters} searchField="update" label="deals" />
    </div>
  );
}
