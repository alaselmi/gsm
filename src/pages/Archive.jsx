import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRepairCache } from "../context/RepairCacheContext";

export default function Archive() {
  const { repairs } = useRepairCache();
  const [search, setSearch] = useState("");

  // 🔥 فقط الإصلاحات المكتملة
  const archived = useMemo(() => {
    return repairs
      .filter((r) => r.status === "Completed")
      .filter((r) =>
        r.client.toLowerCase().includes(search.toLowerCase()) ||
        r.device.toLowerCase().includes(search.toLowerCase()) ||
        r.deviceId?.toLowerCase().includes(search.toLowerCase())
      );
  }, [repairs, search]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Archive</h1>
          <p className="text-gray-500 text-sm">
            Completed repairs history
          </p>
        </div>

        <input
          type="text"
          placeholder="Search archive..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
      </div>

      {/* EMPTY STATE */}
      {archived.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No archived repairs found.
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-4">

        {archived.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">

              <div>
                <h2 className="font-semibold">
                  {r.client}
                </h2>

                <p className="text-sm text-gray-500">
                  {r.device}
                </p>

                <p className="text-xs text-gray-400 font-mono mt-1">
                  {r.deviceId}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">
                  {r.price} TND
                </p>

                <Link
                  to={`/repairs/${r.id}`}
                  className="text-blue-600 text-sm underline"
                >
                  View
                </Link>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}