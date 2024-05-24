import React from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuthBtn from "../components/OAuthBtn";

function SignUp() {
  const BASE_URL =
    import.meta.env.VITE_NODE_ENV === "development"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL;
  const [formData, setFormData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (isError) setIsError(false);
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setIsLoading(false);
      if (!data.success) {
        setIsError(true);
        return;
      }
      navigate("/sign-in");
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
    }
  };
  return (
    <div className="mx-auto p-3 mt-10">
      <h1 className="text-center font-semibold text-2xl py-3"> Sign Up</h1>
      <form
        className="flex justify-center items-center flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-50 rounded-lg py-2 px-2 outline-none w-full sm:w-[75%] lg:w-[35%] focus:outline-dashed"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Email Address"
          className="bg-slate-50 rounded-lg py-2 px-2 outline-none w-full sm:w-[75%] lg:w-[35%]"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-50 rounded-lg py-2 px-2 outline-none w-full sm:w-[75%] lg:w-[35%]"
          onChange={handleChange}
          required
        />
        <button
          className="bg-slate-700 rounded-lg p-3 w-full sm:w-[75%] lg:w-[35%] disabled:opacity-70 hover:opacity-95 uppercase text-white"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <OAuthBtn />

        <div>
          <p>
            Have an account?{" "}
            <Link
              to="/sign-in"
              className="underline hover:text-blue-500 cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </div>
        {isError && (
          <p className="text-red-500">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

export default SignUp;
