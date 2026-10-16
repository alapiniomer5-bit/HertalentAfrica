import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT invalide");

export function normalizeDatabaseUrl(value) {
  return value?.trim().replace(/^["']+|["']+$/g, "") ?? "";
}

const rawDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
let databaseUrl = null;
if (rawDatabaseUrl) {
  try {
    databaseUrl = new URL(rawDatabaseUrl);
  } catch {
    throw new Error("DATABASE_URL doit être une URI PostgreSQL valide");
  }
  if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
    throw new Error("DATABASE_URL doit commencer par postgres:// ou postgresql://");
  }
}

const sslValue = process.env.DATABASE_SSL?.trim().toLowerCase();
if (sslValue && !["true", "false"].includes(sslValue)) {
  throw new Error('DATABASE_SSL doit valoir "true", "false" ou rester vide');
}

export const config = {
  port,
  databaseUrl: databaseUrl?.toString() ?? null,
  // undefined laisse node-postgres respecter sslmode dans DATABASE_URL.
  databaseSsl: sslValue ? sslValue === "true" : undefined,
  sessionTtlDays: Math.max(1, Number(process.env.SESSION_TTL_DAYS ?? 90)),
  isProduction: process.env.NODE_ENV === "production",
};
