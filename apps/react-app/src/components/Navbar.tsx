import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("auth");
  const navigate = useNavigate();
  return (
    <nav className="p-5 flex justify-between">
      <div
        className="text-2xl font-semibold cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        tipTion
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/join");
          }}
          className="text-[#777672] text-sm px-1 rounded-md duration-0 hover:bg-gray-200  py-2"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
