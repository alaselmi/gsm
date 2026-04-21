import { useRepairCache } from "../context/RepairCacheContext";
import {
  formatMoney,
  getTechnicianStats,
} from "../utils/repairUtils";

export default function TechnicianAnalytics() {
  const { repairs } = useRepairCache();

  const stats = getTechnicianStats(Array.isArray(repairs) ? repairs : []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Technicians Performance
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Overview of repair workload, completion rate, and revenue per
          technician.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {stats.map((stat) => {
          return (
            <div
              key={stat.technician}
              className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {stat.technician}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Assigned repairs: {stat.total}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-medium text-slate-900">{stat.total}</span>
                </div>

                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>{stat.pending}</span>
                </div>

                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span>{stat.inProgress}</span>
                </div>

                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{stat.completed}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Completion rate</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {stat.completionRate}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${stat.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="text-sm text-slate-500">Revenue</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatMoney(stat.revenue)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
