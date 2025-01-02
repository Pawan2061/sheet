import React, { useState, useEffect, useRef } from "react";
import { Users, Wifi, WifiOff, Save, X } from "lucide-react";
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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const user = useRecoilValue(authState);

  const textAreaRef: any = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  console.log(user.user.username, "user is me");
  const getStyles = () => {
    return {
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
    };
  };

  if (!user) {
    navigate("/join");
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
      console.log("here");

      setUserCount(userCount + 1);
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            sheetId: "enfuen",
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      console.log(type, "type s here and ");

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
        payload: {
          sheetId: "enfuen",
          content: newContent,
          user: {
            name: user?.user.username,
          },
        },
      })
    );

    setTimeout(() => setIsSaving(false), 500);
  };
  const handleBold = () => {
    setIsBold(!isBold);
    textAreaRef.current.focus();
  };

  const handleItalic = () => {
    setIsItalic(!isItalic);
    textAreaRef.current.focus();
  };
  const handleLeave = () => {
    navigate("/");

    console.log("leave");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform  -translate-x-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-lg">
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
            onClick={handleLeave}
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
        <div className="border-b border-gray-200 px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isSaving ? (
                <div className="flex items-center gap-1">
                  <Save size={14} className="animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Save size={14} />
                  Saved
                </div>
              )}
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
          </div>
        </div>

        <div ref={editorRef} className="relative">
          <textarea
            ref={textAreaRef}
            className="w-full px-4 py-3 resize-none focus:outline-none min-h-[400px] font-mono"
            value={content}
            onChange={handleContentChange}
            placeholder="Start typing here..."
            style={getStyles()}
          />
        </div>
      </div>
    </div>
  );
};

export default Collab;
