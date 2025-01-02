import Collab from "./components/Collab";
import Navbar from "./components/Navbar";
import StyledTextAreaEditor from "./components/ui/pawan";
import TextAreaEditor from "./components/ui/pawan";

import Home from "./pages/Routes";

export default function App() {
  return (
    <main>
      {/* <StyledTextAreaEditor /> */}
      <Navbar />

      <Home />
      {/* <Collab /> */}

      {/* <EditorContent editor={editor} />
      {editor && <BubbleMenuTip editor={editor} />} */}
      {/* <BubbleMenuTip /> */}
      {/* <Join /> */}
    </main>
  );
}
