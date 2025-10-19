// components/tiptap-ui/font-dropdown-menu/font-dropdown-menu.tsx
"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon";

// --- Tiptap UI ---
import { FontButton, type FontType } from "./font-family-button";
import { TypeIcon } from "lucide-react";

import { useFontDropdownMenu } from "./use-font-family";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button, ButtonGroup } from "@/components/tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/tiptap-ui-primitive/dropdown-menu";
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card";

export interface FontDropdownMenuProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor;
  /**
   * The font types to display in the dropdown.
   */
  types?: FontType[];
  /**
   * Whether the dropdown should be hidden when no font types are available
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to render the dropdown menu in a portal
   * @default false
   */
  portal?: boolean;
}

export function FontDropdownMenu({
  editor: providedEditor,
  types = [
    "Arial",
    "Brush Script MT",
    "Courier New",
    "Georgia",
    "Impact",
    "Inter",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "sans-serif",
    "serif",
    "cursive",
    "monospace",
    "fantasy",
    "system-ui",
  ],
  hideWhenUnavailable = false,
  onOpenChange,
  portal = false,
  ...props
}: FontDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);

  const { filteredFonts, canToggle, isActive, isVisible, label } =
    useFontDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    });

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  if (!isVisible || !editor || !editor.isEditable) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          data-active-state={isActive ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label="Font family options"
          tooltip="Font Family"
          {...props}
        >
          <TypeIcon className="tiptap-button-icon" />
          <span className="tiptap-button-text">{label}</span>
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" portal={portal}>
        <Card>
          <CardBody>
            <ButtonGroup>
              {filteredFonts.map((option) => (
                <DropdownMenuItem key={option.type} asChild>
                  <FontButton
                    editor={editor}
                    type={option.type}
                    text={option.label}
                    showTooltip={false}
                  />
                </DropdownMenuItem>
              ))}
            </ButtonGroup>
          </CardBody>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FontDropdownMenu;
