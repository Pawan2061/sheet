import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Sheet from "./Sheet";
import Join from "./Join";
import Collab from "../components/Collab";
export default function Home() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={<Join />} />

        <Route path="/:id" element={<Sheet />} />
        <Route path="/collab/:id" element={<Collab />} />
      </Routes>
    </div>
  );
}
