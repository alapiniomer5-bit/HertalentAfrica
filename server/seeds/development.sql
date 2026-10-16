INSERT INTO users (id, email, display_name, role, country, city) VALUES
  ('10000000-0000-4000-8000-000000000001', 'amina@example.test', 'Amina Adéoti', 'talent', 'Bénin', 'Cotonou'),
  ('10000000-0000-4000-8000-000000000002', 'fatou@example.test', 'Fatou Ndiaye', 'talent', 'Sénégal', 'Dakar'),
  ('10000000-0000-4000-8000-000000000003', 'grace@example.test', 'Grâce Akakpo', 'talent', 'Togo', 'Lomé'),
  ('20000000-0000-4000-8000-000000000001', 'naya@example.test', 'Naya Studio', 'recruiter', 'Bénin', 'Cotonou'),
  ('20000000-0000-4000-8000-000000000002', 'kora@example.test', 'Kora Collectif', 'recruiter', 'Sénégal', 'Dakar')
ON CONFLICT DO NOTHING;

INSERT INTO talent_profiles (user_id, headline, expertise, bio, skills, day_rate, experience_years, availability, verified) VALUES
  ('10000000-0000-4000-8000-000000000001', 'Product designer · UX/UI', 'Design & création', 'Je conçois des produits numériques accessibles et ancrés dans les usages réels.', ARRAY['Figma','UX research','Design system'], 65000, 5, 'available', TRUE),
  ('10000000-0000-4000-8000-000000000002', 'Développeuse web full stack', 'Développement', 'Je développe des applications web performantes, maintenables et adaptées aux équipes produit.', ARRAY['React','Node.js','PostgreSQL'], 80000, 6, 'available', TRUE),
  ('10000000-0000-4000-8000-000000000003', 'Data analyst · Business intelligence', 'Data & IA', 'Je transforme les données opérationnelles en décisions simples et actionnables.', ARRAY['Python','Power BI','SQL'], 70000, 4, 'soon', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO recruiter_profiles (user_id, organization, sector, description, verified) VALUES
  ('20000000-0000-4000-8000-000000000001', 'Naya Studio', 'Technologie', 'Studio produit spécialisé dans les services financiers accessibles.', TRUE),
  ('20000000-0000-4000-8000-000000000002', 'Kora Collectif', 'Commerce', 'Collectif de marques africaines engagées.', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO missions (id, recruiter_id, title, description, expertise, skills, deliverables, country, work_mode, collaboration_type, duration, budget_min, budget_max, status) VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Concevoir une application qui simplifie l’épargne', 'Concevoir un parcours d’inscription et un prototype testable pour de jeunes actifs.', 'Design & création', ARRAY['Figma','UX/UI','Prototype'], ARRAY['Recherche','Parcours','Prototype'], 'Bénin', 'remote', 'Mission freelance', '3 à 4 semaines', 250000, 400000, 'published'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'Développer le site d’une marque africaine engagée', 'Créer un site vitrine rapide, accessible sur mobile et optimisé pour le référencement.', 'Développement', ARRAY['React','Responsive','SEO'], ARRAY['Site responsive','Documentation'], 'Sénégal', 'remote', 'Mission freelance', '4 à 6 semaines', 450000, 700000, 'published')
ON CONFLICT DO NOTHING;
