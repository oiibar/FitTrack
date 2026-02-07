import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id, role) => {
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      const res = await api.post(`/user/users/${id}/promote`, { role: newRole });
      toast.success(`User role updated to ${res.data.role}`);
      // update local state
      setUsers((prev) => prev.map(u => u._id === res.data._id ? res.data : u));
    } catch (err) {
      console.error('Promote error:', err);
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="w-full p-4 bg-slate-700 rounded-md mb-6">
      <h2 className="text-yellow-300 text-xl font-bold mb-2">Admin Dashboard</h2>
      <p className="text-sm text-gray-100 mb-4">You are viewing admin controls. You can see all users and change roles.</p>

      {loading ? (
        <p className="text-white">Loading users...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {users.length === 0 ? (
            <p className="text-gray-200">No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                <div>
                  <p className="text-white font-medium">{user.email}</p>
                  <p className="text-sm text-gray-300">Role: <span className="font-semibold">{user.role || 'user'}</span></p>
                </div>
                <div>
                  <button
                    onClick={() => handlePromote(user._id, user.role)}
                    className="btn btn-yellow"
                  >
                    {user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

