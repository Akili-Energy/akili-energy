"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Combine,
  Grid3x3Icon,
  Table,
  Trash2Icon,
  Ungroup,
  XIcon,
} from "lucide-react";

// --- Tiptap UI ---
import {
  type UseTableConfig,
  useTable,
} from "@/components/tiptap-ui/table-dropdown-menu/use-table-dropdown-menu";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Lib ---
import { cn } from "@/lib/utils";

interface TablePickerProps {
  onSelect: (rows: number, cols: number) => void;
}

function TablePicker({ onSelect }: TablePickerProps) {
  const [tablePicker, setTablePicker] = React.useState({
    grid: Array.from({ length: 8 }, () => Array.from({ length: 8 }).fill(0)),
    size: { colCount: 0, rowCount: 0 },
  });

  const onCellMove = (rowIndex: number, colIndex: number) => {
    const newGrid = [...tablePicker.grid];

    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j] =
          i >= 0 && i <= rowIndex && j >= 0 && j <= colIndex ? 1 : 0;
      }
    }

    setTablePicker({
      grid: newGrid,
      size: { colCount: colIndex + 1, rowCount: rowIndex + 1 },
    });
  };

  return (
    <div
      className="m-0 flex flex-col p-0"
      onClick={() => {
        onSelect(tablePicker.size.rowCount, tablePicker.size.colCount);
      }}
    >
      <div className="grid size-[130px] grid-cols-8 gap-0.5 p-1">
        {tablePicker.grid.map((rows, rowIndex) =>
          rows.map((value, columIndex) => {
            return (
              <div
                key={`(${rowIndex},${columIndex})`}
                className={cn(
                  "col-span-1 size-3 border border-solid bg-secondary transition-colors hover:bg-accent",
                  !!value && "bg-primary border-primary"
                )}
                onMouseMove={() => {
                  onCellMove(rowIndex, columIndex);
                }}
              />
            );
          })
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground py-1">
        {tablePicker.size.rowCount} x {tablePicker.size.colCount}
      </div>
    </div>
  );
}

export interface TableToolbarButtonProps
  extends Omit<ButtonProps, "type">,
    UseTableConfig {
  /**
   * Props for the dropdown menu.
   */
  dropdownProps?: DropdownMenuProps;
}

/**
 * Button component for table operations in a Tiptap editor.
 *
 * For custom button implementations, use the `useTable` hook instead.
 */
export const TableToolbarButton = React.forwardRef<
  HTMLButtonElement,
  TableToolbarButtonProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onInserted,
      dropdownProps,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [open, setOpen] = React.useState(false);

    const {
      isVisible,
      canInsert,
      isActive,
      handleInsertTable,
      addColumnBefore,
      addColumnAfter,
      deleteColumn,
      addRowBefore,
      addRowAfter,
      deleteRow,
      deleteTable,
      mergeCells,
      splitCell,
      label,
      Icon,
    } = useTable({
      editor,
      hideWhenUnavailable,
      onInserted,
    });

    const handleTableInsert = React.useCallback(
      (rows: number, cols: number) => {
        handleInsertTable(rows, cols, true);
        setOpen(false);
        editor?.commands.focus();
      },
      [handleInsertTable, editor]
    );

    const handleAction = React.useCallback(
      (action: () => boolean) => {
        action();
        editor?.commands.focus();
      },
      [editor]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        modal={false}
        {...dropdownProps}
      >
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={-1}
            disabled={!canInsert && !isActive}
            data-disabled={!canInsert && !isActive}
            aria-label={label}
            aria-pressed={isActive}
            tooltip={label}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <Icon className="tiptap-button-icon" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="flex w-[180px] min-w-0 flex-col"
          align="start"
        >
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <Grid3x3Icon className="size-4" />
                <span>Table</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="m-0 p-0">
                <TablePicker onSelect={handleTableInsert} />
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2" disabled={!isActive}>
                <div className="size-4" />
                <span>Cell</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  disabled={!editor?.can().mergeCells()}
                  onSelect={() => handleAction(mergeCells)}
                >
                  <Combine className="size-4" />
                  Merge cells
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  disabled={!editor?.can().splitCell()}
                  onSelect={() => handleAction(splitCell)}
                >
                  <Ungroup className="size-4" />
                  Split cell
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2" disabled={!isActive}>
                <div className="size-4" />
                <span>Row</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  onSelect={() => handleAction(addRowBefore)}
                >
                  <ArrowUp className="size-4" />
                  Insert row before
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  onSelect={() => handleAction(addRowAfter)}
                >
                  <ArrowDown className="size-4" />
                  Insert row after
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  onSelect={() => handleAction(deleteRow)}
                >
                  <XIcon className="size-4" />
                  Delete row
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2" disabled={!isActive}>
                <div className="size-4" />
                <span>Column</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  onSelect={() => handleAction(addColumnBefore)}
                >
                  <ArrowLeft className="size-4" />
                  Insert column before
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  onSelect={() => handleAction(addColumnAfter)}
                >
                  <ArrowRight className="size-4" />
                  Insert column after
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="min-w-[180px]"
                  onSelect={() => handleAction(deleteColumn)}
                >
                  <XIcon className="size-4" />
                  Delete column
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!isActive}
              onSelect={() => handleAction(deleteTable)}
            >
              <Trash2Icon className="size-4" />
              Delete table
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

TableToolbarButton.displayName = "TableToolbarButton";

export default TableToolbarButton;
