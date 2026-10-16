import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createSessionToken, hashToken, bearerToken } from "../server/lib/tokens.js";
import { normalizeDatabaseUrl } from "../server/config.js";

test("les jetons de session sont aléatoires et hachés", () => {
  const first = createSessionToken();
  const second = createSessionToken();
  assert.notEqual(first, second);
  assert.equal(hashToken(first).length, 64);
  assert.equal(hashToken(first), hashToken(first));
});

test("le middleware lit un jeton Bearer", () => {
  const request = { get: () => "Bearer exemple" };
  assert.equal(bearerToken(request), "exemple");
});

test("le frontend charge toutes ses ressources locales", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /href="brand\.css"/);
  assert.match(html, /src="data\.js"/);
  assert.match(html, /src="app\.js"/);
  assert.match(html, /href="assets\/hertalent-logo\.png"/);
  assert.match(app, /class="brand-logo" src="assets\/hertalent-logo\.png"/);
  assert.doesNotMatch(app, /class="brand-mark"/);
});

test("la migration contient les principaux modules métier", async () => {
  const sql = await readFile(new URL("../server/migrations/001_initial_schema.sql", import.meta.url), "utf8");
  for (const table of ["demo_sessions", "users", "talent_profiles", "recruiter_profiles", "missions", "applications", "conversations", "messages", "favorites"]) {
    assert.match(sql, new RegExp(`CREATE TABLE ${table}\\b`));
  }
});

test("l'exemple d'environnement sépare le port web du port PostgreSQL", async () => {
  const env = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  assert.match(env, /^PORT=3000$/m);
  assert.match(env, /^DATABASE_URL=postgresql:\/\//m);
  assert.doesNotMatch(env, /SUPABASE_SECRET_KEY|sb_secret_/);
});

test("la configuration Render ne publie aucun secret", async () => {
  const blueprint = await readFile(new URL("../render.yaml", import.meta.url), "utf8");
  assert.match(blueprint, /plan: free/);
  assert.match(blueprint, /key: DATABASE_URL\s+sync: false/);
  assert.doesNotMatch(blueprint, /postgres(?:ql)?:\/\//);
});

test("les guillemets parasites sont retirés de DATABASE_URL", () => {
  const url = "postgresql://user:password@example.com:6543/postgres";
  assert.equal(normalizeDatabaseUrl(`\"${url}\"`), url);
  assert.equal(normalizeDatabaseUrl(`${url}\"`), url);
  assert.equal(normalizeDatabaseUrl(`'${url}'`), url);
});
