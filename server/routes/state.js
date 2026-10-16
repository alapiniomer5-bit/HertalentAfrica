import { Router } from "express";
import { query } from "../db.js";
import { requireSession } from "../middleware/session.js";

export const stateRouter = Router();
stateRouter.use(requireSession);

stateRouter.get("/", async (request, response, next) => {
  try {
    const result = await query("SELECT state, updated_at FROM demo_sessions WHERE id = $1", [request.sessionId]);
    response.json({ state: result.rows[0]?.state ?? {}, updatedAt: result.rows[0]?.updated_at });
  } catch (error) {
    next(error);
  }
});

stateRouter.put("/", async (request, response, next) => {
  try {
    const state = request.body?.state;
    if (!state || typeof state !== "object" || Array.isArray(state)) return response.status(400).json({ error: "État invalide" });
    const bytes = Buffer.byteLength(JSON.stringify(state));
    if (bytes > 750_000) return response.status(413).json({ error: "État trop volumineux" });
    await query("UPDATE demo_sessions SET state = $1::jsonb, updated_at = NOW() WHERE id = $2", [JSON.stringify(state), request.sessionId]);
    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

stateRouter.delete("/", async (request, response, next) => {
  try {
    await query("UPDATE demo_sessions SET state = '{}'::jsonb, updated_at = NOW() WHERE id = $1", [request.sessionId]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
