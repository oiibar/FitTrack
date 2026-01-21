import AuthForm from "../components/Auth/AuthForm.jsx";

const Auth = ({ mode }) => {
  return (
    <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
      <AuthForm mode={mode} />
    </div>
  );
};

export default Auth;
