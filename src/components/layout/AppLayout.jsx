import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  Archive,
  LogOut,
  Menu,
  UserCog,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Repairs", href: "/repairs", icon: Wrench },
  { name: "Archive", href: "/archive", icon: Archive },
  { name: "Technicians", href: "/technicians", icon: UserCog },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r">

        {/* BRAND */}
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-sm font-semibold tracking-wide text-gray-800">
            GSM SYSTEM
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1">

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                  ${
                    active
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon size={17} />
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* USER SECTION */}
        <div className="p-4 border-t text-xs text-gray-500 space-y-2">

          <div>
            <p className="text-gray-700 font-medium text-sm">
              {user?.email}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition"
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>
      </aside>

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded-md shadow-sm"
      >
        <Menu size={18} />
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-40 flex">

          <div className="w-64 bg-white border-r p-4 space-y-2">

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <Icon size={17} />
                  {item.name}
                </Link>
              );
            })}

          </div>

          <div
            className="flex-1 bg-black/20"
            onClick={() => setOpen(false)}
          />

        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center px-6">

          <h2 className="text-sm font-medium text-gray-700 capitalize">
            {location.pathname.replace("/", "") || "dashboard"}
          </h2>

        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}