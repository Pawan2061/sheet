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
import { Download, Film, Image as ImageIcon, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { BubbleMenuTip } from "./ui/bubble";
import { useParams } from "react-router-dom";
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
  const param = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State to track if the editor is empty
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const handleExport = () => {
    try {
      if (!editor) return;

      const content = editor.getHTML();

      const styledContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${param?.id || "Document"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 20px;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            iframe {
              width: 100%;
              aspect-ratio: 16/9;
              border: none;
              border-radius: 8px;
              margin: 1rem 0;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;

      const blob = new Blob([styledContent], {
        type: "text/html;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${param?.id || "document"}.html`;

      link.click();

      window.URL.revokeObjectURL(url);

      setToastMessage("Document exported successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage("Failed to export document. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

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
    const choice = window.prompt(
      "Type 'url' to paste an image URL or 'upload' to upload a local image."
    );

    if (choice?.toLowerCase() === "url") {
      const url = window.prompt("Enter image URL");
      if (url) {
        editor?.commands.setImage({ src: url });
      }
    } else if (choice?.toLowerCase() === "upload") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            editor?.commands.setImage({ src: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    }
  }, [editor]);

  const addVideo = useCallback(() => {
    const url = window.prompt("Enter YouTube URL");
    if (url) {
      editor?.commands.setYoutubeVideo({ src: url, width: 720, height: 405 });
    }
  }, [editor]);

  const handleContentChange = () => {
    if (editor) {
      const newContent = editor.getHTML();
      setIsEditorEmpty(newContent.trim() === "");
      if (newContent.trim() !== "") {
        setIsEditorEmpty(false);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-1"
            onClick={addImage}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Add Image</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-1"
            onClick={addVideo}
          >
            <Film className="w-4 h-4" />
            <span>Add Video</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-1"
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
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-1"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        {showToast && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-lg transition-opacity duration-300">
            <p>{toastMessage}</p>
          </div>
        )}

        <motion.div
          className="border rounded-lg p-4 min-h-[400px] bg-gray-50 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isEditorEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-gray-400">Start typing here...</span>
            </div>
          )}
          <EditorContent
            editor={editor}
            className="focus:outline-none p-4 text-lg leading-relaxed border border-gray-300 rounded-md shadow-sm bg-white"
            onInput={handleContentChange}
          />
          {editor && <BubbleMenuTip editor={editor} />}
        </motion.div>
      </div>
    </div>
  );
}
