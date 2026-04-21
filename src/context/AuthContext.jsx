import { createContext, useContext, useEffect, useState } from "react";

import {
  createLocalUser,
  readStoredSession,
  readStoredUsers,
  sanitizeUser,
  writeStoredSession,
  writeStoredUsers,
} from "../features/auth/authRepository";

const AuthContext = createContext();

function getInitialAuthState() {
  const initialUsers = readStoredUsers();

  return {
    initialUsers,
    initialSession: readStoredSession(initialUsers),
  };
}

export function AuthProvider({ children }) {
  const [{ initialUsers, initialSession }] = useState(getInitialAuthState);
  const [users, setUsers] = useState(initialUsers);
  const [sessionUserId, setSessionUserId] = useState(initialSession?.id || null);
  const loading = false;
  const safeUsers = users.map((storedUser) => sanitizeUser(storedUser));
  const user =
    safeUsers.find((storedUser) => String(storedUser.id) === String(sessionUserId)) ||
    null;

  useEffect(() => {
    writeStoredUsers(users);
  }, [users]);

  useEffect(() => {
    writeStoredSession(user);
  }, [user]);

  const login = ({ email, password }) => {
    const matchedUser = users.find(
      (storedUser) =>
        storedUser.email.toLowerCase() === String(email || "").trim().toLowerCase()
    );

    if (!matchedUser || matchedUser.password !== password) {
      return {
        success: false,
        error: "Incorrect email or password.",
      };
    }

    const sessionUser = sanitizeUser(matchedUser);
    setSessionUserId(matchedUser.id);

    return {
      success: true,
      user: sessionUser,
    };
  };

  const signup = (values) => {
    const normalizedEmail = String(values?.email || "").trim().toLowerCase();

    if (users.some((storedUser) => storedUser.email === normalizedEmail)) {
      return {
        success: false,
        error: "This email is already registered.",
      };
    }

    const createdUser = createLocalUser(values, users);

    setUsers((current) => [createdUser, ...current]);
    const sessionUser = sanitizeUser(createdUser);
    setSessionUserId(createdUser.id);

    return {
      success: true,
      user: sessionUser,
    };
  };

  const createUser = (values) => {
    const normalizedEmail = String(values?.email || "").trim().toLowerCase();

    if (users.some((storedUser) => storedUser.email === normalizedEmail)) {
      return {
        success: false,
        error: "This email is already registered.",
      };
    }

    const createdUser = createLocalUser(values, users);
    setUsers((current) => [createdUser, ...current]);

    return {
      success: true,
      user: sanitizeUser(createdUser),
    };
  };

  const updateUser = (id, values) => {
    const targetUser = users.find((storedUser) => String(storedUser.id) === String(id));

    if (!targetUser) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    const adminCount = users.filter((storedUser) => storedUser.role === "Admin").length;
    const nextRole = values.role || targetUser.role;
    const nextEmail = String(values.email || targetUser.email).trim().toLowerCase();

    if (
      users.some(
        (storedUser) =>
          storedUser.email === nextEmail && String(storedUser.id) !== String(id)
      )
    ) {
      return {
        success: false,
        error: "This email is already registered.",
      };
    }

    if (
      targetUser.role === "Admin" &&
      nextRole !== "Admin" &&
      adminCount === 1
    ) {
      return {
        success: false,
        error: "You must keep at least one admin account.",
      };
    }

    const updatedUser = {
      ...targetUser,
      name: String(values.name || targetUser.name).trim(),
      email: nextEmail,
      role: nextRole,
      password: values.password ? String(values.password) : targetUser.password,
    };

    setUsers((current) =>
      current.map((storedUser) =>
        String(storedUser.id) === String(id) ? updatedUser : storedUser
      )
    );

    return {
      success: true,
      user: sanitizeUser(updatedUser),
    };
  };

  const deleteUser = (id) => {
    const targetUser = users.find((storedUser) => String(storedUser.id) === String(id));

    if (!targetUser) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    if (String(targetUser.id) === String(user?.id)) {
      return {
        success: false,
        error: "You cannot delete the account you are currently using.",
      };
    }

    const adminCount = users.filter((storedUser) => storedUser.role === "Admin").length;

    if (targetUser.role === "Admin" && adminCount === 1) {
      return {
        success: false,
        error: "You must keep at least one admin account.",
      };
    }

    setUsers((current) =>
      current.filter((storedUser) => String(storedUser.id) !== String(id))
    );

    return {
      success: true,
      user: sanitizeUser(targetUser),
    };
  };

  const logout = () => {
    setSessionUserId(null);
  };

  const value = {
    user,
    users: safeUsers,
    login,
    signup,
    createUser,
    updateUser,
    deleteUser,
    logout,
    loading,
    getUserById: (id) =>
      safeUsers.find((storedUser) => String(storedUser.id) === String(id)),
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
