import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/api.js";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";

const ContactPage = () => {
    const { user } = useAuthContext();

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/contact`,
                form,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            toast.success(response.data.message);
            setForm({ name: "", email: "", message: "" });
        } catch (error) {
            toast.error(
                error.response?.data?.error || "Failed to send message"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-black flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-400 p-6 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Contact Us
                </h1>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-medium">Message</label>
                    <textarea
                        name="message"
                        rows="4"
                        value={form.message}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default ContactPage;
