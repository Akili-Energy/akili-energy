import { Editor } from "@tiptap/react";
import { useCallback } from "react";

const FONT_SIZES = [
  "8px",
  "9px",
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
  "60px",
  "72px",
  "96px",
];

export const useFontSize = (editor: Editor | null) => {
  const selectedFontSize =
    FONT_SIZES.find((size) =>
      editor?.isActive("textStyle", { fontSize: size })
    ) || "16px";

  const setFontSize = useCallback(
    (fontSize: string) => {
      editor?.chain().focus().setFontSize(fontSize).run();
    },
    [editor]
  );

  const unsetFontSize = useCallback(() => {
    editor?.chain().focus().unsetFontSize().run();
  }, [editor]);

  return {
    FONT_SIZES,
    selectedFontSize,
    setFontSize,
    unsetFontSize,
  };
};
