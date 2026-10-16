import { Router } from "express";
import { query } from "../db.js";
import { config } from "../config.js";
import { createSessionToken, hashToken } from "../lib/tokens.js";

export const sessionRouter = Router();

sessionRouter.post("/", async (_request, response, next) => {
  try {
    const token = createSessionToken();
    const result = await query(
      `INSERT INTO demo_sessions (token_hash, expires_at)
       VALUES ($1, NOW() + ($2::text || ' days')::interval)
       RETURNING id, expires_at`,
      [hashToken(token), String(config.sessionTtlDays)],
    );
    response.status(201).json({ token, expiresAt: result.rows[0].expires_at });
  } catch (error) {
    next(error);
  }
});
