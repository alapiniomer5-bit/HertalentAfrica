import express from "express";
import compression from "compression";
import helmet from "helmet";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "./config.js";
import { pool, query } from "./db.js";
import { sessionRouter } from "./routes/session.js";
import { stateRouter } from "./routes/state.js";
import { catalogRouter } from "./routes/catalog.js";

const app = express();
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, "public");

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", "data:"], fontSrc: ["'self'"], connectSrc: ["'self'"] } },
}));
app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_request, response, next) => {
  if (!pool) return response.json({ status: "ok", database: "not_configured" });
  try {
    await query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("PostgreSQL health check failed", error);
    response.status(503).json({ status: "degraded", database: "unavailable" });
  }
});
app.use("/api/session", sessionRouter);
app.use("/api/state", stateRouter);
app.use("/api", catalogRouter);

app.use(express.static(publicDir, { maxAge: config.isProduction ? "1h" : 0, etag: true }));
app.get("/{*path}", (_request, response) => response.sendFile(join(publicDir, "index.html")));

app.use((error, _request, response, _next) => {
  if (error.code === "DATABASE_NOT_CONFIGURED") {
    return response.status(503).json({ error: "Base de données non configurée" });
  }
  console.error(error);
  response.status(500).json({ error: config.isProduction ? "Erreur interne" : error.message });
});

const server = app.listen(config.port, () => console.log(`HerTalent Africa: http://localhost:${config.port}`));

async function shutdown(signal) {
  console.log(`${signal}: arrêt en cours`);
  server.close(async () => { await pool?.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
