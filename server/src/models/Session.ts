// models/Session.ts
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  createdAt: { type: Date, default: Date.now },
  label: String,
  tags: [String],
  requests: [mongoose.Schema.Types.ObjectId],
});

export const SessionModel = mongoose.model("Session", sessionSchema);
