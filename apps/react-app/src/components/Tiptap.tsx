"use client";
import { useCallback } from "react";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Strike from "@tiptap/extension-strike";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";
import Bold from "@tiptap/extension-bold";
import Youtube from "@tiptap/extension-youtube";
import { debounce } from "lodash";
import { EditorContent, useEditor } from "@tiptap/react";
import { Film, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import BubbleMenuTip from "./ui/bubble";

const CustomYoutubeExtension = Youtube.configure({
  HTMLAttributes: {
    class: "w-full aspect-video rounded-lg shadow-lg my-4",
  },
  controls: true,
  nocookie: true,
  modestBranding: true,
  allowFullscreen: true,
});

export default function Tiptap() {
  const logContent = useCallback((e: Editor) => console.log(e.getJSON()), []);
  const editor = useEditor({
    extensions: [
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg shadow-lg max-w-full h-auto",
        },
      }),
      Text,
      Dropcursor,
      Heading.configure({
        levels: [1, 2, 3],
      }),

      Paragraph,
      Document,
      Strike,
      Bold,
      Code,

      Italic,

      Dropcursor,
      CustomYoutubeExtension,
    ],

    content: "",
    editorProps: {
      attributes: {
        spellcheck: "false",
        class:
          "focus:outline-none w-full prose prose-2xl sm:prose lg:prose-xl xl:prose-2xl max-w-none",
      },
    },
    onUpdate: debounce(({ editor: e }) => {
      logContent(e);
    }, 500),
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor?.commands.setImage({
        src: url,
      });
    }
  }, [editor]);

  const addVideo = useCallback(() => {
    const url = window.prompt("Enter YouTube URL");
    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 720,
        height: 405,
      });
    }
  }, [editor]);

  if (!editor) {
    console.log("inside the ediroo");

    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 ">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={addImage}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Add Image</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={addVideo}
          >
            <Film className="w-4 h-4" />
            <span>Add Video</span>
          </button>
          <button
            onClick={() => {
              console.log(editor.isActive);

              editor.chain().focus().setHeading({ level: 1 }).run();
            }}
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </button>
        </div>

        <motion.div
          className="border rounded-lg p-4 min-h-[400px] bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <EditorContent editor={editor} />
          {editor && <BubbleMenuTip editor={editor} />}
        </motion.div>
      </div>
    </div>
  );
}
