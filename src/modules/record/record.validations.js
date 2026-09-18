import * as z from "zod";
import {
  DOWNLOAD_STATUSES,
  LINK_STATUSES,
  RECORD_TYPES,
} from "./record.model.js";

function normalizeEnumValue(value, allowed) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  const match = allowed.find((a) => a.toLowerCase() === trimmed.toLowerCase());
  return match || trimmed;
}

const createRecordSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(5, "Phone number looks too short"),
  address: z.string().trim().optional().default(""),
  organisation: z.string().trim().optional().default(""),
  type: z.preprocess(
    (val) => normalizeEnumValue(val, RECORD_TYPES),
    z.enum(RECORD_TYPES, {
      errorMap: () => ({
        message: `Type must be one of: ${RECORD_TYPES.join(", ")}`,
      }),
    }),
  ),
  linkStatus: z.preprocess(
    (val) =>
      val === undefined || val === ""
        ? undefined
        : normalizeEnumValue(val, LINK_STATUSES),
    z.enum(LINK_STATUSES).optional().default("Pending"),
  ),
  downloadStatus: z.preprocess(
    (val) =>
      val === undefined || val === ""
        ? undefined
        : normalizeEnumValue(val, DOWNLOAD_STATUSES),
    z.enum(DOWNLOAD_STATUSES).optional().default("Pending"),
  ),
  addedOn: z.coerce.date().optional(),
});

const updateRecordSchema = createRecordSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export { createRecordSchema, updateRecordSchema };
