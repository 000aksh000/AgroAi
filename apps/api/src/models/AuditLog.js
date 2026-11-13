import mongoose, { Schema } from "mongoose";
const AuditLogSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id?.toString();
        ret.adminId = ret.adminId?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
AuditLogSchema.index({ createdAt: -1 });
export const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
