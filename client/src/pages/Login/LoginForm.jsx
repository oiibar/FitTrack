import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "./useLogin";

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        setSuccessMessage("Successfully logged in");
        onSuccess();
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form
      className="flex w-1/3 flex-col mx-auto gap-5 text-center"
      onSubmit={handleSubmit}
    >
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        value={email}
        className="input"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="input"
        placeholder="Password"
      />
      <button disabled={isLoading} className="btn btn-green mx-auto">
        Login
      </button>

      <p>
        Doesn't have an account?{" "}
        <Link to="/signup" className="underline text-blue-600">
          Sign Up
        </Link>
      </p>

      {successMessage && <div>{successMessage}</div>}
      {error && <div className="">{error}</div>}
    </form>
  );
};

export default LoginForm;
