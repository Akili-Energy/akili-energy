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
import { deleteProject } from "@/app/actions/projects";
import { useLanguage } from "@/components/language-context";
import type { FetchProjectsResults, ProjectStage } from "@/lib/types";
import { PROJECT_STAGE_COLORS } from "@/lib/colors";

// Define the type for a single row of data
type Project = FetchProjectsResults[number];

const arrayFilterFn: FilterFn<Project> = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId) as string[];
  if (!rowValue || !Array.isArray(rowValue) || rowValue.length === 0) {
    return false;
  }
  // If the filter has values, check for intersection.
  return filterValue.some((val: string) => rowValue.includes(val));
};

export const columns: ColumnDef<Project>[] = [
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

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium line-clamp-2">{row.getValue("name")}</div>
    ),
  },

  {
    accessorKey: "sponsor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sponsor" />
    ),
    cell: ({ row }) => <div>{row.getValue("sponsor")}</div>,
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
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => {
      const { t } = useLanguage();
      return (
        <TooltipText
          values={
            row.original.region
              ? [t(`common.regions.${row.original.region}`)]
              : []
          }
        />
      );
    },
  },

  // 5. Country Column
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => (
      <Countries
        countries={row.original.country ? [row.original.country] : []}
        max={3}
      />
    ),
  },

  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ row }) => {
      const { t } = useLanguage();
      const stage = row.original.stage;
      return (
        <Badge className={PROJECT_STAGE_COLORS[stage as ProjectStage]}>
          {t(`projects.stages.${stage}`)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "plantCapacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity (MW)" />
    ),
    cell: ({ row }) => {
      const capacity = parseFloat(row.getValue("plantCapacity"));
      return <div className="text-right font-medium">{capacity ?? "-"}</div>;
    },
  },

  // 7. Amount Column
  {
    accessorKey: "investmentCosts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investment ($M)" />
    ),
    cell: ({ row }) => {
      row.original.investmentCosts;
      const investment = parseFloat(row.getValue("investmentCosts"));
      if (isNaN(investment)) return <div className="text-right">-</div>;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(investment);

      // Return just the number part, as the header specifies ($M)
      return (
        <div className="text-right font-medium">
          {formatted.replace("$", "")}
        </div>
      );
    },
  },

  // 9. Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        toast.promise(deleteProject(project.id), {
          loading: "Deleting project...",
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
              <Link href={`/platform/projects/${project.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/projects/${project.id}/edit`}>
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
