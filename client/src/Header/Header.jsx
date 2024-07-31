import { FaDumbbell } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { memo } from "react";
import { useLogout } from "./useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Header = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <header className="flex items-center p-4 bg-slate-800 backdrop-blur-sm justify-between">
      <Link to="/">
        <FaDumbbell size={20} />
      </Link>
      <nav className="flex">
        {user ? (
          <div className="flex gap-2 items-center">
            <span>{user.email}</span>
            <button
              onClick={() => logout()}
              className="bg-red-600 rounded-xl px-4 py-2"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default memo(Header);
