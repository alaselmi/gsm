import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>

      {user && (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}