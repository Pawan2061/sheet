import { Github } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className=" bottom-0  max-w-6xl mx-auto w-full bg-white border-t border-gray-200 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-gray-600 flex gap-3">
          Created by Pawan{" "}
          <a
            href="https://github.com/Pawan2061/sheet/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 hover:text-blue-300 transition-colors font-medium"
          >
            <Github />
          </a>
        </div>
        <div className="text-gray-600 font-medium">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </footer>
  );
}
