# HerTalent Africa — version full-stack

Cette version conserve l’interface de la première maquette et ajoute un backend Node.js/Express ainsi qu’une base PostgreSQL.

Pour afficher uniquement l’interface, `npm start` fonctionne sans fichier `.env` et conserve les données dans le navigateur. Configurez PostgreSQL lorsque vous souhaitez activer la synchronisation serveur.

Avec l’extension VS Code Live Server, ouvrez ce dossier comme espace de travail puis cliquez sur **Go Live**. Le réglage `.vscode/settings.json` utilise automatiquement `public/`, où se trouve `index.html`. Cet aperçu affiche l’interface mais n’exécute pas les API Express.

## Ce qui fonctionne

- Le serveur distribue le frontend original depuis `public/`.
- Une session anonyme sécurisée par un jeton aléatoire est créée au premier accès.
- Les profils de démonstration, favoris, missions publiées, candidatures et conversations sont synchronisés dans PostgreSQL.
- Une copie locale reste disponible dans le navigateur si le serveur est momentanément inaccessible.
- PostgreSQL contient aussi un modèle relationnel normalisé pour les futurs comptes, profils, missions, candidatures et messages.
- Des API publiques permettent de lire les talents et missions stockés en SQL.

## Prérequis

- Node.js 22 ou plus récent.
- PostgreSQL 17, ou Docker Desktop.

## Démarrage avec Docker

```bash
docker compose up -d postgres
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Ouvrez ensuite `http://localhost:3000`.

Sous Windows PowerShell, remplacez la commande `cp` par :

```powershell
Copy-Item .env.example .env
```

## Déploiement

Configurez les variables d’environnement de l’hébergeur sans envoyer de fichier `.env` :

- `DATABASE_URL` doit être l’URI de connexion PostgreSQL (`postgresql://...`), et non l’URL HTTP du projet Supabase.
- `DATABASE_SSL=true` si la base distante exige TLS. Vous pouvez aussi laisser cette variable vide et fournir `?sslmode=require` dans `DATABASE_URL`.
- `NODE_ENV=production`.
- Ne définissez pas `PORT` si l’hébergeur l’injecte automatiquement.

La commande `npm start` applique désormais les migrations avant de lancer le serveur. Si le dépôt est déployé depuis un monorepo, définissez `outputs/HerTalent-Africa-Fullstack-PostgreSQL` comme répertoire racine du service.

### Adresse gratuite avec Render

Le fichier `render.yaml` configure un Web Service Node gratuit. Une fois le dépôt connecté à Render, choisissez **New > Blueprint**, sélectionnez le dépôt et renseignez `DATABASE_URL` quand Render le demande. Le service recevra automatiquement une adresse HTTPS du type `hertalent-africa.onrender.com`. Ne transférez jamais le fichier `.env` dans Git.

## Commandes

- `npm run dev` : serveur avec redémarrage automatique.
- `npm start` : serveur de production.
- `npm run db:migrate` : applique les migrations SQL manquantes.
- `npm run db:seed` : charge les exemples SQL de développement.
- `npm run check` : vérifie la syntaxe du serveur et du frontend.

## API

- `GET /api/health` : état du serveur et de PostgreSQL.
- `POST /api/session` : crée une session de démonstration.
- `GET /api/state` : lit les données synchronisées de la session.
- `PUT /api/state` : remplace les données synchronisées de la session.
- `DELETE /api/state` : réinitialise la session.
- `GET /api/talents` : catalogue SQL des talents.
- `GET /api/missions` : catalogue SQL des missions publiées.

Les routes `/api/state` exigent le jeton retourné par `/api/session` dans l’en-tête `Authorization: Bearer …`. Le frontend gère automatiquement ce jeton.

## Sécurité et prochaine étape

La synchronisation actuelle utilise une session anonyme, adaptée à la démonstration. Avant une ouverture publique, ajoutez une authentification vérifiée — lien magique, OAuth ou mot de passe — puis rattachez chaque session aux tables `users`, `talent_profiles` et `recruiter_profiles`.
