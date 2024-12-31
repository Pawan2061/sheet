import { EditorContent, useEditor } from "@tiptap/react";
import Navbar from "./components/Navbar";
import BubbleMenuTip from "./components/ui/bubble";
import StarterKit from "@tiptap/starter-kit";
import Home from "./pages/Routes";
import Join from "./pages/Join";

export default function App() {
  return (
    <main>
      <Navbar />

      <Home />
      {/* <EditorContent editor={editor} />
      {editor && <BubbleMenuTip editor={editor} />} */}
      {/* <BubbleMenuTip /> */}
      <Join />
    </main>
  );
}
