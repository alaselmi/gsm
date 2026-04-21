import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";

import {
  getPageTitle,
  isNavigationRouteActive,
  navigationItems,
} from "../../routes/routeConfig";

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const currentTitle = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">

      <aside className="hidden md:flex md:w-72 md:flex-col bg-slate-950 text-slate-100">
        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Repair Suite
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">
            GSM Repair Manager
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Repairs, archive, and technician activity in one workspace.
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isNavigationRouteActive(location.pathname, item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition
                  ${
                    active
                      ? "bg-white text-slate-900 font-medium"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }
                `}
              >
                <Icon size={17} />
                {item.navLabel}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-slate-800 p-4 text-xs text-slate-400">
          <div>
            <p className="text-sm font-medium text-white">
              {user?.email}
            </p>
            <p className="mt-1 uppercase tracking-[0.2em] text-slate-500">
              {user?.role || "admin"}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-md border border-slate-200 bg-white p-2 shadow-sm md:hidden"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 space-y-2 bg-slate-950 p-4 text-slate-100">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                    isNavigationRouteActive(location.pathname, item.href)
                      ? "bg-white text-slate-900"
                      : "text-slate-200 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon size={17} />
                  {item.navLabel}
                </Link>
              );
            })}

          </div>

          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Repair Shop Management System
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {currentTitle}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
