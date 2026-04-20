import { useState, useMemo } from "react";

const USERS = [
  { id: 1, name: "John Doe", email: "john@test.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@test.com", role: "User" },
  { id: 3, name: "Ali Ahmed", email: "ali@test.com", role: "Technician" },
  { id: 4, name: "Sami Ben", email: "sami@test.com", role: "User" },
  { id: 5, name: "Karim", email: "karim@test.com", role: "Admin" },
  { id: 6, name: "Amine", email: "amine@test.com", role: "User" },
  { id: 7, name: "Mouna", email: "mouna@test.com", role: "User" },
  { id: 8, name: "Hedi", email: "hedi@test.com", role: "Technician" },
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  // 🔍 Filter
  const filteredUsers = useMemo(() => {
    return USERS.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          className="border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-blue-100 text-blue-600"
                        : user.role === "Technician"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}