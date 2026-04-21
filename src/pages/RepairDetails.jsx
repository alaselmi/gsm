import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  History,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useRepairCache } from "../context/RepairCacheContext";
import { useToast } from "../context/ToastContext";
import {
  DEFAULT_TECHNICIANS,
  formatDate,
  formatDateTime,
  formatMoney,
  isRepairOverdue,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "../utils/repairUtils";
import { validateRepairForm } from "../features/repairs/repairValidation";

function createEditForm(repair) {
  return {
    client: repair.client,
    phone: repair.phone,
    device: repair.device,
    technician: repair.technician,
    price: String(repair.price ?? ""),
    dueDate: repair.dueDate || "",
    status: repair.status,
    parts: repair.parts.join(", "),
    notes: repair.notes || "",
  };
}

export default function RepairDetails() {
  const { id } = useParams();
  const { getRepairById, updateRepair } = useRepairCache();
  const { pushToast } = useToast();

  const repair = getRepairById(id);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() =>
    repair ? createEditForm(repair) : createEditForm({
      client: "",
      phone: "",
      device: "",
      technician: DEFAULT_TECHNICIANS[0],
      price: "",
      dueDate: "",
      status: "Pending",
      parts: [],
      notes: "",
    })
  );
  const [errors, setErrors] = useState({});

  const overdue = useMemo(() => (repair ? isRepairOverdue(repair) : false), [repair]);

  if (!repair) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Repair not found
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          The requested repair was not found in the current cache.
        </p>
        <Link
          to="/repairs"
          className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to repairs
        </Link>
      </div>
    );
  }

  const handleChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const saveChanges = () => {
    const validationErrors = validateRepairForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateRepair(repair.id, form);
    setIsEditing(false);
    pushToast({
      title: "Repair updated",
      description: `${repair.deviceId} details were saved.`,
      tone: "success",
    });
  };

  const runQuickStatusAction = (nextStatus) => {
    if (repair.status === nextStatus) {
      return;
    }

    updateRepair(repair.id, { status: nextStatus });
    pushToast({
      title: "Status updated",
      description: `${repair.deviceId} moved to ${nextStatus}.`,
      tone: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/repairs"
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            <ArrowLeft size={16} />
            Back to repairs
          </Link>
          <p className="mt-4 font-mono text-sm text-sky-700">{repair.deviceId}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {repair.client} - {repair.device}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Created {formatDateTime(repair.createdAt)} / Last updated{" "}
            {formatDateTime(repair.updatedAt)}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[repair.status]}`}
          >
            {repair.status}
          </span>
          {overdue ? (
            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
              Overdue
            </span>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={isEditing ? "outline" : "primary"}
              onClick={() => {
                setIsEditing((current) => {
                  const nextValue = !current;

                  if (nextValue) {
                    setForm(createEditForm(repair));
                  }

                  return nextValue;
                });
                setErrors({});
              }}
            >
              {isEditing ? "Cancel edit" : "Edit repair"}
            </Button>
            {isEditing ? (
              <Button variant="success" onClick={saveChanges}>
                Save changes
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <ClipboardList size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Repair information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Main data for this repair order.
                </p>
              </div>
            </div>

            {isEditing ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Client"
                    value={form.client}
                    onChange={handleChange("client")}
                    error={errors.client}
                  />
                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    error={errors.phone}
                  />
                  <Input
                    label="Device"
                    value={form.device}
                    onChange={handleChange("device")}
                    error={errors.device}
                  />
                  <Select
                    label="Technician"
                    options={DEFAULT_TECHNICIANS}
                    value={form.technician}
                    onChange={handleChange("technician")}
                    error={errors.technician}
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={form.price}
                    onChange={handleChange("price")}
                    error={errors.price}
                    min="0"
                    step="0.01"
                  />
                  <Select
                    label="Status"
                    options={STATUS_OPTIONS}
                    value={form.status}
                    onChange={handleChange("status")}
                    error={errors.status}
                  />
                  <Input
                    label="Due date"
                    type="date"
                    value={form.dueDate}
                    onChange={handleChange("dueDate")}
                    error={errors.dueDate}
                  />
                  <Input
                    label="Parts"
                    value={form.parts}
                    onChange={handleChange("parts")}
                    helpText="Comma separated list"
                    error={errors.parts}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Notes</label>
                  <textarea
                    rows={5}
                    value={form.notes}
                    onChange={handleChange("notes")}
                    className={`w-full rounded-2xl border px-4 py-3 text-slate-700 outline-none transition ${
                      errors.notes
                        ? "border-red-200 bg-red-50/40 focus:border-red-300 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 bg-slate-50 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    }`}
                  />
                  {errors.notes ? (
                    <p className="text-sm text-red-600">{errors.notes}</p>
                  ) : null}
                </div>
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <InfoCard label="Client" value={repair.client} />
                  <InfoCard
                    label="Phone"
                    value={repair.phone || "No phone number"}
                    icon={<Phone size={14} />}
                  />
                  <InfoCard label="Device" value={repair.device} />
                  <InfoCard
                    label="Technician"
                    value={repair.technician}
                    icon={<UserRound size={14} />}
                  />
                  <InfoCard label="Price" value={formatMoney(repair.price)} />
                  <InfoCard label="Due date" value={formatDate(repair.dueDate)} />
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-700">Changed parts</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {repair.parts.length > 0 ? (
                        repair.parts.map((part) => (
                          <span
                            key={part}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                          >
                            {part}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No parts recorded yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-700">Notes</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {repair.notes || "No notes added for this repair yet."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the repair flow without leaving the details page.
            </p>

            <div className="mt-5 grid gap-3">
              <Button
                variant="outline"
                className="justify-start rounded-2xl px-4 py-3"
                onClick={() => runQuickStatusAction("Pending")}
              >
                Mark as Pending
              </Button>
              <Button
                variant="outline"
                className="justify-start rounded-2xl px-4 py-3"
                onClick={() => runQuickStatusAction("In Progress")}
              >
                Mark as In Progress
              </Button>
              <Button
                variant="success"
                className="justify-start rounded-2xl px-4 py-3"
                onClick={() => runQuickStatusAction("Completed")}
              >
                Mark as Completed
              </Button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <History size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Repair timeline
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Every important update for this device request.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {repair.history.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-sky-500" />
                  <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      {item.details}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.type}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
