"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import ImageResize from "../tiptap-resize-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { Selection, Placeholder } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/mathematics-node/mathematics-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  ColorTextPopover,
  ColorTextPopoverContent,
  ColorTextPopoverButton,
} from "@/components/tiptap-ui/color-text-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import TableDropDownMenu from "@/components/tiptap-ui/table-dropdown-menu/table-dropdown-menu";
import FontFamilyDropDown from "@/components/tiptap-ui/font-family-dropdown/font-family-dropdown";

// --- Icons ---
// import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { ArrowLeftIcon, BaselineIcon, GripVertical } from "lucide-react";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";
import "katex/dist/katex.min.css";

import "@/components/tiptap-ui/table-dropdown-menu/table-dropdown-menu.scss";

import { FontSizePicker } from "@/components/tiptap-ui/font-size/font-size-select";

const MainToolbarContent = ({
  onHighlighterClick,
  onTextColorClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onTextColorClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <div className="flex flex-wrap justify-center items-center">
        <ToolbarGroup>
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
          <ListDropdownMenu
            types={["bulletList", "orderedList", "taskList"]}
            portal={isMobile}
          />
          <BlockquoteButton />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <FontFamilyDropDown />
          <FontSizePicker />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="code" />
          <MarkButton type="underline" />
          {!isMobile ? (
            <ColorHighlightPopover />
          ) : (
            <ColorHighlightPopoverButton onClick={onHighlighterClick} />
          )}
          {!isMobile ? (
            <ColorTextPopover />
          ) : (
            <ColorTextPopoverButton onClick={onTextColorClick} />
          )}
          {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <MarkButton type="superscript" />
          <MarkButton type="subscript" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
          <TextAlignButton align="justify" />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ImageUploadButton />
          <TableDropDownMenu />
        </ToolbarGroup>
      </div>

      <Spacer />

      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "text-color" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : type === "text-color" ? (
          <BaselineIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : type === "text-color" ? (
      <ColorTextPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SimpleEditor({
  onChange,
  placeholder = "Start writing...",
  value,
}: RichTextEditorProps) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "text-color" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor pb-24",
        style: "padding-bottom: 15vh;",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextStyleKit,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      // Image.configure({
      //   allowBase64: true,
      // }),
      ImageResize.configure({
        allowBase64: true,
      }),
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 2,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      Placeholder.configure({ placeholder }),
      TableKit.configure({
        table: { resizable: true },
      }),
    ],
  });

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  React.useEffect(() => {
    console.log("isColorTextActive", editor?.isActive("color"));
    console.log("isTextColorActive", editor?.isActive("color"), {
      color: "#d34549",
    });
  }, [editor]);

  return (
    <div className="border shadow-cardHover rounded-lg bg-white overflow-hidden">
      <div className="w-full h-[70vh] md:h-124 overflow-hidden">
        <div className="w-full h-full overflow-auto">
          {editor && (
            <DragHandle editor={editor!} className="py-[3px] cursor-grab">
              <GripVertical size={18} />
            </DragHandle>
          )}
          <EditorContext.Provider value={{ editor }}>
            <Toolbar
              ref={toolbarRef}
              style={{
                ...(isMobile
                  ? {
                      bottom: `calc(100% - ${height - rect.y}px)`,
                    }
                  : {}),
              }}
            >
              {mobileView === "main" ? (
                <MainToolbarContent
                  onHighlighterClick={() => setMobileView("highlighter")}
                  onTextColorClick={() => setMobileView("text-color")}
                  onLinkClick={() => setMobileView("link")}
                  isMobile={isMobile}
                />
              ) : (
                <MobileToolbarContent
                  type={mobileView}
                  onBack={() => setMobileView("main")}
                />
              )}
            </Toolbar>

            <EditorContent
              editor={editor}
              role="presentation"
              className="simple-editor-content"
              style={{ maxWidth: 1080 }}
            />
          </EditorContext.Provider>
        </div>
      </div>
    </div>
  );
}
