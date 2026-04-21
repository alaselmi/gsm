import {
  DEFAULT_TECHNICIANS,
  normalizePartsValue,
  STATUS_OPTIONS,
} from "./repairModel";

const PHONE_REGEX = /^[+\d][\d\s-]{6,}$/;

export function validateRepairForm(values) {
  const errors = {};

  if (!String(values?.client || "").trim()) {
    errors.client = "Client name is required.";
  }

  const phone = String(values?.phone || "").trim();
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!String(values?.device || "").trim()) {
    errors.device = "Device name is required.";
  }

  if (!DEFAULT_TECHNICIANS.includes(values?.technician)) {
    errors.technician = "Choose a technician.";
  }

  const price = Number(values?.price);
  if (Number.isNaN(price) || price < 0) {
    errors.price = "Price must be a valid positive number.";
  }

  if (!STATUS_OPTIONS.includes(values?.status)) {
    errors.status = "Choose a valid status.";
  }

  if (values?.dueDate) {
    const dueDate = new Date(values.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      errors.dueDate = "Enter a valid due date.";
    }
  }

  if (normalizePartsValue(values?.parts).length > 8) {
    errors.parts = "Keep the parts list concise.";
  }

  if (String(values?.notes || "").trim().length > 500) {
    errors.notes = "Notes should stay under 500 characters.";
  }

  return errors;
}
