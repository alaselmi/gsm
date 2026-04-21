import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useRepairCache } from "../context/RepairCacheContext";
import {
  formatDate,
  formatMoney,
  STATUS_STYLES,
} from "../utils/repairUtils";

export default function Archive() {
  const { repairs } = useRepairCache();
  const [search, setSearch] = useState("");

  const archived = useMemo(() => {
    const query = search.trim().toLowerCase();

    return repairs
      .filter((repair) => repair.status === "Completed")
      .filter((repair) => {
        if (!query) {
          return true;
        }

        return [repair.client, repair.device, repair.deviceId, repair.technician]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      })
      .sort((first, second) => {
        const firstDate = new Date(first.deliveredAt || first.createdAt);
        const secondDate = new Date(second.deliveredAt || second.createdAt);
        return secondDate - firstDate;
      });
  }, [repairs, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Archive</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review completed repairs, search old devices, and reopen the full
            details when needed.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by client, device, smart ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 lg:max-w-sm"
        />
      </div>

      {archived.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
          No completed repairs were found in the archive.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {archived.map((repair) => (
            <div
              key={repair.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-xs text-sky-700">{repair.deviceId}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {repair.client}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{repair.device}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Technician: {repair.technician}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[repair.status]}`}
                  >
                    {repair.status}
                  </span>
                  <p className="text-sm font-medium text-emerald-700">
                    {formatMoney(repair.price)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Created
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(repair.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Completed
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(repair.deliveredAt)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Timeline entries: {repair.history.length}
                </p>
                <Link
                  to={`/repairs/${repair.id}`}
                  className="text-sm font-medium text-sky-700 hover:text-sky-800"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
