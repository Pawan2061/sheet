import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { LogOut } from "lucide-react";
import { authState } from "../recoil/store";
import { useState } from "react";

export default function Navbar() {
  const user = useRecoilValue(authState);

  const resetAuth = useResetRecoilState(authState);
  const navigate = useNavigate();

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    resetAuth();
    navigate("/");
  };

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
        {!user.isAuthenticated ? (
          <button
            onClick={() => {
              navigate("/join");
            }}
            className="text-[#777672] text-sm px-1 rounded-md duration-0 hover:bg-gray-200 py-2"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium">{user.user?.username}</h1>
            <LogOut
              color="blue"
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-64">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                No
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
