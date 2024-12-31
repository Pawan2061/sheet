import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signup, login } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Join() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log(data);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
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
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-2xl">
        <h2 className="text-center text-3xl mb-6 text-[#2a2821]">
          {isLogin ? "Welcome Back" : "Sign Up"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#777672] mb-2" htmlFor="email">
              Username
            </label>
            <input
              type="username"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-full p-3 border border-[#777672] rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-[#777672] mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-[#777672] rounded-lg"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-[#777672] text-white rounded-lg"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-[#777672] cursor-pointer" onClick={toggleForm}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}
