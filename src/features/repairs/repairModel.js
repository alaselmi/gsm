import { TECHNICIANS } from "../../data/mockData";

export const REPAIR_STORAGE_KEY = "gsm_repairs_cache";
export const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
export const DEFAULT_TECHNICIANS = TECHNICIANS;

export const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  "In Progress": "bg-sky-50 text-sky-700 border border-sky-200",
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return dateFormatter.format(date);
}

export function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return dateTimeFormatter.format(date);
}

export function formatMoney(value) {
  const amount = Number(value || 0);

  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })} TND`;
}

export function generateRepairNumber(existingRepairs = [], date = new Date()) {
  const currentDate = new Date(date);
  const prefix = [
    String(currentDate.getDate()).padStart(2, "0"),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getFullYear()),
  ].join("");

  const count = existingRepairs.filter((repair) =>
    repair.deviceId?.startsWith(prefix)
  ).length;

  return `${prefix}-${String(count + 1).padStart(2, "0")}`;
}

export function normalizePartsValue(parts) {
  if (Array.isArray(parts)) {
    return parts
      .map((part) => String(part).trim())
      .filter(Boolean);
  }

  if (!parts) {
    return [];
  }

  return String(parts)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function createHistoryEntry(
  type,
  details,
  timestamp = new Date().toISOString()
) {
  return {
    id: `history-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    details,
    timestamp,
    date: formatDateTime(timestamp),
  };
}

export function normalizeHistoryEntry(entry, fallbackTimestamp) {
  const timestamp = entry?.timestamp || entry?.date || fallbackTimestamp;

  return {
    id:
      entry?.id ||
      `history-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    type: entry?.type || "UPDATED",
    details: entry?.details || entry?.message || "Repair updated",
    timestamp,
    date: formatDateTime(timestamp),
  };
}

export function normalizeRepair(repair, index = 0, existingRepairs = []) {
  const createdAt = repair?.createdAt || new Date().toISOString();
  const status = STATUS_OPTIONS.includes(repair?.status)
    ? repair.status
    : "Pending";

  const historySource = Array.isArray(repair?.history)
    ? repair.history
    : Array.isArray(repair?.timeline)
      ? repair.timeline
      : [];

  const history = historySource.length
    ? historySource.map((entry) => normalizeHistoryEntry(entry, createdAt))
    : [
        createHistoryEntry(
          "CREATED",
          `Repair order created with status ${status}`,
          createdAt
        ),
      ];

  const updatedAt =
    repair?.updatedAt || history[history.length - 1]?.timestamp || createdAt;

  return {
    id: String(repair?.id ?? `repair-${Date.parse(createdAt) || Date.now()}-${index}`),
    deviceId:
      repair?.deviceId || generateRepairNumber(existingRepairs, createdAt),
    client: repair?.client || repair?.clientName || "Unknown client",
    phone: repair?.phone || "",
    device: repair?.device || "Unknown device",
    technician: repair?.technician || DEFAULT_TECHNICIANS[0],
    status,
    price: Number(repair?.price || 0),
    notes: repair?.notes || "",
    parts: normalizePartsValue(repair?.parts || repair?.replacedParts),
    dueDate: repair?.dueDate || "",
    createdAt,
    updatedAt,
    deliveredAt:
      repair?.deliveredAt || (status === "Completed" ? updatedAt : null),
    history,
  };
}

export function createRepairRecord(values, existingRepairs = []) {
  const createdAt = new Date().toISOString();
  const status = STATUS_OPTIONS.includes(values?.status)
    ? values.status
    : "Pending";

  return normalizeRepair(
    {
      id: `repair-${Date.now()}`,
      deviceId: generateRepairNumber(existingRepairs, createdAt),
      client: values?.client,
      phone: values?.phone,
      device: values?.device,
      technician: values?.technician,
      price: values?.price,
      notes: values?.notes,
      parts: values?.parts,
      dueDate: values?.dueDate,
      status,
      createdAt,
      updatedAt: createdAt,
      deliveredAt: status === "Completed" ? createdAt : null,
      history: [
        createHistoryEntry(
          "CREATED",
          `Repair order created with status ${status}`,
          createdAt
        ),
      ],
    },
    existingRepairs.length,
    existingRepairs
  );
}

function normalizeComparableValue(key, value) {
  if (key === "price") {
    return Number(value || 0);
  }

  if (key === "parts") {
    return normalizePartsValue(value).join(", ");
  }

  return String(value || "").trim();
}

export function createRepairUpdateHistoryEntries(repair, updatedData) {
  const trackedFields = [
    { key: "client", label: "Client" },
    { key: "phone", label: "Phone" },
    { key: "device", label: "Device" },
    { key: "technician", label: "Technician" },
    { key: "price", label: "Price" },
    { key: "dueDate", label: "Due date" },
    { key: "parts", label: "Parts" },
    { key: "notes", label: "Notes" },
  ];

  return trackedFields.flatMap(({ key, label }) => {
    if (updatedData[key] === undefined) {
      return [];
    }

    const currentValue = normalizeComparableValue(key, repair[key]);
    const nextValue = normalizeComparableValue(key, updatedData[key]);

    if (currentValue === nextValue) {
      return [];
    }

    if (key === "notes") {
      return [createHistoryEntry("UPDATED", "Repair notes were updated")];
    }

    return [
      createHistoryEntry(
        "UPDATED",
        `${label} changed from ${currentValue || "empty"} to ${nextValue || "empty"}`
      ),
    ];
  });
}
