"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { Grid3x3Icon } from "lucide-react";

// --- Lib ---
import { isNodeInSchema } from "@/lib/tiptap-utils";

/**
 * Configuration for the table functionality
 */
export interface UseTableConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Whether to hide the button when table insertion is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback function called after a table is inserted.
   */
  onInserted?: () => void;
}

/**
 * Checks if a table can be inserted in the current editor state
 */
export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true });
}

/**
 * Checks if a table is currently active/selected
 */
export function isTableActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("table");
}

/**
 * Inserts a table in the editor
 */
export function insertTable(
  editor: Editor | null,
  rows: number = 3,
  cols: number = 3,
  withHeaderRow: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertTable(editor)) return false;

  try {
    return editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow })
      .run();
  } catch {
    return false;
  }
}

/**
 * Determines if the table button should be shown
 */
export function shouldShowTableButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  const tableInSchema = isNodeInSchema("table", editor);
  if (!tableInSchema) return false;

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canInsertTable(editor);
  }

  return true;
}

/**
 * Custom hook that provides table functionality for Tiptap editor
 */
export function useTable(config?: UseTableConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState<boolean>(true);

  const canInsert = canInsertTable(editor);
  const isActive = isTableActive(editor);

  React.useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowTableButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleInsertTable = React.useCallback(
    (rows: number = 3, cols: number = 3, withHeaderRow: boolean = true) => {
      if (!editor) return false;

      const success = insertTable(editor, rows, cols, withHeaderRow);
      if (success) {
        onInserted?.();
      }
      return success;
    },
    [editor, onInserted]
  );

  const addColumnBefore = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().addColumnBefore().run();
  }, [editor]);

  const addColumnAfter = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().addColumnAfter().run();
  }, [editor]);

  const deleteColumn = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().deleteColumn().run();
  }, [editor]);

  const addRowBefore = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().addRowBefore().run();
  }, [editor]);

  const addRowAfter = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().addRowAfter().run();
  }, [editor]);

  const deleteRow = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().deleteRow().run();
  }, [editor]);

  const deleteTable = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().deleteTable().run();
  }, [editor]);

  const mergeCells = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().mergeCells().run();
  }, [editor]);

  const splitCell = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().splitCell().run();
  }, [editor]);

  const toggleHeaderRow = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().toggleHeaderRow().run();
  }, [editor]);

  const toggleHeaderColumn = React.useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().toggleHeaderColumn().run();
  }, [editor]);

  return {
    isVisible,
    isActive,
    canInsert,
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
    toggleHeaderRow,
    toggleHeaderColumn,
    label: "Table",
    Icon: Grid3x3Icon,
  };
}
