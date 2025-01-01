import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

const AIPromptModal = ({ isOpen, onClose, onSubmit }: AIPromptModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const placeholders = [
    "Explain quantum computing to a 5-year-old...",
    "Write a poem about artificial intelligence...",
    "Design a solution for reducing carbon emissions...",
    "Create a story about a robot learning to love...",
  ];

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      setTimeout(() => setMounted(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    console.log(prompt, "prompt is here");

    e.preventDefault();
    onSubmit(prompt);
    setPrompt("");
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "bg-opacity-50 backdrop-blur-sm" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Ask AI Assistant
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full h-32 p-4 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              autoFocus
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {prompt.length} characters
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIPromptModal;
