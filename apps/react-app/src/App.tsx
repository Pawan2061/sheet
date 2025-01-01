import Navbar from "./components/Navbar";

import Home from "./pages/Routes";

export default function App() {
  return (
    <main>
      <Navbar />

      <Home />
      {/* <EditorContent editor={editor} />
      {editor && <BubbleMenuTip editor={editor} />} */}
      {/* <BubbleMenuTip /> */}
      {/* <Join /> */}
    </main>
  );
}
