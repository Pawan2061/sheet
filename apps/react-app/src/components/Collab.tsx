import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Wifi,
  WifiOff,
  Save,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  File,
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { authState, sheetState } from "../recoil/store";
import { useNavigate } from "react-router-dom";

const Collab: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [sheetName, setSheetName] = useState<string>("");
  const [textStyles, setTextStyles] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textAlign: "left",
    fontSize: "16px",
    color: "#000000",
  });

  const user = useRecoilValue(authState);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  if (!user) {
    navigate("/join");
  }

  useEffect(() => {
    const currentSheet = localStorage.getItem("sheet");
    setSheetName(currentSheet || "Untitled Sheet");

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
      setUserCount((prev) => prev + 1);
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { sheetId: currentSheet },
        })
      );
    };

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === "init" || type === "update") {
        setToastMessage(`${user.user.username} has joined!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setContent(payload.content || "");
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setUserCount((prev) => Math.max(0, prev - 1));
    };

    ws.onerror = () => {
      setIsConnected(false);
      setUserCount((prev) => Math.max(0, prev - 1));
    };

    websocketRef.current = ws;
    return () => ws.close();
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsSaving(true);

    websocketRef.current?.send(
      JSON.stringify({
        type: "update",
        payload: { sheetId: sheetName, content: newContent },
      })
    );

    setTimeout(() => setIsSaving(false), 500);
  };

  const toggleStyle = (style: keyof typeof textStyles) => {
    setTextStyles((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
    textAreaRef.current?.focus();
  };

  const changeFontSize = (size: string) => {
    setTextStyles((prev) => ({ ...prev, fontSize: size }));
    textAreaRef.current?.focus();
  };

  const changeTextColor = (color: string) => {
    setTextStyles((prev) => ({ ...prev, color }));
    textAreaRef.current?.focus();
  };

  const setTextAlign = (align: string) => {
    setTextStyles((prev) => ({ ...prev, textAlign: align }));
    textAreaRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Sheet Name Display */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <File size={20} className="text-blue-500" />
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sheetName}
          </h1>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-lg transition-opacity duration-300">
          <p>{toastMessage}</p>
        </div>
      )}

      {/* Editor Header */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Collaborative Editor</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
            <Users size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">{userCount} online</span>
          </div>
          <div
            onClick={() => navigate("/")}
            className="rounded-xl bg-gray-100 cursor-pointer p-2 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
          {isConnected ? (
            <Wifi className="text-green-500" size={16} />
          ) : (
            <WifiOff className="text-red-500" size={16} />
          )}
          <span className="text-sm font-medium">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Editor Body */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Toolbar */}
        <div className="border-b border-gray-200 px-4 py-2 flex gap-2">
          <button
            onClick={() => toggleStyle("isBold")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${
              textStyles.isBold ? "bg-gray-100" : ""
            }`}
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => toggleStyle("isItalic")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${
              textStyles.isItalic ? "bg-gray-100" : ""
            }`}
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => toggleStyle("isUnderline")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${
              textStyles.isUnderline ? "bg-gray-100" : ""
            }`}
          >
            <Underline size={18} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => setTextAlign("left")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${
              textStyles.textAlign === "left" ? "bg-gray-100" : ""
            }`}
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => setTextAlign("center")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${
              textStyles.textAlign === "center" ? "bg-gray-100" : ""
            }`}
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => setTextAlign("right")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${
              textStyles.textAlign === "right" ? "bg-gray-100" : ""
            }`}
          >
            <AlignRight size={18} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <select
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
            value={textStyles.fontSize}
          >
            <option value="12px">12px</option>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
          <input
            type="color"
            onChange={(e) => changeTextColor(e.target.value)}
            value={textStyles.color}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>

        {/* Text Editor */}
        <div ref={editorRef} className="relative">
          <textarea
            ref={textAreaRef}
            className="w-full px-4 py-3 resize-none focus:outline-none min-h-[400px] font-mono"
            value={content}
            onChange={handleContentChange}
            placeholder="Start typing here..."
            style={{
              fontWeight: textStyles.isBold ? "bold" : "normal",
              fontStyle: textStyles.isItalic ? "italic" : "normal",
              textDecoration: textStyles.isUnderline ? "underline" : "none",
              textAlign: textStyles.textAlign as "left" | "center" | "right",
              fontSize: textStyles.fontSize,
              color: textStyles.color,
            }}
          />
        </div>
      </div>

      {/* Saving Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Save size={16} className="animate-spin" />
          <span>Saving...</span>
        </div>
      )}
    </div>
  );
};

export default Collab;
