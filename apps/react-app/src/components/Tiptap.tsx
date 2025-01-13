import { useCallback, useState } from "react";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
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
import { Film, Image as ImageIcon, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { BubbleMenuTip } from "./ui/bubble";
import AIPromptModal from "./ui/prompt";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
  const [isOpen, setIsOpen] = useState(false);

  const logContent = useCallback((editor: Editor) => {
    console.log(editor.getJSON());
  }, []);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Code,
      Heading,
      Image,
      Dropcursor,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      CustomYoutubeExtension,
    ],
    content: "",
    editorProps: {
      attributes: {
        spellcheck: "false",
        class:
          "focus:outline-none w-full prose prose-2xl sm:prose h-full lg:prose-xl xl:prose-2xl max-w-none",
      },
    },
    onUpdate: debounce(({ editor }) => {
      logContent(editor);
    }, 500),
  });

  if (!editor) return null;
  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await axios.post("http://localhost:3001/ask", {
        prompt: prompt,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data, "data is here");
      console.log(data.response);

      editor?.commands.insertContent(data);
    },
    onError: (error) => {
      console.error("API Error:", error);
      editor?.commands.insertContent("Error: Failed to get AI response");
    },
  });
  const handlePromptSubmit = async (prompt: string) => {
    mutation.mutate(prompt);
    setIsOpen(false);
  };

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor?.commands.setImage({ src: url });
    }
  }, [editor]);

  const addVideo = useCallback(() => {
    const url = window.prompt("Enter YouTube URL");
    if (url) {
      editor?.commands.setYoutubeVideo({ src: url, width: 720, height: 405 });
    }
  }, [editor]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl shadow-2xl">
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <Wand2 className="w-4 h-4" />
            <span>Add AI Prompt</span>
          </button>
          <AIPromptModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handlePromptSubmit}
          />
        </div>

        <motion.div
          className="border rounded-lg p-4 min-h-[400px] bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EditorContent editor={editor} />
          {editor && <BubbleMenuTip editor={editor} />}
        </motion.div>
      </div>
    </div>
  );
}
