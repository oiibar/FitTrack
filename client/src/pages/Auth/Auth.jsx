import AuthForm from "./AuthForm";

const Auth = ({ mode }) => {
  return (
    <div className="flex flex-col items-center h-screen justify-center bg-slate-900 text-white">
      <AuthForm mode={mode} />
    </div>
  );
};

export default Auth;
