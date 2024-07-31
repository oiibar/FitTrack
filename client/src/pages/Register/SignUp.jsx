import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
      <h1 className="text-center text-xl mb-10">Sign Up</h1>
      <SignUpForm onSuccess={handleSuccess} />
    </div>
  );
};

export default SignUp;
