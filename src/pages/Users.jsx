import { useState, useMemo } from "react";
import { USERS } from "../data/mockData";
import Page from "../components/ui/Page";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function Users() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return USERS.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Page
      title="Users"
      right={
        <input
          className="border px-3 py-2 rounded-md text-sm"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
    >

      <Table columns={["Name", "Email", "Role", "Actions"]}>

        {filtered.map((u) => (
          <tr key={u.id} className="border-t">

            <td className="px-6 py-4 font-medium">
              {u.name}
            </td>

            <td className="px-6 py-4 text-gray-500">
              {u.email}
            </td>

            <td className="px-6 py-4">
              <Badge type={u.role === "Admin" ? "admin" : "user"}>
                {u.role}
              </Badge>
            </td>

            <td className="px-6 py-4 space-x-2">
              <Button variant="outline">Edit</Button>
              <Button variant="danger">Delete</Button>
            </td>

          </tr>
        ))}

      </Table>

    </Page>
  );
}