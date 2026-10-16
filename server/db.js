import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;
let poolConfig;
if (config.databaseUrl) {
  poolConfig = {
    connectionString: config.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
  };

  if (config.databaseSsl !== undefined) {
    poolConfig.ssl = config.databaseSsl ? { rejectUnauthorized: false } : false;
  }
}

export const pool = poolConfig ? new Pool(poolConfig) : null;

pool?.on("error", (error) => console.error("PostgreSQL pool error", error));

function databaseUnavailableError() {
  const error = new Error("PostgreSQL n'est pas configuré");
  error.code = "DATABASE_NOT_CONFIGURED";
  return error;
}

export const query = (text, params = []) => {
  if (!pool) return Promise.reject(databaseUnavailableError());
  return pool.query(text, params);
};

export async function transaction(callback) {
  if (!pool) throw databaseUnavailableError();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
