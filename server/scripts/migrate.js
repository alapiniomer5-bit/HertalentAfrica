import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool, transaction } from "../db.js";

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

if (!pool) {
  console.warn("DATABASE_URL absente : migrations ignorées, démarrage en mode local.");
  process.exit(0);
}

await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  filename TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`);

const files = (await readdir(migrationsDir)).filter((name) => name.endsWith(".sql")).sort();
for (const filename of files) {
  const exists = await pool.query("SELECT 1 FROM schema_migrations WHERE filename = $1", [filename]);
  if (exists.rowCount) continue;
  const sql = await readFile(join(migrationsDir, filename), "utf8");
  await transaction(async (client) => {
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
  });
  console.log(`Migration appliquée: ${filename}`);
}
await pool.end();
