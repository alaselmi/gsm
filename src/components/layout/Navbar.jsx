import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-slate-900 p-4 border-b border-slate-700">
      <h1 className="text-lg font-semibold text-white">
        Repair Shop System
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-slate-300 text-sm">
          {user?.email || "User"}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
