import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "./useSignup";

const SignUpForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await signup(email, password);
      if (success) {
        setSuccessMessage("Successfully signed up");
        onSuccess();
      } else {
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
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
  );
};

export default SignUpForm;
