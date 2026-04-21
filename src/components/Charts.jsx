import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

export default function Charts({ repairs = [] }) {
  // 🔒 حماية من undefined

  const safe = Array.isArray(repairs) ? repairs : [];

  // 📊 weekly data (fake/simple logic)
  const weekly = [
    { name: "Mon", value: 0 },
    { name: "Tue", value: 0 },
    { name: "Wed", value: 0 },
    { name: "Thu", value: 0 },
    { name: "Fri", value: 0 },
    { name: "Sat", value: 0 },
    { name: "Sun", value: 0 },
  ];

  safe.forEach((r, i) => {
    const index = i % 7;
    weekly[index].value += 1;
  });

  // 📊 status pie
  const pieData = [
    {
      name: "Pending",
      value: safe.filter((r) => r.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: safe.filter((r) => r.status === "In Progress").length,
    },
    {
      name: "Completed",
      value: safe.filter((r) => r.status === "Completed").length,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LINE */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm">
        <h3 className="font-bold mb-4 text-gray-700">
          Weekly Activity
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weekly}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366F1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PIE */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm">
        <h3 className="font-bold mb-4 text-gray-700">
          Status Distribution
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={90}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}