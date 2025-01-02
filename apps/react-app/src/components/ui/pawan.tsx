import React, { useState, useRef } from "react";

const StyledTextAreaEditor = () => {
  const textareaRef: any = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleBold = () => {
    setIsBold(!isBold);
    textareaRef.current.focus();
  };

  const handleItalic = () => {
    setIsItalic(!isItalic);
    textareaRef.current.focus();
  };

  // Generate dynamic styles based on state
  const getStyles = () => {
    return {
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 bg-gray-100 border border-b-0 rounded-t-lg">
        <button
          onClick={handleBold}
          className={`px-3 py-1 border rounded hover:bg-gray-50 font-bold
            ${isBold ? "bg-blue-100" : "bg-white"}`}
        >
          B
        </button>
        <button
          onClick={handleItalic}
          className={`px-3 py-1 border rounded hover:bg-gray-50 italic
            ${isItalic ? "bg-blue-100" : "bg-white"}`}
        >
          I
        </button>
      </div>

      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        style={getStyles()}
        className="w-full min-h-[200px] p-4 border rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default StyledTextAreaEditor;
