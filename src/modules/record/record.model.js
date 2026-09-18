import mongoose from "mongoose";

const RECORD_TYPES = [
  "Student",
  "Teacher",
  "Mentor",
  "Job Seeker",
  "Institute",
  "Other",
];
const LINK_STATUSES = ["Pending", "Sent"];
const DOWNLOAD_STATUSES = ["Pending", "Downloaded"];

const recordSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    organisation: { type: String, trim: true, default: "" },
    type: { type: String, enum: RECORD_TYPES, required: true },
    linkStatus: { type: String, enum: LINK_STATUSES, default: "Pending" },
    downloadStatus: {
      type: String,
      enum: DOWNLOAD_STATUSES,
      default: "Pending",
    },
    addedOn: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

recordSchema.index({ name: "text", email: "text", phone: "text" });
recordSchema.index({ type: 1 });
recordSchema.index({ addedOn: -1 });
const Record = mongoose.model("Record", recordSchema);

export default Record;

export { RECORD_TYPES, LINK_STATUSES, DOWNLOAD_STATUSES };
