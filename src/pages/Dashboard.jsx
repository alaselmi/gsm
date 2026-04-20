import { Users, Wrench, DollarSign, Clock } from "lucide-react";
import Charts from "../components/Charts";
export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Repairs",
      value: "56",
      change: "+8%",
      icon: Wrench,
      color: "bg-yellow-500",
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "+23%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Pending Tasks",
      value: "12",
      change: "-4%",
      icon: Clock,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back 👋
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your GSM system today.
        </p>
      </div>

      {/* Cards */}
      <Charts />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`p-3 rounded-xl text-white ${stat.color}`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <p
                className={`mt-4 text-sm font-medium ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {stat.change} from last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>

        <div className="space-y-4">
          {[
            { name: "John Doe", action: "Created repair request" },
            { name: "Jane Smith", action: "Updated user profile" },
            { name: "Admin", action: "Deleted a repair" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.action}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                2h ago
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}