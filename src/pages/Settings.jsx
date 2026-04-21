import { useAuth } from "../context/AuthContext";
import { useRepairCache } from "../context/RepairCacheContext";

export default function Settings() {
  const { user, users } = useAuth();
  const { repairs } = useRepairCache();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Basic admin information and current system mode.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Account</h2>
          <div className="mt-6 space-y-4">
            <SettingRow label="Account" value="Admin User" />
            <SettingRow label="Name" value={user?.name || "Admin User"} />
            <SettingRow label="Email" value={user?.email || "admin@gsm.com"} />
            <SettingRow label="Role" value={user?.role || "Admin"} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">System</h2>
          <div className="mt-6 space-y-4">
            <SettingRow label="Repair cache" value="Browser localStorage" />
            <SettingRow label="Tracked repairs" value={String(repairs.length)} />
            <SettingRow label="Registered users" value={String(users.length)} />
            <SettingRow label="Mode" value="Frontend demo ready for backend integration" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
