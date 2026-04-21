import {
  Archive,
  LayoutDashboard,
  Settings,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

import ArchivePage from "../pages/Archive";
import CreateRepair from "../pages/CreateRepair";
import Dashboard from "../pages/Dashboard";
import RepairDetails from "../pages/RepairDetails";
import Repairs from "../pages/Repairs";
import SettingsPage from "../pages/Settings";
import TechnicianAnalytics from "../pages/TechnicianAnalytics";
import UsersPage from "../pages/Users";

export const protectedRoutes = [
  {
    path: "dashboard",
    component: Dashboard,
    title: "Dashboard",
    href: "/dashboard",
    navLabel: "Dashboard",
    icon: LayoutDashboard,
    matches: (pathname) => pathname === "/dashboard",
  },
  {
    path: "users",
    component: UsersPage,
    title: "Users",
    href: "/users",
    navLabel: "Users",
    icon: Users,
    matches: (pathname) => pathname === "/users",
  },
  {
    path: "repairs",
    component: Repairs,
    title: "Repairs",
    href: "/repairs",
    navLabel: "Repairs",
    icon: Wrench,
    matches: (pathname) => pathname === "/repairs",
  },
  {
    path: "repairs/create",
    component: CreateRepair,
    title: "Create Repair",
    href: "/repairs/create",
    matches: (pathname) => pathname === "/repairs/create",
  },
  {
    path: "repairs/:id",
    component: RepairDetails,
    title: "Repair Details",
    href: "/repairs",
    matches: (pathname) =>
      pathname.startsWith("/repairs/") && pathname !== "/repairs/create",
  },
  {
    path: "archive",
    component: ArchivePage,
    title: "Archive",
    href: "/archive",
    navLabel: "Archive",
    icon: Archive,
    matches: (pathname) => pathname === "/archive",
  },
  {
    path: "analytics",
    component: TechnicianAnalytics,
    title: "Technician Analytics",
    href: "/analytics",
    navLabel: "Technicians",
    icon: UserCog,
    matches: (pathname) => pathname === "/analytics",
  },
  {
    path: "settings",
    component: SettingsPage,
    title: "Settings",
    href: "/settings",
    navLabel: "Settings",
    icon: Settings,
    matches: (pathname) => pathname === "/settings",
  },
];

export const navigationItems = protectedRoutes.filter((route) => route.navLabel);

export function getPageTitle(pathname) {
  return (
    protectedRoutes.find((route) => route.matches(pathname))?.title || "Dashboard"
  );
}

export function isNavigationRouteActive(pathname, href) {
  return pathname === href || (href === "/repairs" && pathname.startsWith("/repairs/"));
}
