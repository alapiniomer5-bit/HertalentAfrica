import { Router } from "express";
import { query } from "../db.js";

export const catalogRouter = Router();

catalogRouter.get("/talents", async (request, response, next) => {
  try {
    const values = [];
    const clauses = ["u.role = 'talent'", "tp.is_public = TRUE"];
    if (request.query.country) { values.push(request.query.country); clauses.push(`u.country = $${values.length}`); }
    if (request.query.expertise) { values.push(request.query.expertise); clauses.push(`tp.expertise = $${values.length}`); }
    const result = await query(
      `SELECT u.id, u.display_name AS name, u.country, u.city, tp.headline, tp.expertise,
              tp.bio, tp.skills, tp.day_rate, tp.availability, tp.portfolio_url, tp.verified
       FROM users u JOIN talent_profiles tp ON tp.user_id = u.id
       WHERE ${clauses.join(" AND ")}
       ORDER BY tp.verified DESC, u.display_name ASC LIMIT 100`, values,
    );
    response.json({ talents: result.rows });
  } catch (error) { next(error); }
});

catalogRouter.get("/missions", async (request, response, next) => {
  try {
    const values = [];
    const clauses = ["m.status = 'published'"];
    if (request.query.country) { values.push(request.query.country); clauses.push(`m.country = $${values.length}`); }
    if (request.query.expertise) { values.push(request.query.expertise); clauses.push(`m.expertise = $${values.length}`); }
    const result = await query(
      `SELECT m.*, rp.organization FROM missions m
       JOIN recruiter_profiles rp ON rp.user_id = m.recruiter_id
       WHERE ${clauses.join(" AND ")}
       ORDER BY m.created_at DESC LIMIT 100`, values,
    );
    response.json({ missions: result.rows });
  } catch (error) { next(error); }
});
