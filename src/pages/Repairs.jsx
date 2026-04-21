import { Link } from "react-router-dom";
import { useRepairCache } from "../context/RepairCacheContext";

const statusUI = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  "In Progress": "bg-sky-100 text-sky-700 border border-sky-200",
  Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

export default function Repairs() {
  const { repairs, updateRepair } = useRepairCache();

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Repairs
          </h1>
          <p className="text-gray-500 text-sm">
            Manage repair orders
          </p>
        </div>

        <Link
          to="/repairs/new"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm"
        >
          + New Repair
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-indigo-50 text-indigo-700 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th>Client</th>
              <th>Device</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>

            {repairs.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-indigo-50/30 transition"
              >

                <td className="p-3 font-mono text-xs text-indigo-600">
                  {r.deviceId}
                </td>

                <td className="font-medium text-gray-700">
                  {r.client}
                </td>

                <td className="text-gray-600">
                  {r.device}
                </td>

                {/* STATUS */}
                <td>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateRepair(r.id, { status: e.target.value })
                    }
                    className="rounded-xl px-2 py-1 border text-sm"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${statusUI[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="font-semibold text-gray-700">
                  {r.price} TND
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}