import { Editor } from "@tiptap/react";
import React from "react";
import { useFontSize } from "./use-font-size";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

interface FontSizePickerProps {
  editor?: Editor;
}

export const FontSizePicker: React.FC<FontSizePickerProps> = ({
  editor: providedEditor,
}) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { FONT_SIZES, selectedFontSize, setFontSize } = useFontSize(editor);

  return (
    <div className="flex items-center">
        <Select
          value={selectedFontSize}
          onValueChange={(value) => setFontSize(value)}
          // className="h-full w-24 shrink-0 bg-transparent px-1 text-center text-sm hover:bg-muted"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replaceAll("px", "")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    </div>
  );
};
