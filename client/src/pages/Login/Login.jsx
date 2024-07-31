import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
      <h1 className="text-center text-xl mb-10">Login</h1>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};

export default Login;
