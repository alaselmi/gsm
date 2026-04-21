import { useMemo, useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ROLE_OPTIONS } from "../features/auth/authRepository";
import { validateUserForm } from "../features/auth/authValidation";

const initialFormState = {
  name: "",
  email: "",
  role: "User",
  password: "",
  confirmPassword: "",
};

function getRoleBadge(role) {
  if (role === "Admin") {
    return "admin";
  }

  if (role === "Technician") {
    return "technician";
  }

  return "user";
}

export default function Users() {
  const { user, users, createUser, updateUser, deleteUser } = useAuth();
  const { pushToast } = useToast();

  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((account) => {
      if (!query) {
        return true;
      }

      return [account.name, account.email, account.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [search, users]);

  const userStats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((account) => account.role === "Admin").length,
      technicians: users.filter((account) => account.role === "Technician").length,
    }),
    [users]
  );

  const selectedUser = users.find(
    (account) => String(account.id) === String(selectedUserId)
  );

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUserId(null);
    setForm({
      ...initialFormState,
      role: "User",
    });
    setErrors({});
    setOpen(true);
  };

  const openEditModal = (targetUser) => {
    setModalMode("edit");
    setSelectedUserId(targetUser.id);
    setForm({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  };

  const handleSubmit = (event) => {
    event?.preventDefault();

    const validationErrors = validateUserForm(form, users, {
      mode: modalMode,
      currentUserId: selectedUserId,
      requirePassword: modalMode === "create",
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result =
      modalMode === "create"
        ? createUser(form)
        : updateUser(selectedUserId, form);

    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }

    pushToast({
      title: modalMode === "create" ? "User created" : "User updated",
      description:
        modalMode === "create"
          ? `${result.user.name} was added to the local workspace.`
          : `${result.user.name} profile details were updated.`,
      tone: "success",
    });
    closeModal();
  };

  const handleDelete = (targetUser) => {
    const confirmed = window.confirm(
      `Delete ${targetUser.name} from the local workspace?`
    );

    if (!confirmed) {
      return;
    }

    const result = deleteUser(targetUser.id);

    if (!result.success) {
      pushToast({
        title: "Could not delete user",
        description: result.error,
        tone: "warning",
      });
      return;
    }

    pushToast({
      title: "User deleted",
      description: `${targetUser.name} was removed from the local workspace.`,
      tone: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage the people who access the dashboard, edit their roles, and
            remove old accounts.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:min-w-[320px]"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button
            variant="primary"
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3"
            onClick={openCreateModal}
          >
            <UserPlus size={16} />
            Add user
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total accounts" value={userStats.total} />
        <SummaryCard label="Admin accounts" value={userStats.admins} />
        <SummaryCard label="Technicians" value={userStats.technicians} />
      </div>

      <div className="grid gap-4 lg:hidden">
        {filteredUsers.map((account) => (
          <div
            key={account.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {account.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{account.email}</p>
              </div>
              <Badge type={getRoleBadge(account.role)}>{account.role}</Badge>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {String(account.id) === String(user?.id) ? "Current session" : "Local user"}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openEditModal(account)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(account)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Session</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((account) => (
                <tr key={account.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{account.email}</td>
                  <td className="px-6 py-4">
                    <Badge type={getRoleBadge(account.role)}>{account.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {String(account.id) === String(user?.id) ? "Current session" : "Local user"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => openEditModal(account)}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="flex items-center gap-2"
                        onClick={() => handleDelete(account)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No users matched your search.
          </div>
        ) : null}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={modalMode === "create" ? "Add a new user" : "Edit user"}
        description={
          modalMode === "create"
            ? "Create a local account for the dashboard."
            : `Update ${selectedUser?.name || "this user"} details and role.`
        }
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {modalMode === "create" ? "Create user" : "Save changes"}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Name"
            placeholder="User full name"
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
          />

          <Input
            label="Email"
            placeholder="user@gsm.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />

          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={handleChange("role")}
            error={errors.role}
          />

          <Input
            label="Password"
            placeholder={
              modalMode === "edit"
                ? "Leave blank to keep the current password"
                : "At least 6 characters"
            }
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
          />

          <Input
            label="Confirm password"
            placeholder="Repeat the password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
          />

          {errors.form ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errors.form}
            </div>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
