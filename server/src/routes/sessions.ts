// routes/sessions.ts
import express from "express";
import { SessionModel } from "../models/Session";
import { RequestModel } from "../models/Request";

const router = express.Router();

router.get("/", async (req, res) => {
  const sessions = await SessionModel.find().sort({ createdAt: -1 });
  res.json(sessions);
});

router.get("/:sessionId/requests", async (req, res) => {
  const requests = await RequestModel.find({ sessionId: req.params.sessionId });
  res.json(requests);
});

export default router;
