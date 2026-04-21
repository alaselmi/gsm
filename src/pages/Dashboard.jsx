import {
  Activity,
  CheckCircle2,
  Clock3,
  DollarSign,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

import Charts from "../components/Charts";
import { useRepairCache } from "../context/RepairCacheContext";
import {
  formatDate,
  formatMoney,
  getDashboardMetrics,
  getDueTodayRepairs,
  getOverdueRepairs,
  isRepairOverdue,
  sortRepairs,
  STATUS_STYLES,
} from "../utils/repairUtils";

export default function Dashboard() {
  const { repairs } = useRepairCache();

  const data = Array.isArray(repairs) ? repairs : [];
  const metrics = getDashboardMetrics(data);
  const recentRepairs = sortRepairs(data, "newest").slice(0, 5);
  const dueTodayRepairs = getDueTodayRepairs(data).filter(
    (repair) => repair.status !== "Completed"
  );
  const overdueRepairs = getOverdueRepairs(data).slice(0, 4);

  const stats = [
    {
      title: "Total Repairs",
      value: metrics.total,
      color: "bg-slate-950 text-white",
      icon: Wrench,
    },
    {
      title: "Pending",
      value: metrics.pending,
      color: "bg-amber-100 text-amber-700",
      icon: Clock3,
    },
    {
      title: "In Progress",
      value: metrics.inProgress,
      color: "bg-sky-100 text-sky-700",
      icon: Activity,
    },
    {
      title: "Completed",
      value: metrics.completed,
      color: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle2,
    },
    {
      title: "Completed Revenue",
      value: formatMoney(metrics.completedRevenue),
      color: "bg-cyan-100 text-cyan-700",
      icon: DollarSign,
    },
    {
      title: "Due Today",
      value: metrics.dueToday,
      color: "bg-orange-100 text-orange-700",
      icon: Clock3,
    },
    {
      title: "Overdue",
      value: metrics.overdue,
      color: "bg-rose-100 text-rose-700",
      icon: TriangleAlert,
    },
    {
      title: "Completion Rate",
      value: `${metrics.completionRate}%`,
      color: "bg-violet-100 text-violet-700",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl">
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Repair Shop Management System
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              One control center for devices, technicians, archive, and shop
              performance.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Follow every repair order from creation to delivery, keep a full
              timeline for each device, and detect due or overdue work before it
              slows the shop down.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HighlightCard
              label="Active technicians"
              value={metrics.activeTechnicians}
              note={metrics.topTechnician ? `Top: ${metrics.topTechnician.name}` : "No data yet"}
            />
            <HighlightCard
              label="Average repair value"
              value={formatMoney(metrics.averageValue)}
              note={`${metrics.completed} completed repairs`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className={`rounded-2xl p-3 ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <Charts repairs={data} />

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Recent repairs
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Latest repair requests created in the system.
              </p>
            </div>

            <Link
              to="/repairs"
              className="text-sm font-medium text-sky-700 hover:text-sky-800"
            >
              Open repairs
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentRepairs.map((repair) => (
              <Link
                key={repair.id}
                to={`/repairs/${repair.id}`}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50/40 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-sky-700">
                    {repair.deviceId}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-slate-900">
                    {repair.client}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {repair.device} / {repair.technician}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[repair.status]}`}
                    >
                      {repair.status}
                    </span>
                    {isRepairOverdue(repair) ? (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                        Overdue
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500">
                    {formatDate(repair.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Workflow snapshot
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  The most important operational indicators right now.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <WorkflowRow
                label="Top technician"
                value={metrics.topTechnician ? metrics.topTechnician.name : "No ranking yet"}
              />
              <WorkflowRow
                label="Due today"
                value={`${dueTodayRepairs.length} active repair(s)`}
              />
              <WorkflowRow
                label="Overdue"
                value={`${overdueRepairs.length} repair(s) need attention`}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Attention list
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Devices that should be reviewed first.
            </p>

            <div className="mt-6 space-y-3">
              {[...overdueRepairs, ...dueTodayRepairs]
                .slice(0, 4)
                .map((repair) => (
                  <Link
                    key={repair.id}
                    to={`/repairs/${repair.id}`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-sky-200 hover:bg-sky-50/50"
                  >
                    <p className="font-medium text-slate-900">{repair.client}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {repair.device} / due {formatDate(repair.dueDate)}
                    </p>
                  </Link>
                ))}

              {overdueRepairs.length === 0 && dueTodayRepairs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                  No urgent repairs right now.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HighlightCard({ label, value, note }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </div>
  );
}

function WorkflowRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
