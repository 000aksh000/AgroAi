import mongoose, { Schema } from "mongoose";
const ConversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, default: "New Conversation" },
    farmId: { type: Schema.Types.ObjectId, ref: "Farm" },
    messages: [
      {
        id: { type: String, required: true },
        role: { type: String, enum: ["user", "assistant", "system"], required: true },
        content: { type: String, required: true },
        farmContextUsed: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id?.toString();
        ret.userId = ret.userId?.toString();
        if (ret.farmId) ret.farmId = ret.farmId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
ConversationSchema.index({ userId: 1, updatedAt: -1 });
export const Conversation = mongoose.model(
  "Conversation",
  ConversationSchema
);
