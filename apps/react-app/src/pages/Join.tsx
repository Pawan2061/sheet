import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signup, login } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { authState } from "../recoil/store";
import { useRecoilState } from "recoil";

export default function Join() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [auth, setAuth] = useRecoilState(authState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(auth);

  const signupMutation = useMutation({
    mutationFn: signup,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      console.log(data, "datahere");
      const authData = {
        isAuthenticated: true,
        user: data.user,
      };
      setAuth(authData);
      localStorage.setItem("user", JSON.stringify(authData));

      navigate("/");
      setLoading(false);
    },
    onError: (error) => {
      setError("Can't sign up try again");
      console.log(error);
      setLoading(false);
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      const authData = {
        isAuthenticated: true,
        user: data,
      };
      setAuth(authData);
      localStorage.setItem("user", JSON.stringify(authData));

      navigate("/");
      setLoading(false);
    },
    onError: (error) => {
      setError("Can't login in try again");

      console.log(error);
      setLoading(false);
    },
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (isLogin) {
      console.log("logged in");

      loginMutation.mutate({ username, password });
    } else {
      signupMutation.mutate({ username, password });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl mb-6 text-gray-800 font-semibold">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`w-full py-3 ${loading ? "bg-gray-300" : "bg-slate-200"} text-gray-800 rounded-lg hover:bg-slate-300 transition duration-200`}
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </div>

          {/* New Button */}
          <div className="text-center">
            <button
              type="button"
              className="w-full py-3 bg-slate-200 text-gray-800 rounded-lg hover:bg-slate-300 transition duration-200"
              onClick={() => alert("New Action Clicked!")}
            >
              New Action
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600 cursor-pointer" onClick={toggleForm}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>
          <p className="text-red-500 cursor-pointer" onClick={toggleForm}>
            {error ? error : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
