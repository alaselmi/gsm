import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Repairs from "../pages/Repairs";
import CreateRepair from "../pages/CreateRepair";
import RepairDetails from "../pages/RepairDetails";
import Archive from "../pages/Archive";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

import ProtectedRoute from "./ProtectedRoute";
import TechnicianAnalytics from "../pages/TechnicianAnalytics";
export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED APP */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* default redirect */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* MAIN PAGES */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="repairs" element={<Repairs />} />
        <Route path="repairs/new" element={<CreateRepair />} />
        <Route path="repairs/:id" element={<RepairDetails />} />
        <Route path="archive" element={<Archive />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/technicians" element={<TechnicianAnalytics />} />
      </Route>

      {/* fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}