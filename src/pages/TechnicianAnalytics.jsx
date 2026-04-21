import { useRepairCache } from "../context/RepairCacheContext";

const TECHNICIANS = [
  "Ali Ben",
  "Sami Trabelsi",
  "Youssef Hamdi",
];

export default function TechnicianAnalytics() {
  const { repairs } = useRepairCache();

  const safeRepairs = Array.isArray(repairs) ? repairs : [];

  const getStats = (tech) => {
    const data = safeRepairs.filter((r) => r.technician === tech);

    const total = data.length;
    const pending = data.filter((r) => r.status === "Pending").length;
    const inProgress = data.filter((r) => r.status === "In Progress").length;
    const completed = data.filter((r) => r.status === "Completed").length;

    const revenue = data
      .filter((r) => r.status === "Completed")
      .reduce((sum, r) => sum + Number(r.price || 0), 0);

    return { total, pending, inProgress, completed, revenue };
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Technicians Performance
        </h1>
        <p className="text-sm text-gray-500">
          Overview of repair workload and revenue per technician
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {TECHNICIANS.map((tech) => {
          const s = getStats(tech);

          return (
            <div
              key={tech}
              className="bg-white border rounded-lg p-5 space-y-4"
            >

              {/* NAME */}
              <div className="border-b pb-3">
                <h2 className="text-sm font-medium text-gray-900">
                  {tech}
                </h2>
              </div>

              {/* STATS */}
              <div className="space-y-2 text-sm text-gray-600">

                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-gray-900 font-medium">
                    {s.total}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Pending</span>
                  <span>{s.pending}</span>
                </div>

                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span>{s.inProgress}</span>
                </div>

                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{s.completed}</span>
                </div>

              </div>

              {/* REVENUE */}
              <div className="pt-3 border-t flex justify-between">
                <span className="text-sm text-gray-500">
                  Revenue
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {s.revenue} TND
                </span>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}