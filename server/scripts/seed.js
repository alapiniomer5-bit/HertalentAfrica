import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

const file = join(dirname(fileURLToPath(import.meta.url)), "..", "seeds", "development.sql");
if (!pool) throw new Error("DATABASE_URL est requis pour charger les données de démonstration");
await pool.query(await readFile(file, "utf8"));
console.log("Données de démonstration chargées.");
await pool.end();
