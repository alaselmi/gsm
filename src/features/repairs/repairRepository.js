import { REPAIRS } from "../../data/mockData";
import {
  createHistoryEntry,
  normalizeRepair,
  REPAIR_STORAGE_KEY,
} from "./repairModel";

export function buildSeedRepairs() {
  const items = [];

  REPAIRS.forEach((repair, index) => {
    const createdAt = new Date(2026, 3, 18 + index, 9 + index, 30).toISOString();
    const normalized = normalizeRepair(
      {
        ...repair,
        createdAt,
        updatedAt: createdAt,
        dueDate: new Date(2026, 3, 20 + index).toISOString().slice(0, 10),
        history: [
          createHistoryEntry(
            "CREATED",
            "Repair order created with status Pending",
            createdAt
          ),
        ],
      },
      index,
      items
    );

    if (normalized.status === "In Progress") {
      const inProgressAt = new Date(2026, 3, 19 + index, 11, 15).toISOString();
      normalized.updatedAt = inProgressAt;
      normalized.history.push(
        createHistoryEntry(
          "STATUS_UPDATED",
          "Status changed from Pending to In Progress",
          inProgressAt
        )
      );
    }

    if (normalized.status === "Completed") {
      const completedAt = new Date(2026, 3, 20 + index, 16, 45).toISOString();
      normalized.updatedAt = completedAt;
      normalized.deliveredAt = completedAt;
      normalized.history.push(
        createHistoryEntry(
          "STATUS_UPDATED",
          "Status changed from Pending to Completed",
          completedAt
        )
      );
      normalized.history.push(
        createHistoryEntry(
          "DELIVERED",
          "Device marked as completed and archived",
          completedAt
        )
      );
    }

    items.push(normalized);
  });

  return items;
}

export function readStoredRepairs() {
  if (typeof window === "undefined") {
    return buildSeedRepairs();
  }

  try {
    const stored = localStorage.getItem(REPAIR_STORAGE_KEY);

    if (!stored) {
      return buildSeedRepairs();
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return buildSeedRepairs();
    }

    const normalized = [];

    parsed.forEach((repair, index) => {
      normalized.push(normalizeRepair(repair, index, normalized));
    });

    return normalized;
  } catch {
    return buildSeedRepairs();
  }
}

export function writeStoredRepairs(repairs) {
  localStorage.setItem(REPAIR_STORAGE_KEY, JSON.stringify(repairs));
}
