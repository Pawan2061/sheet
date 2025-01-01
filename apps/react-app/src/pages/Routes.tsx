import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Sheet from "./Sheet";
import Join from "./Join";
export default function Home() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={<Join />} />

        <Route path="/:id" element={<Sheet />} />
      </Routes>
    </div>
  );
}
