import {
  DEFAULT_TECHNICIANS,
  STATUS_OPTIONS,
} from "./repairModel";

function normalizeSearchValue(value) {
  return String(value || "").trim().toLowerCase();
}

function getTimeValue(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function sortRepairs(repairs, sortBy = "newest") {
  const items = [...repairs];

  return items.sort((first, second) => {
    if (sortBy === "oldest") {
      return getTimeValue(first.createdAt) - getTimeValue(second.createdAt);
    }

    if (sortBy === "priceHigh") {
      return Number(second.price || 0) - Number(first.price || 0);
    }

    if (sortBy === "priceLow") {
      return Number(first.price || 0) - Number(second.price || 0);
    }

    if (sortBy === "dueSoon") {
      const firstDue = getTimeValue(first.dueDate || "9999-12-31");
      const secondDue = getTimeValue(second.dueDate || "9999-12-31");
      return firstDue - secondDue;
    }

    return getTimeValue(second.createdAt) - getTimeValue(first.createdAt);
  });
}

export function filterRepairs(
  repairs,
  { search = "", status = "All", sortBy = "newest" } = {}
) {
  const query = normalizeSearchValue(search);

  return sortRepairs(repairs, sortBy).filter((repair) => {
    const matchesStatus = status === "All" ? true : repair.status === status;

    if (!matchesStatus) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      repair.deviceId,
      repair.client,
      repair.phone,
      repair.device,
      repair.technician,
      repair.status,
      repair.notes,
      ...(repair.parts || []),
    ]
      .filter(Boolean)
      .some((value) => normalizeSearchValue(value).includes(query));
  });
}

export function getRepairStatusCounts(repairs) {
  return {
    All: repairs.length,
    ...Object.fromEntries(
      STATUS_OPTIONS.map((status) => [
        status,
        repairs.filter((repair) => repair.status === status).length,
      ])
    ),
  };
}

export function isRepairOverdue(repair, referenceDate = new Date()) {
  if (!repair?.dueDate || repair.status === "Completed") {
    return false;
  }

  const dueDate = new Date(repair.dueDate);
  const compareDate = new Date(referenceDate);

  dueDate.setHours(23, 59, 59, 999);
  compareDate.setHours(0, 0, 0, 0);

  return dueDate < compareDate;
}

export function getDueTodayRepairs(repairs, referenceDate = new Date()) {
  const target = new Date(referenceDate);
  const targetKey = target.toISOString().slice(0, 10);

  return repairs.filter(
    (repair) => repair.dueDate && repair.dueDate.slice(0, 10) === targetKey
  );
}

export function getOverdueRepairs(repairs, referenceDate = new Date()) {
  return repairs.filter((repair) => isRepairOverdue(repair, referenceDate));
}

export function getCompletedRevenue(repairs) {
  return repairs
    .filter((repair) => repair.status === "Completed")
    .reduce((sum, repair) => sum + Number(repair.price || 0), 0);
}

export function getAverageRepairValue(repairs) {
  if (repairs.length === 0) {
    return 0;
  }

  const totalValue = repairs.reduce(
    (sum, repair) => sum + Number(repair.price || 0),
    0
  );

  return totalValue / repairs.length;
}

export function getCompletionRate(repairs) {
  if (repairs.length === 0) {
    return 0;
  }

  return Math.round(
    (repairs.filter((repair) => repair.status === "Completed").length /
      repairs.length) *
      100
  );
}

export function getActiveTechnicians(repairs) {
  return new Set(repairs.map((repair) => repair.technician).filter(Boolean))
    .size;
}

export function getTopTechnician(repairs) {
  const grouped = repairs.reduce((accumulator, repair) => {
    const key = repair.technician || "Unassigned";

    if (!accumulator[key]) {
      accumulator[key] = {
        name: key,
        total: 0,
        completed: 0,
        revenue: 0,
      };
    }

    accumulator[key].total += 1;

    if (repair.status === "Completed") {
      accumulator[key].completed += 1;
      accumulator[key].revenue += Number(repair.price || 0);
    }

    return accumulator;
  }, {});

  return Object.values(grouped).sort((first, second) => {
    if (second.completed !== first.completed) {
      return second.completed - first.completed;
    }

    return second.revenue - first.revenue;
  })[0] || null;
}

export function getDashboardMetrics(repairs, referenceDate = new Date()) {
  const dueToday = getDueTodayRepairs(repairs, referenceDate).filter(
    (repair) => repair.status !== "Completed"
  ).length;
  const overdue = getOverdueRepairs(repairs, referenceDate).length;

  return {
    total: repairs.length,
    pending: repairs.filter((repair) => repair.status === "Pending").length,
    inProgress: repairs.filter((repair) => repair.status === "In Progress").length,
    completed: repairs.filter((repair) => repair.status === "Completed").length,
    completedRevenue: getCompletedRevenue(repairs),
    activeTechnicians: getActiveTechnicians(repairs),
    dueToday,
    overdue,
    averageValue: getAverageRepairValue(repairs),
    completionRate: getCompletionRate(repairs),
    topTechnician: getTopTechnician(repairs),
  };
}

export function getTechnicianList(repairs) {
  return Array.from(
    new Set([
      ...DEFAULT_TECHNICIANS,
      ...repairs.map((repair) => repair.technician).filter(Boolean),
    ])
  );
}

export function getTechnicianStats(repairs, technicians = getTechnicianList(repairs)) {
  return technicians.map((technician) => {
    const items = repairs.filter((repair) => repair.technician === technician);
    const completed = items.filter((repair) => repair.status === "Completed").length;

    return {
      technician,
      total: items.length,
      pending: items.filter((repair) => repair.status === "Pending").length,
      inProgress: items.filter((repair) => repair.status === "In Progress").length,
      completed,
      revenue: items
        .filter((repair) => repair.status === "Completed")
        .reduce((sum, repair) => sum + Number(repair.price || 0), 0),
      completionRate:
        items.length === 0 ? 0 : Math.round((completed / items.length) * 100),
    };
  });
}
