import { query } from "../db.js";
import { bearerToken, hashToken } from "../lib/tokens.js";

export async function requireSession(request, response, next) {
  try {
    const token = bearerToken(request);
    if (!token) return response.status(401).json({ error: "Session requise" });
    const result = await query(
      `SELECT id FROM demo_sessions
       WHERE token_hash = $1 AND expires_at > NOW() AND revoked_at IS NULL`,
      [hashToken(token)],
    );
    if (!result.rowCount) return response.status(401).json({ error: "Session expirée" });
    request.sessionId = result.rows[0].id;
    await query("UPDATE demo_sessions SET last_seen_at = NOW() WHERE id = $1", [request.sessionId]);
    next();
  } catch (error) {
    next(error);
  }
}
