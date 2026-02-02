import { FaDumbbell } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {useEffect} from "react";
import { useLogout } from "./useLogout.js";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import {api} from "../../api/api.js";

const Header = () => {
    const { logout } = useLogout();
    const { user, loading } = useAuthContext();
    useEffect(() => {
        console.log("Auth state:", { user, loading });
    }, [user, loading]);

    const getInfo = async () => {
        try {
            const response = await api.get("/info");

            const data = response.data;

            alert("Server Info retrieved successfully:");

            console.log(`
      Server Information:
      Name: ${data.data.name}
      Version: ${data.data.version}
      Status: ${data.data.status}
      Environment: ${data.data.environment}
      Timestamp: ${new Date(data.data.timestamp).toLocaleString()}
    `);
        } catch (error) {
            console.error("Server error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to fetch server info");
        }
    };

    return (
        <header className="flex items-center p-4 bg-slate-800 backdrop-blur-sm justify-between">
            <Link to="/">
                <FaDumbbell size={20} />
            </Link>
            <nav className="flex">
                {user ? (
                    <div className="flex gap-2 items-center">
                        <Link to="contact" className="hover:text-blue-300 transition-colors">
                            Contact
                        </Link>
                        <button
                            onClick={getInfo}
                            disabled={loading}
                            className={`px-3 py-1 rounded-md transition-colors ${
                                loading
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Loading...' : 'Info'}
                        </button>
                        {/*<span className="text-sm text-gray-300">{user.email}</span>*/}
                        <button
                            onClick={() => logout()}
                            className="bg-red-600 hover:bg-red-700 rounded-xl px-4 py-2 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="hover:text-blue-300 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="hover:text-blue-300 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;