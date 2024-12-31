const ButtonGroup = ({ editor }: any) => {
  console.log(editor, "edito");

  if (!editor) {
    return null;
  }

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-4 py-2 text-base font-medium ${
          editor.isActive("heading", { level: 1 })
            ? "bg-indigo-600 text-white"
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        } border border-gray-200 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-4 py-2 text-base font-medium ${
          editor.isActive("heading", { level: 2 })
            ? "bg-indigo-600 text-white"
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        } border-t border-b border-gray-200 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-4 py-2 text-base font-medium ${
          editor.isActive("heading", { level: 3 })
            ? "bg-indigo-600 text-white"
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        } border border-gray-200 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
      >
        H3
      </button>
    </div>
  );
};

export default ButtonGroup;
