"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import { useHotkeys } from "react-hotkeys-hook";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { useIsMobile } from "@/hooks/use-mobile";

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from "@/lib/tiptap-utils";

// --- Icons ---
import { Baseline } from "lucide-react";

export const COLOR_TEXT_SHORTCUT_KEY = "mod+shift+t";
export const TEXT_COLORS = [
  {
    label: "Default text",
    value: "var(--black)",
    border: "var(--white)",
  },
  {
    label: "Gray text",
    value: "var(--tt-color-text-gray)",
    border: "var(--tt-color-text-gray-contrast)",
  },
  {
    label: "Brown text",
    value: "var(--tt-color-text-brown)",
    border: "var(--tt-color-text-brown-contrast)",
  },
  {
    label: "Orange text",
    value: "var(--tt-color-text-orange)",
    border: "var(--tt-color-text-orange-contrast)",
  },
  {
    label: "Yellow text",
    value: "var(--tt-color-text-yellow)",
    border: "var(--tt-color-text-yellow-contrast)",
  },
  {
    label: "Green text",
    value: "var(--tt-color-text-green)",
    border: "var(--tt-color-text-green-contrast)",
  },
  {
    label: "Blue text",
    value: "var(--tt-color-text-blue)",
    border: "var(--tt-color-text-blue-contrast)",
  },
  {
    label: "Purple text",
    value: "var(--tt-color-text-purple)",
    border: "var(--tt-color-text-purple-contrast)",
  },
  {
    label: "Pink text",
    value: "var(--tt-color-text-pink)",
    border: "var(--tt-color-text-pink-contrast)",
  },
  {
    label: "Red text",
    value: "var(--tt-color-text-red)",
    border: "var(--tt-color-text-red-contrast)",
  },
];
export type TextColor = (typeof TEXT_COLORS)[number];

/**
 * Configuration for the color text functionality
 */
export interface UseColorTextConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * The text color to apply when toggling.
   */
  textColor?: string;
  /**
   * Optional label to display alongside the icon.
   */
  label?: string;
  /**
   * Whether the button should hide when the mark is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Called when the text color is applied.
   */
  onApplied?: ({ color, label }: { color: string; label: string }) => void;
}

export function pickTextColorsByValue(values: string[]) {
  const colorMap = new Map(TEXT_COLORS.map((color) => [color.value, color]));
  return values
    .map((value) => colorMap.get(value))
    .filter((color): color is (typeof TEXT_COLORS)[number] => !!color);
}

export function canColorText(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (
    !isMarkInSchema("textStyle", editor) ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false;

  return editor.can().setColor("#808080");
}

export function isColorTextActive(
  editor: Editor | null,
  textColor?: string
): boolean {
  if (!editor || !editor.isEditable) return false;
  return textColor
    ? editor.isActive("textStyle", { color: textColor })
    : editor.isActive("textStyle");
}

export function removeTextColor(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canColorText(editor)) return false;

  return editor.chain().focus().unsetColor().run();
}


export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;
  if (!isMarkInSchema("textStyle", editor)) return false;

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canColorText(editor);
  }

  return true;
}

export function useColorText(config: UseColorTextConfig) {
  const {
    editor: providedEditor,
    label,
    textColor,
    hideWhenUnavailable = false,
    onApplied,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = React.useState<boolean>(true);
  const canColorTextState = canColorText(editor);
  const isActive = isColorTextActive(editor, textColor);

  React.useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleColorText = React.useCallback(() => {
    if (!editor || !canColorTextState || !textColor || !label) return false;

    if (editor.state.storedMarks) {
      const textStyleMarkType = editor.schema.marks.textStyle;
      if (textStyleMarkType) {
        editor.view.dispatch(
          editor.state.tr.removeStoredMark(textStyleMarkType)
        );
      }
    }

    setTimeout(() => {
      const success = editor.chain().focus().setColor(textColor).run();
      if (success) {
        onApplied?.({ color: textColor, label });
      }
      return success;
    }, 0);
  }, [canColorTextState, textColor, editor, label, onApplied]);

  const handleRemoveTextColor = React.useCallback(() => {
    const success = removeTextColor(editor);
    if (success) {
      onApplied?.({ color: "", label: "Remove text color" });
    }
    return success;
  }, [editor, onApplied]);

  useHotkeys(
    COLOR_TEXT_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleColorText();
    },
    {
      enabled: isVisible && canColorTextState,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  );

  return {
    isVisible,
    isActive,
    handleColorText,
    handleRemoveTextColor,
    canColorText: canColorTextState,
    label: label || `Text color`,
    shortcutKeys: COLOR_TEXT_SHORTCUT_KEY,
    Icon: Baseline,
  };
}
