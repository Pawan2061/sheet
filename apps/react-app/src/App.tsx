import Navbar from "./components/Navbar";

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
