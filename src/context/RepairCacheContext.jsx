import { createContext, useContext, useEffect, useState } from "react";

import {
  createHistoryEntry,
  createRepairRecord,
  createRepairUpdateHistoryEntries,
  normalizePartsValue,
  readStoredRepairs,
  writeStoredRepairs,
} from "../utils/repairUtils";

export const RepairCacheContext = createContext();

export function RepairCacheProvider({ children }) {
  const [repairs, setRepairs] = useState(readStoredRepairs);

  useEffect(() => {
    writeStoredRepairs(repairs);
  }, [repairs]);

  const addRepair = (repair) => {
    let createdRepair;

    setRepairs((prev) => {
      createdRepair = createRepairRecord(repair, prev);
      return [createdRepair, ...prev];
    });

    return createdRepair;
  };

  const updateRepair = (id, updatedData) => {
    let updatedRepair = null;

    setRepairs((prev) =>
      prev.map((repair) => {
        if (String(repair.id) !== String(id)) {
          return repair;
        }

        const nextStatus = updatedData.status || repair.status;
        const updatedAt = new Date().toISOString();
        const history = [
          ...(repair.history || []),
          ...createRepairUpdateHistoryEntries(repair, updatedData),
        ];

        if (updatedData.status && updatedData.status !== repair.status) {
          history.push(
            createHistoryEntry(
              "STATUS_UPDATED",
              `Status changed from ${repair.status} to ${updatedData.status}`,
              updatedAt
            )
          );

          if (updatedData.status === "Completed") {
            history.push(
              createHistoryEntry(
                "DELIVERED",
                "Device marked as completed and ready for archive",
                updatedAt
              )
            );
          }
          if (repair.status === "Completed" && updatedData.status !== "Completed") {
            history.push(
              createHistoryEntry(
                "REOPENED",
                "Repair moved back from completed to active workflow",
                updatedAt
              )
            );
          }
        }

        const hasMeaningfulChange =
          history.length > (repair.history?.length || 0) ||
          (updatedData.status && updatedData.status !== repair.status);

        if (!hasMeaningfulChange) {
          updatedRepair = repair;
          return repair;
        }

        updatedRepair = {
          ...repair,
          ...updatedData,
          price:
            updatedData.price !== undefined
              ? Number(updatedData.price || 0)
              : repair.price,
          parts:
            updatedData.parts !== undefined
              ? normalizePartsValue(updatedData.parts)
              : repair.parts,
          deliveredAt:
            nextStatus === "Completed"
              ? repair.deliveredAt || updatedAt
              : updatedData.status
                ? null
                : repair.deliveredAt,
          updatedAt,
          history,
        };

        return updatedRepair;
      })
    );

    return updatedRepair;
  };

  const value = {
    repairs,
    addRepair,
    updateRepair,
    getRepairById: (id) =>
      repairs.find((repair) => String(repair.id) === String(id)),
  };

  return (
    <RepairCacheContext.Provider value={value}>
      {children}
    </RepairCacheContext.Provider>
  );
}

export function useRepairCache() {
  return useContext(RepairCacheContext);
}
