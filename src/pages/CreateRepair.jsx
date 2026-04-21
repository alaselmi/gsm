import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useRepairCache } from "../context/RepairCacheContext";
import { useToast } from "../context/ToastContext";
import { useUnsavedChangesWarning } from "../hooks/useUnsavedChangesWarning";
import {
  DEFAULT_TECHNICIANS,
  formatDate,
  formatMoney,
  generateRepairNumber,
  STATUS_OPTIONS,
  STATUS_STYLES,
} from "../utils/repairUtils";
import { validateRepairForm } from "../features/repairs/repairValidation";

const initialForm = {
  client: "",
  phone: "",
  device: "",
  technician: DEFAULT_TECHNICIANS[0],
  price: "",
  parts: [],
  notes: "",
  dueDate: "",
  status: "Pending",
};

export default function CreateRepair() {
  const { repairs, addRepair } = useRepairCache();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [partInput, setPartInput] = useState("");
  const [errors, setErrors] = useState({});

  const nextSmartId = useMemo(() => generateRepairNumber(repairs), [repairs]);
  const isDirty = useMemo(
    () =>
      Boolean(
        form.client ||
          form.phone ||
          form.device ||
          form.price ||
          form.notes ||
          form.dueDate ||
          form.parts.length > 0
      ),
    [form]
  );
  const confirmDiscard = useUnsavedChangesWarning(isDirty);

  const handleChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const addPart = () => {
    const nextPart = partInput.trim();

    if (!nextPart) {
      return;
    }

    if (form.parts.includes(nextPart)) {
      setPartInput("");
      return;
    }

    setForm((current) => ({
      ...current,
      parts: [...current.parts, nextPart],
    }));
    setPartInput("");
    setErrors((current) => ({ ...current, parts: "" }));
  };

  const removePart = (part) => {
    setForm((current) => ({
      ...current,
      parts: current.parts.filter((item) => item !== part),
    }));
  };

  const handlePartKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addPart();
    }
  };

  const submit = (event) => {
    event.preventDefault();

    const validationErrors = validateRepairForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const createdRepair = addRepair(form);
    pushToast({
      title: "Repair created",
      description: `${createdRepair.deviceId} was added to the live repair board.`,
      tone: "success",
    });
    setForm(initialForm);
    navigate(`/repairs/${createdRepair.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-600">
          New Repair Request
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Create a repair and assign it to the shop workflow
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Build the request, validate the data before saving, and preview
              how the device will appear in the shared repair board.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
              Next Smart ID
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-sky-800">
              {nextSmartId}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <form
          onSubmit={submit}
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Client"
              placeholder="Client name"
              color="indigo"
              value={form.client}
              onChange={handleChange("client")}
              error={errors.client}
              required
            />

            <Input
              label="Phone"
              placeholder="+216 ..."
              color="sky"
              value={form.phone}
              onChange={handleChange("phone")}
              error={errors.phone}
              required
            />

            <Input
              label="Device"
              placeholder="Device model"
              color="purple"
              value={form.device}
              onChange={handleChange("device")}
              error={errors.device}
              required
            />

            <Select
              label="Technician"
              options={DEFAULT_TECHNICIANS}
              value={form.technician}
              onChange={handleChange("technician")}
              error={errors.technician}
            />

            <Input
              label="Expected Price"
              type="number"
              placeholder="0"
              color="amber"
              value={form.price}
              onChange={handleChange("price")}
              error={errors.price}
              min="0"
              step="0.01"
              required
            />

            <Select
              label="Initial Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={handleChange("status")}
              color="indigo"
              error={errors.status}
            />

            <Input
              label="Due Date"
              type="date"
              color="emerald"
              value={form.dueDate}
              onChange={handleChange("dueDate")}
              error={errors.dueDate}
            />

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Changed Parts</label>
              <div className="flex gap-2">
                <input
                  value={partInput}
                  onChange={(event) => setPartInput(event.target.value)}
                  onKeyDown={handlePartKeyDown}
                  placeholder="Type a part and press Enter"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
                <Button variant="outline" onClick={addPart}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.parts.map((part) => (
                  <span
                    key={part}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                  >
                    {part}
                    <button
                      type="button"
                      onClick={() => removePart(part)}
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {errors.parts ? (
                <p className="text-sm text-red-600">{errors.parts}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-sm text-gray-500">Notes</label>
            <textarea
              value={form.notes}
              onChange={handleChange("notes")}
              placeholder="Write any diagnostic notes, device condition, or delivery details..."
              rows={5}
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="px-6 py-3"
              onClick={() => confirmDiscard(() => navigate("/repairs"))}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-6 py-3">
              Create Repair
            </Button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
            <p className="mt-2 text-sm text-slate-500">
              Live preview of the repair card before saving.
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="font-mono text-xs text-sky-700">{nextSmartId}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {form.client || "Client name"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {form.device || "Device model"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[form.status]}`}
                >
                  {form.status}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                  {form.technician}
                </span>
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>Phone: {form.phone || "No phone yet"}</p>
                <p>Price: {formatMoney(form.price || 0)}</p>
                <p>Due date: {form.dueDate ? formatDate(form.dueDate) : "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Checklist</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: "Client", done: Boolean(form.client) },
                { label: "Phone", done: Boolean(form.phone) },
                { label: "Device", done: Boolean(form.device) },
                { label: "Price", done: Boolean(form.price) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm text-slate-700">{item.label}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.done ? "Ready" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
