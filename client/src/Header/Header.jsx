import { FaDumbbell } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { memo, useState } from "react";
import { useLogout } from "./useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { BASE_URL } from "../apiurl.js";

const Header = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const getInfo = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Server Info retrieved successfully:");

                console.log(`
                    Server Information:
                    Name: ${data.data.name}
                    Version: ${data.data.version}
                    Status: ${data.data.status}
                    Environment: ${data.data.environment}
                    Timestamp: ${new Date(data.data.timestamp).toLocaleString()}
                `);

            } else {
                console.error("Server error:", data.error);
                alert(`Error: ${data.error || "Failed to fetch server info"}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error. Please check your connection.");
        } finally {
            setLoading(false);
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

export default memo(Header);