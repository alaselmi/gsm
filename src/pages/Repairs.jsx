import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useRepairCache } from "../context/RepairCacheContext";
import { useToast } from "../context/ToastContext";
import {
  filterRepairs,
  formatDate,
  formatMoney,
  getDueTodayRepairs,
  getOverdueRepairs,
  getRepairStatusCounts,
  isRepairOverdue,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "../utils/repairUtils";

const STATUS_FILTERS = ["All", ...STATUS_OPTIONS];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "dueSoon", label: "Due soon" },
  { value: "priceHigh", label: "Highest price" },
  { value: "priceLow", label: "Lowest price" },
];

export default function Repairs() {
  const { repairs, updateRepair } = useRepairCache();
  const { pushToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredRepairs = useMemo(
    () => filterRepairs(repairs, { search, status: statusFilter, sortBy }),
    [repairs, search, sortBy, statusFilter]
  );
  const counts = useMemo(() => getRepairStatusCounts(repairs), [repairs]);
  const overdueCount = useMemo(() => getOverdueRepairs(repairs).length, [repairs]);
  const dueTodayCount = useMemo(
    () =>
      getDueTodayRepairs(repairs).filter((repair) => repair.status !== "Completed")
        .length,
    [repairs]
  );

  const handleStatusChange = (repair, nextStatus) => {
    if (repair.status === nextStatus) {
      return;
    }

    updateRepair(repair.id, { status: nextStatus });
    pushToast({
      title: "Repair updated",
      description: `${repair.deviceId} moved to ${nextStatus}.`,
      tone: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Repairs</h1>
          <p className="mt-2 text-sm text-slate-500">
            Filter active repair orders, sort by urgency, and update statuses
            from the main operations board.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by client, device, ID, phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:min-w-[320px]"
          />

          <Link
            to="/repairs/create"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + New Repair
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="All repairs" value={counts.All} />
        <MetricCard label="Pending" value={counts.Pending} />
        <MetricCard label="Due today" value={dueTodayCount} />
        <MetricCard label="Overdue" value={overdueCount} />
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === filter
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter} ({counts[filter] || 0})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-500">Sort</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {filteredRepairs.map((repair) => (
            <RepairCard
              key={repair.id}
              repair={repair}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Smart ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Due date</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredRepairs.map((repair) => (
                  <tr
                    key={repair.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-sky-700">
                      {repair.deviceId}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{repair.client}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {repair.phone || "No phone"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">{repair.device}</td>
                    <td className="px-6 py-4 text-slate-600">{repair.technician}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value={repair.status}
                          onChange={(event) =>
                            handleStatusChange(repair, event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[repair.status]}`}
                          >
                            {repair.status}
                          </span>
                          {isRepairOverdue(repair) ? (
                            <span className="inline-flex w-fit rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                              Overdue
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatMoney(repair.price)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(repair.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/repairs/${repair.id}`}
                        className="font-medium text-sky-700 hover:text-sky-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRepairs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            No repairs matched your current filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function RepairCard({ repair, onStatusChange }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-sky-700">{repair.deviceId}</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            {repair.client}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{repair.device}</p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
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
      </div>

      <div className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Technician: {repair.technician}</p>
        <p className="text-sm text-slate-600">Price: {formatMoney(repair.price)}</p>
        <p className="text-sm text-slate-600">Due date: {formatDate(repair.dueDate)}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <select
          value={repair.status}
          onChange={(event) => onStatusChange(repair, event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <Link
          to={`/repairs/${repair.id}`}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
