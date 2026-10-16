# Architecture

```text
Navigateur
  ├── Interface statique originale (`public/`)
  ├── cache local de secours
  └── API REST `/api/*`
          │
Node.js / Express
  ├── sessions anonymes
  ├── synchronisation d’état
  ├── catalogue talents / missions
  ├── validation et limites de taille
  └── fichiers statiques
          │
PostgreSQL
  ├── demo_sessions (intégration active du prototype)
  ├── users / talent_profiles / recruiter_profiles
  ├── missions / applications
  ├── conversations / messages
  └── favorites
```

Le stockage `demo_sessions.state` rend la première version immédiatement compatible avec un backend sans réécrire toute son interface. Les tables normalisées permettent ensuite de migrer progressivement chaque module vers de véritables comptes multi-utilisateurs.

## Frontières fonctionnelles

- Identité : `users`, profils talent et recruteur.
- Marketplace : talents, missions et favoris.
- Collaboration : candidatures, conversations et messages.
- Compatibilité prototype : session JSONB synchronisée.

## Production

- Utiliser un mot de passe PostgreSQL fort et un gestionnaire de secrets.
- Activer TLS pour PostgreSQL avec `DATABASE_SSL=true` lorsque l’hébergeur l’exige.
- Ajouter une authentification vérifiée avant d’exposer les écritures multi-utilisateurs.
- Ajouter sauvegardes, supervision, limitation de débit et politique de conservation des données.
