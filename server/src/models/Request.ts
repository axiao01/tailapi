// models/Request.ts
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  sessionId: String,
  timestamp: Date,
  method: String,
  url: String,
  headers: mongoose.Schema.Types.Mixed,
  body: String,
  response: {
    status: Number,
    headers: mongoose.Schema.Types.Mixed,
    body: String,
  },
  suggestedVariables: mongoose.Schema.Types.Mixed,
  dependsOn: [String],
});

export const RequestModel = mongoose.model("Request", requestSchema);
