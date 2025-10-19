// components/tiptap-ui/font-button/font-button.tsx
"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";

export type FontType =
  | "Inter"
  | "Arial"
  | "Tahoma"
  | "Trebuchet MS"
  | "Verdana"
  | "Georgia"
  | "Times New Roman"
  | "Courier New"
  | "Brush Script MT"
  | "Impact"
  | "serif"
  | "sans-serif"
  | "monospace"
  | "cursive"
  | "fantasy"
  | "system-ui";

export interface FontButtonProps {
  editor?: Editor | null;
  type: FontType;
  text?: string;
  showTooltip?: boolean;
}

export function canToggleFont(editor: Editor | null, font: FontType): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.can().setFontFamily(getFontFamilyValue(font));
}

export function isFontActive(editor: Editor | null, font: FontType): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("textStyle", { fontFamily: getFontFamilyValue(font) });
}

function getFontFamilyValue(font: FontType): string {
  switch (font) {
    case "Inter":
      return "Inter";
    case "Arial":
      return "Arial";
    case "Tahoma":
      return "Tahoma";
    case "Trebuchet MS":
      return "Trebuchet MS";
    case "Verdana":
      return "Verdana";
    case "Georgia":
      return "Georgia";
    case "Times New Roman":
      return "'Times New Roman', Times";
    case "Courier New":
      return "'Courier New', Courier";
    case "Brush Script MT":
      return "Brush Script MT";
    case "Impact":
      return "Impact";
    case "serif":
      return "serif";
    case "sans-serif":
      return "sans-serif";
    case "monospace":
      return "monospace";
    case "cursive":
      return "cursive";
    case "fantasy":
      return "fantasy";
    case "system-ui":
      return "system-ui";
    default:
      return font;
  }
}

export function FontButton({
  editor: providedEditor,
  type,
  text,
  showTooltip = true,
}: FontButtonProps) {
  const { editor } = useTiptapEditor(providedEditor);

  const fontFamily = getFontFamilyValue(type);

  const isActive = isFontActive(editor, type);
  const canToggle = canToggleFont(editor, type);

  return (
    <Button
      type="button"
      data-style="ghost"
      data-active-state={isActive ? "on" : "off"}
      disabled={!canToggle}
      data-disabled={!canToggle}
      tooltip={showTooltip ? text || type : undefined}
      onClick={() => editor?.chain().focus().setFontFamily(fontFamily).run()}
      style={{ fontFamily }}
    >
      {text || type}
    </Button>
  );
}
