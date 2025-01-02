import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { LogOut } from "lucide-react";
import { authState } from "../recoil/store";

export default function Navbar() {
  const user = useRecoilValue(authState);
  console.log(user, "suer is ehr");
  console.log(user.user.user.username);

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
        {!user.isAuthenticated ? (
          <button
            onClick={() => {
              navigate("/join");
            }}
            className="text-[#777672] text-sm px-1 rounded-md duration-0 hover:bg-gray-200  py-2"
          >
            Login
          </button>
        ) : (
          <div className="flex">
            <h1 className="">{user.user.user.username}</h1>

            <LogOut
              color="blue"
              className="cursor-pointer"
              onClick={() => {
                useResetRecoilState(authState);
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
