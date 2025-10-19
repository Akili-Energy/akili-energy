// components/tiptap-ui/font-dropdown-menu/use-font-dropdown-menu.ts
"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Lib ---
import { isMarkInSchema } from "@/lib/tiptap-utils";

// --- Tiptap UI ---
import {
  canToggleFont,
  isFontActive,
  type FontType,
} from "./font-family-button";

/**
 * Configuration for the font dropdown menu functionality
 */
export interface UseFontDropdownMenuConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * The font types to display in the dropdown.
   */
  types?: FontType[];
  /**
   * Whether the dropdown should be hidden when no font types are available
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

export interface FontOption {
  label: string;
  type: FontType;
}

export const fontOptions: FontOption[] = [
  { label: "Arial", type: "Arial" },
  { label: "Brush Script MT", type: "Brush Script MT" },
  { label: "Courier New", type: "Courier New" },
  { label: "Georgia", type: "Georgia" },
  { label: "Impact", type: "Impact" },
  { label: "Inter", type: "Inter" },
  { label: "Tahoma", type: "Tahoma" },
  { label: "Times New Roman", type: "Times New Roman" },
  { label: "Trebuchet MS", type: "Trebuchet MS" },
  { label: "Verdana", type: "Verdana" },
  { label: "Sans-Serif", type: "sans-serif" },
  { label: "Serif", type: "serif" },
  { label: "Monospace", type: "monospace" },
  { label: "Cursive", type: "cursive" },
  { label: "Fantasy", type: "fantasy" },
  { label: "System UI", type: "system-ui" },
];

export function canToggleAnyFont(
  editor: Editor | null,
  fontTypes: FontType[]
): boolean {
  if (!editor || !editor.isEditable) return false;
  return fontTypes.some((type) => canToggleFont(editor, type));
}

export function isAnyFontActive(
  editor: Editor | null,
  fontTypes: FontType[]
): boolean {
  if (!editor || !editor.isEditable) return false;
  return fontTypes.some((type) => isFontActive(editor, type));
}

export function getFilteredFontOptions(
  availableTypes: FontType[]
): typeof fontOptions {
  return fontOptions.filter(
    (option) => !option.type || availableTypes.includes(option.type)
  );
}

export function shouldShowFontDropdown(params: {
  editor: Editor | null;
  fontTypes: FontType[];
  hideWhenUnavailable: boolean;
  fontInSchema: boolean;
  canToggleAny: boolean;
}): boolean {
  const { editor, hideWhenUnavailable, fontInSchema, canToggleAny } = params;

  if (!fontInSchema || !editor) {
    return false;
  }

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleAny;
  }

  return true;
}

/**
 * Gets the currently active font type from the available types
 */
export function getActiveFontType(
  editor: Editor | null,
  availableTypes: FontType[]
): FontType | undefined {
  if (!editor || !editor.isEditable) return undefined;
  return availableTypes.find((type) => isFontActive(editor, type));
}

/**
 * Custom hook that provides font dropdown menu functionality for Tiptap editor
 */
export function useFontDropdownMenu(config?: UseFontDropdownMenuConfig) {
  const {
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
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState(false);

  const fontInSchema = isMarkInSchema("textStyle", editor);

  const filteredFonts = React.useMemo(
    () => getFilteredFontOptions(types),
    [types]
  );

  const canToggleAny = canToggleAnyFont(editor, types);
  const isAnyActive = isAnyFontActive(editor, types);
  const activeType = getActiveFontType(editor, types);
  const activeFont = filteredFonts.find((option) => option.type === activeType);

  React.useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowFontDropdown({
          editor,
          fontTypes: types,
          hideWhenUnavailable,
          fontInSchema,
          canToggleAny,
        })
      );
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [canToggleAny, editor, hideWhenUnavailable, fontInSchema, types]);

  return {
    isVisible,
    activeType,
    isActive: isAnyActive,
    canToggle: canToggleAny,
    types,
    filteredFonts,
    label: activeFont?.label || "Font",
  };
}
