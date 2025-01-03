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
} from "lucide-react";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/store";
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
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
      setUserCount((prev) => prev + 1);
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { sheetId: "enfuen" },
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

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

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
        payload: { sheetId: "enfuen", content: newContent },
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
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-lg">
          <p>{toastMessage}</p>
        </div>
      )}
      <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Collaborative Editor</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
            <Users size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">{userCount} online</span>
          </div>
          <div
            onClick={() => navigate("/")}
            className="rounded-xl bg-gray-100 cursor-pointer"
          >
            <X />
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-2 flex gap-2">
          <button
            onClick={() => toggleStyle("isBold")}
            className="px-3 py-1 border rounded font-bold"
          >
            <Bold />
          </button>
          <button
            onClick={() => toggleStyle("isItalic")}
            className="px-3 py-1 border rounded italic"
          >
            <Italic />
          </button>
          <button
            onClick={() => toggleStyle("isUnderline")}
            className="px-3 py-1 border rounded underline"
          >
            <Underline />
          </button>
          <button
            onClick={() => setTextAlign("left")}
            className="px-3 py-1 border rounded"
          >
            <AlignLeft />
          </button>
          <button
            onClick={() => setTextAlign("center")}
            className="px-3 py-1 border rounded"
          >
            <AlignCenter />
          </button>
          <button
            onClick={() => setTextAlign("right")}
            className="px-3 py-1 border rounded"
          >
            <AlignRight />
          </button>
          <select
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-3 py-1 border rounded"
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
            className="w-8 h-8 border rounded"
          />
        </div>

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
    </div>
  );
};

export default Collab;
