import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { authenticate, isLoading, error } = useAuth(mode);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await authenticate(email, password);
      if (success) {
        setSuccessMessage(
          `Successfully ${mode === "signup" ? "signed up" : "logged in"}`
        );
        navigate("/");
        toast(`Successfully ${mode === "signup" ? "signed up" : "logged in"}`);
      } else {
        setSuccessMessage("");
      }
    } catch (err) {
      console.error(`${mode} error:`, err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      className="flex w-1/3 flex-col mx-auto gap-5 text-center"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center text-xl mb-10">
        {mode === "signup" ? "Sign Up" : "Login"}
      </h1>
      <div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className="input"
          value={email}
          placeholder="Email"
        />
      </div>
      <div className="relative">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type={showPassword ? "text" : "password"}
          className="input"
          placeholder="Password"
        />
        <span
          className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <button disabled={isLoading} className="btn btn-green mx-auto">
        {mode === "signup" ? "Submit" : "Login"}
      </button>
      <p className="text-center">
        {mode === "signup"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <Link
          to={`/${mode === "signup" ? "login" : "signup"}`}
          className="underline text-blue-600"
        >
          {mode === "signup" ? "Login" : "Sign Up"}
        </Link>
      </p>
      {successMessage && <div>{successMessage}</div>}
      {error && <div>{error}</div>}
    </form>
  );
};

export default AuthForm;
