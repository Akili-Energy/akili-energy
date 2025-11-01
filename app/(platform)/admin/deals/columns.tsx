"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Countries } from "@/components/countries-flags";
import { SectorsIconsTooltip } from "@/components/sector-icon";
import { TooltipText } from "@/components/tooltip-text";
import { deleteDeal } from "@/app/actions/deals";
import { useLanguage } from "@/components/language-context";
import type { FetchDealsResults } from "@/lib/types";

// Define the type for a single row of data
export type Deal = FetchDealsResults[number];

const DEAL_TYPE_COLORS: Record<Deal["type"], string> = {
  merger_acquisition: "bg-blue-100 text-blue-800 border-blue-200",
  financing: "bg-green-100 text-green-800 border-green-200",
  project_update: "bg-orange-100 text-orange-800 border-orange-200",
  power_purchase_agreement: "bg-purple-100 text-purple-800 border-purple-200",
  joint_venture: "bg-gray-100 text-gray-800 border-gray-200",
};

const arrayFilterFn: FilterFn<Deal> = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId) as string[];
  if (!rowValue || !Array.isArray(rowValue) || rowValue.length === 0) {
    return false;
  }
  // If the filter has values, check for intersection.
  return filterValue.some((val: string) => rowValue.includes(val));
};

export const columns: ColumnDef<Deal>[] = [
  // 1. Row Selection Checkbox
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. Deal Update Column (with Sorting)
  {
    accessorKey: "update",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deal Update" />
    ),
    cell: ({ row }) => (
      <div className="font-medium line-clamp-2">{row.getValue("update")}</div>
    ),
  },

  // 3. Asset Name Column
  {
    accessorKey: "assets",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset(s)" />
    ),
    cell: ({ row }) => {
      const assets = row.original.assets;
      return (
        <div className="max-w-[150px]">
          <TooltipText values={assets.map((a) => a.name)} />
        </div>
      );
    },
  },

  // 4. Sector Column
  {
    accessorKey: "sectors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sector(s)" />
    ),
    cell: ({ row }) => <SectorsIconsTooltip sectors={row.original.sectors} />,
    filterFn: arrayFilterFn,
  },

  {
    accessorKey: "regions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region(s)" />
    ),
    cell: ({ row }) => {
      const { t } = useLanguage();
      return (
        <TooltipText
          values={row.original.regions.map((r) => t(`common.regions.${r}`))}
        />
      );
    },
    filterFn: arrayFilterFn,
  },

  // 5. Country Column
  {
    accessorKey: "countries",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Countries" />
    ),
    cell: ({ row }) => <Countries countries={row.original.countries} max={3} />,
    filterFn: arrayFilterFn,
  },

  // 6. Deal Type Column
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const { t } = useLanguage();
      const type = row.original.type;
      return (
        <Badge className={DEAL_TYPE_COLORS[type]}>
          {t(`deals.types.${type}`)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "subtype",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subtype" />
    ),
    cell: ({ row }) => {
      const { t } = useLanguage();
      const subtype = row.original.subtype;
      return (
        <div className="text-gray-600 dark:text-gray-400 truncate">
          {!!subtype && t(`deals.subtypes.${subtype}`)}
        </div>
      );
    },
  },

  // 7. Amount Column
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount ($M)" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      if (isNaN(amount)) return <div className="text-right">-</div>;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        // currency: row.getValue<string>("currency")?.toUpperCase() ?? "USD",
        currency: "USD",
      }).format(amount);

      // Return just the number part, as the header specifies ($M)
      return (
        <div className="text-right font-medium">
          {formatted.replace("$", "")}
        </div>
      );
    },
  },

  // 8. Date Column
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>
    ),
  },

  // 9. Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const deal = row.original;

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this deal?")) return;

        toast.promise(deleteDeal(deal.id), {
          loading: "Deleting deal...",
          success: (res) => {
            // You might want to trigger a refresh here
            return res.message;
          },
          error: (err) => err.message,
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 data-[state=open]:bg-muted size-8"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/platform/deals/${deal.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/deals/${deal.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
