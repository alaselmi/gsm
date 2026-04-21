import { Users, Wrench, DollarSign, Clock } from "lucide-react";
import { useRepairCache } from "../context/RepairCacheContext";
import Charts from "../components/Charts";
import RepairCharts from "../components/charts/RepairCharts";
export default function Dashboard() {
  const { repairs } = useRepairCache();

  const data = repairs || [];

  const stats = [
    {
      title: "Total Repairs",
      value: data.length,
      color: "bg-indigo-100 text-indigo-700",
      icon: Users,
    },
    {
      title: "Pending",
      value: data.filter(r => r.status === "Pending").length,
      color: "bg-amber-100 text-amber-700",
      icon: Clock,
    },
    {
      title: "In Progress",
      value: data.filter(r => r.status === "In Progress").length,
      color: "bg-sky-100 text-sky-700",
      icon: Wrench,
    },
    {
      title: "Completed",
      value: data.filter(r => r.status === "Completed").length,
      color: "bg-emerald-100 text-emerald-700",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard
      </h1>
      <RepairCharts />
      <Charts repairs={data} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {stats.map((s, i) => {
          const Icon = s.icon;

          return (
            <div
              key={i}
              className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-gray-500 text-sm">{s.title}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {s.value}
                  </p>
                </div>

                <div className={`p-3 rounded-xl ${s.color}`}>
                  <Icon size={18} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}