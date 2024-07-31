import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await signup(email, password);
      if (success) {
        setSuccessMessage("Successfully signed up");
        navigate("/");
      } else {
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
        <h1 className="text-center text-xl mb-10">Sign Up</h1>
        <form
          className="flex w-1/3 flex-col mx-auto gap-5 text-center"
          onSubmit={handleSubmit}
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="input"
            value={email}
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="input"
            value={password}
            placeholder="Password"
          />
          <button disabled={isLoading} className="btn btn-green mx-auto">
            Submit
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline text-blue-600">
              Login
            </Link>
          </p>
          {successMessage && <div>{successMessage}</div>}
          {error && <div>{error}</div>}
        </form>
      </div>
    </>
  );
};

export default SignUp;
