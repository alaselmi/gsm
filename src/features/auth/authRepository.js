import { USERS } from "../../data/mockData";

export const SESSION_STORAGE_KEY = "gsm_user";
export const USERS_STORAGE_KEY = "gsm_users";
export const ROLE_OPTIONS = ["Admin", "Technician", "User"];
export const DEMO_CREDENTIALS = [
  {
    email: "john@test.com",
    password: "admin123",
    role: "Admin",
  },
  {
    email: "ali@test.com",
    password: "demo123",
    role: "Technician",
  },
];

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeRole(role) {
  return ROLE_OPTIONS.includes(role) ? role : "User";
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function normalizeStoredUser(user, index = 0) {
  return {
    id: String(user?.id ?? `user-${Date.now()}-${index}`),
    name: String(user?.name || `User ${index + 1}`).trim(),
    email: normalizeEmail(user?.email),
    role: normalizeRole(user?.role),
    password: String(user?.password || "demo123"),
    createdAt: user?.createdAt || new Date().toISOString(),
  };
}

export function buildSeedUsers() {
  return USERS.map((user, index) =>
    normalizeStoredUser(
      {
        ...user,
        password: index === 0 ? "admin123" : "demo123",
        createdAt: new Date(2026, 3, 12 + index, 10, 15).toISOString(),
      },
      index
    )
  );
}

export function readStoredUsers() {
  if (typeof window === "undefined") {
    return buildSeedUsers();
  }

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);

    if (!stored) {
      return buildSeedUsers();
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return buildSeedUsers();
    }

    return parsed.map((user, index) => normalizeStoredUser(user, index));
  } catch {
    return buildSeedUsers();
  }
}

export function writeStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function readStoredSession(users) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    const matchedUser = users.find(
      (user) =>
        String(user.id) === String(parsed?.id) ||
        normalizeEmail(user.email) === normalizeEmail(parsed?.email)
    );

    return sanitizeUser(matchedUser);
  } catch {
    return null;
  }
}

export function writeStoredSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sanitizeUser(user)));
}

export function createLocalUser(values, existingUsers = []) {
  return normalizeStoredUser(
    {
      id: `user-${Date.now()}`,
      name: values?.name,
      email: values?.email,
      role: values?.role || "User",
      password: values?.password,
      createdAt: new Date().toISOString(),
    },
    existingUsers.length
  );
}

export function normalizeEmailForSearch(email) {
  return normalizeEmail(email);
}
