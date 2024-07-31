import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      console.log("Login success:", success);
      if (success) {
        setSuccessMessage("Successfully signed up");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
        <h1 className="text-center text-xl mb-10">Login</h1>
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
      </div>
    </>
  );
};

export default Login;
