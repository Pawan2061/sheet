import React, { useState, useEffect, useRef } from "react";
import { Users, Wifi, WifiOff, Save } from "lucide-react";
import { debounce } from "lodash";

interface Message {
  type: "join" | "update";
  payload: {
    sheetId: string;
    content?: string;
    cursor?: number;
    user?: {
      name: string;
    };
  };
}

const Collab: React.FC = () => {
  const [content, setContent] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState({ name: "" });
  const [cursorPosition, setCursorPosition] = useState(null);
  const textAreaRef = useRef<HTMLTextAreaElement | any>();
  let debounceTimeout = useRef<any>(null);

  const sendCursorPosition = debounce((cursorPos) => {
    console.log("Cursor Position:", cursorPos);
  }, 300);

  const handleCursorMove = () => {
    const cursorPos = textAreaRef.current.selectionStart;
    setCursorPosition(cursorPos);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      sendCursorPosition(cursorPos);
    }, 300);
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setIsConnected(true);
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

      if (type === "init" || type === "update") {
        console.log("updating");
        setContent(payload.content || "");
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };
    ws.onerror = (error) => {
      console.log(error);
      setIsConnected(false);
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
        payload: {
          sheetId: "enfuen",
          content: newContent,
          cursor: cursorPosition,
          user: {
            name: user.name,
          },
        },
      })
    );

    setTimeout(() => setIsSaving(false), 500);
  };

  useEffect(() => {
    const textArea = textAreaRef.current;
    textArea.addEventListener("click", handleCursorMove);
    textArea.addEventListener("keyup", handleCursorMove);

    return () => {
      textArea.removeEventListener("click", handleCursorMove);
      textArea.removeEventListener("keyup", handleCursorMove);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Collaborative Editor</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
            <Users size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">3 online</span>
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
            {/* <div className="flex gap-2">
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                File
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                Edit
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                View
              </button>
            </div> */}
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
            </div>
          </div>
        </div>

        <textarea
          ref={textAreaRef}
          className="w-full px-4 py-3 resize-none focus:outline-none min-h-[400px]"
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing here..."
        />
      </div>
    </div>
  );
};

export default Collab;
