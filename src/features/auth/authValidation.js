import { ROLE_OPTIONS, normalizeEmailForSearch } from "./authRepository";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values) {
  const errors = {};

  if (!String(values?.email || "").trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(normalizeEmailForSearch(values.email))) {
    errors.email = "Enter a valid email address.";
  }

  if (!String(values?.password || "").trim()) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateUserForm(
  values,
  existingUsers = [],
  {
    mode = "create",
    currentUserId = null,
    requirePassword = mode !== "edit",
  } = {}
) {
  const errors = {};
  const name = String(values?.name || "").trim();
  const email = normalizeEmailForSearch(values?.email);
  const password = String(values?.password || "");
  const confirmPassword = String(values?.confirmPassword || "");

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  } else {
    const duplicate = existingUsers.find(
      (user) =>
        normalizeEmailForSearch(user.email) === email &&
        String(user.id) !== String(currentUserId)
    );

    if (duplicate) {
      errors.email = "This email is already registered.";
    }
  }

  if (!ROLE_OPTIONS.includes(values?.role)) {
    errors.role = "Choose a valid role.";
  }

  if (requirePassword && password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!requirePassword && password && password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (confirmPassword || requirePassword) {
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}
