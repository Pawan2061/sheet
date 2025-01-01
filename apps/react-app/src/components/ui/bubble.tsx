import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import {
  Bold,
  Italic,
  Link,
  Strikethrough,
  Code,
  Highlighter,
  Book,
  Type,
  Eraser,
} from "lucide-react";
export const BubbleMenuTip = ({ editor }: any) => {
  if (!editor) {
    console.log("inside editor bruh");
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="w-full">
      <TiptapBubbleMenu
        editor={editor}
        tippyOptions={{ duration: 300 }}
        className="bg-white shadow-lg w-auto flex border border-gray-200 rounded-xl p-1 gap-1"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.commands.toggleStrike()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("strike") ? "bg-gray-200" : ""
          }`}
        >
          <Strikethrough size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("code") ? "bg-gray-200" : ""
          }`}
        >
          <Code size={16} />
        </button>
        <button
          onClick={addLink}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
        >
          <Link size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("highlight") ? "bg-gray-200" : ""
          }`}
        >
          <Highlighter size={16} />
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setFontFamily('"Comic Sans MS", "Comic Sans"')
              .run()
          }
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("textStyle", {
              fontFamily: '"Comic Sans MS", "Comic Sans"',
            })
              ? "bg-gray-200"
              : ""
          }`}
        >
          <Type size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setFontFamily("serif").run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("textStyle", { fontFamily: "serif" })
              ? "bg-gray-200"
              : ""
          }`}
        >
          <Book size={16} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().setFontFamily("monospace").run()
          }
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("textStyle", { fontFamily: "monospace" })
              ? "bg-gray-200"
              : ""
          }`}
        >
          <Code size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setFontFamily("cursive").run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("textStyle", { fontFamily: "cursive" })
              ? "bg-gray-200"
              : ""
          }`}
        >
          <Highlighter size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setFontFamily('"Exo 2"').run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("textStyle", { fontFamily: '"Exo 2"' })
              ? "bg-gray-200"
              : ""
          }`}
        >
          <Book size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetFontFamily().run()}
          className="p-1 rounded hover:bg-gray-100"
        >
          <Eraser size={16} />
        </button>
      </TiptapBubbleMenu>
    </div>
  );
};

export default BubbleMenuTip;
