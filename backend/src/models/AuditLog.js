import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String },
  performedBy: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AuditLog", AuditLogSchema);
