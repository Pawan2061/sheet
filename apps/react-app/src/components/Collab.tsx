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
  File,
  Download,
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/store";
import { useNavigate } from "react-router-dom";

const Collab: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [sheetName, setSheetName] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const user = useRecoilValue(authState);
  console.log(userCount);

  if (!user) {
    navigate("/join");
  }

  useEffect(() => {
    const currentSheet = localStorage.getItem("sheet");
    setSheetName(currentSheet || "Untitled Sheet");

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { sheetId: currentSheet },
        })
      );
    };

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);

      switch (type) {
        case "init":
          if (payload.userCount !== undefined) {
            setUserCount(payload.userCount);
          }
          if (editorRef.current) {
            editorRef.current.innerHTML = payload.content || "";
          }
          setToastMessage(`${user.user.username} has joined!`);
          setShowToast(true);

          break;

        case "userJoined":
          setUserCount(payload.userCount);
          setToastMessage(`${payload.username} has joined!`);
          setShowToast(true);
          break;

        case "userLeft":
          setUserCount(payload.userCount);
          setToastMessage(`${payload.username} has left`);
          setShowToast(true);
          break;

        case "update":
          if (editorRef.current) {
            editorRef.current.innerHTML = payload.content || "";
          }
          break;
      }

      if (showToast) {
        setTimeout(() => setShowToast(false), 3000);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    websocketRef.current = ws;
    return () => ws.close();
  }, []);

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setIsSaving(true);

      websocketRef.current?.send(
        JSON.stringify({
          type: "update",
          payload: { sheetId: sheetName, content: newContent },
        })
      );

      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleExport = () => {
    try {
      if (!editorRef.current) return;

      const styledContent = `
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 20px;
            }
          </style>
        </head>
        <body>
          ${editorRef.current.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([styledContent], {
        type: "text/html;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sheetName || "document"}.html`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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

  const executeCommand = (
    command: string,
    value: string | undefined = undefined
  ) => {
    document.execCommand(command, false, value);
    handleContentChange();
    setSelectedFormat(command);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <File size={20} className="text-blue-500" />
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sheetName}
          </h1>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-lg transition-opacity duration-300">
          <p>{toastMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">Collaborative Editor</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
            <Users size={16} className="text-gray-600" />
            {/* <span className="text-sm text-gray-600">{userCount} online</span> */}
          </div>
          <div
            onClick={() => navigate("/")}
            className="rounded-xl bg-gray-100 cursor-pointer p-2 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </div>
        </div>
        <div className="flex items-center gap-4">
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
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-2 flex gap-2 flex-wrap">
          <button
            onClick={() => executeCommand("bold")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${selectedFormat === "bold" ? "shadow-lg underline" : ""}`}
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => executeCommand("italic")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${selectedFormat === "italic" ? "shadow-lg underline" : ""}`}
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => executeCommand("underline")}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${selectedFormat === "underline" ? "shadow-lg underline" : ""}`}
          >
            <Underline size={18} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => executeCommand("justifyLeft")}
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => executeCommand("justifyCenter")}
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => executeCommand("justifyRight")}
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
          >
            <AlignRight size={18} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <select
            onChange={(e) => executeCommand("fontSize", e.target.value)}
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
          >
            <option value="1">12px</option>
            <option value="3">16px</option>
            <option value="5">20px</option>
            <option value="7">24px</option>
            <option value="9">28px</option>
          </select>
          <input
            type="color"
            onChange={(e) => executeCommand("foreColor", e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>

        <div
          ref={editorRef}
          className="w-full px-4 py-3 min-h-[400px] focus:outline-none"
          contentEditable
          onInput={handleContentChange}
          style={{ fontFamily: "monospace" }}
        />
      </div>

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
