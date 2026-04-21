import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#f59e0b", "#0ea5e9", "#10b981"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Charts({ repairs = [] }) {
  const safeRepairs = Array.isArray(repairs) ? repairs : [];

  const weekly = DAYS.map((day) => ({ name: day, value: 0 }));

  safeRepairs.forEach((repair) => {
    const date = new Date(repair.createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const dayIndex = (date.getDay() + 6) % 7;
    weekly[dayIndex].value += 1;
  });

  const pieData = [
    {
      name: "Pending",
      value: safeRepairs.filter((repair) => repair.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: safeRepairs.filter((repair) => repair.status === "In Progress").length,
    },
    {
      name: "Completed",
      value: safeRepairs.filter((repair) => repair.status === "Completed").length,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Weekly Activity
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weekly}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis allowDecimals={false} stroke="#64748b" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={3}
              dot={{ fill: "#0f172a", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Status Distribution
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={92}
              innerRadius={48}
            >
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
