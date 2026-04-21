import { createContext, useContext, useEffect, useState } from "react";

const RepairCacheContext = createContext();

const STORAGE_KEY = "gsm_repairs_cache";

export function RepairCacheProvider({ children }) {
  const [repairs, setRepairs] = useState([]);

  // LOAD
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setRepairs(JSON.parse(stored));
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repairs));
  }, [repairs]);

  // ➕ ADD REPAIR
  const addRepair = (repair) => {
    const newRepair = {
      id: Date.now(),
      deviceId: generateDeviceId(repairs),
      status: "Pending",
      createdAt: new Date().toISOString(),
      timeline: [
        {
          type: "CREATED",
          message: "Repair created",
          date: new Date().toISOString(),
        },
      ],
      ...repair,
    };

    setRepairs((prev) => [newRepair, ...prev]);
  };

  // ✏️ UPDATE REPAIR + TIMELINE
  const updateRepair = (id, data) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        return {
          ...r,
          ...data,
          timeline: [
            ...(r.timeline || []),
            {
              type: "UPDATE",
              message: "Repair updated",
              date: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const deleteRepair = (id) => {
    setRepairs((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RepairCacheContext.Provider
      value={{ repairs, addRepair, updateRepair, deleteRepair }}
    >
      {children}
    </RepairCacheContext.Provider>
  );
}

export const useRepairCache = () => useContext(RepairCacheContext);

// 📅 DEVICE ID GENERATOR
function generateDeviceId(existing) {
  const now = new Date();
  const date =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getFullYear());

  const count = existing.filter((r) =>
    r.deviceId?.startsWith(date)
  ).length;

  return `${date}-${String(count + 1).padStart(2, "0")}`;
}