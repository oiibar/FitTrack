import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const SignUp = () => {
  const [email, setEmail] = useState("asdfasdfasdf@gmail.com");
  const [password, setPassword] = useState("123456");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
      <h1 className="text-center text-xl mb-10">Sign Up</h1>

      <form className="flex w-1/3 flex-col mx-auto gap-5">
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
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="btn btn-green mx-auto"
        >
          Submit
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default SignUp;
