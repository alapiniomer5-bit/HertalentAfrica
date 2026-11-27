---
name: ui-motion-reel
description: Créer une vidéo/animation promo courte (15–25 s) au style "UI motion design" — typographie cinétique, curseurs multijoueurs, cartes 3D flottantes, menu radial, roue de mots 3D, transitions en blocs de couleur, signature manuscrite lumineuse, blob dégradé liquide, final logo + mascotte. Utiliser quand on demande une intro animée, un reel produit, un teaser de marque, une landing animée ou un motion design web (GSAP / Framer Motion / Remotion / CSS).
---

# UI Motion Reel

Recette tirée d'un reel de référence (~18 s utiles, 1024×576, 30 fps). Rythme : **une idée visuelle par 1,5–3 s**, transitions enchaînées sans coupe sèche.

## 1. Structure (storyboard type)

| t (s) | Scène | Technique clé |
|---|---|---|
| 0–2 | **Titre cinétique** | Lettres du nom de marque, chacune dans une police/couleur différente, apparaissent une à une avec cadre de sélection + poignées + curseur nommé |
| 2–3 | **Explosion 3D** | Cartes/icônes en verre flottent en profondeur (perspective, flou de profondeur, aberration chromatique) |
| 3 | **Flash blanc** | Passage sombre → clair (fondu blanc 6–8 frames) |
| 4–5 | **Menu radial** | Bouton central, items (icône + label + raccourci) qui se déploient en cercle, stagger 40 ms |
| 6–8 | **Roue de mots 3D** | Liste verticale sur cylindre (rotateX), mot actif dans une pilule avec avatar ; défile : Design → Prototype → Collaborate → Build → Ship |
| 8–9 | **Wipe blocs couleur** | Rectangles plein-couleur glissent par bandes et recouvrent l'écran → révèle la scène suivante |
| 10–11 | **Barre d'outils** | Toolbar UI flottante, curseur clique un outil, caméra zoome + perspective sur l'outil |
| 12–15 | **Signature** | Texte script tracé au stroke (stroke-dashoffset), une pointe lumineuse + curseur nommé suit le tracé |
| 16 | **Blob CTA** | Forme liquide floue en dégradé (bleu/rose/orange), texte CTA sur chemin courbe qui ondule |
| 17–18 | **Final : logo + avatar** | Logo seul, puis glisse à gauche, avatar/mascotte entre à droite (clin d'œil) |

Adapter : garder l'ordre **énergie haute (sombre) → clarté (blanc) → démo produit → signature perso → CTA → logo**.

## 2. Système visuel

- **Fonds** : sombre `#0e0f14`→`#1c1d22` (dégradé + rayons lumineux diagonaux) ; clair `#f5f5f7` avec grille de points très légère.
- **Accents** : vert `#1ed38a`, violet `#a259ff`, rouge `#f24e1e`, bleu `#0d99ff`, orange `#ff7262`. Max 3 par scène.
- **Typo UI** : sans-serif géométrique (Inter). Titre : mélange volontaire serif / sans / script / mono.
- **Éléments "UI réels"** : cadre de sélection 1px bleu + 4 poignées carrées, badge dimensions (`204 × 238`), étiquette de curseur colorée (prénom), ombres douces `0 10px 30px rgba(0,0,0,.12)`.
- **Profondeur** : `perspective: 1200px`, flou de profondeur (`filter: blur()` proportionnel à z), aberration chromatique (ombres texte décalées rouge/cyan).

## 3. Règles de mouvement

- Easing par défaut : `cubic-bezier(.16,1,.3,1)` (expo-out) pour les entrées ; `cubic-bezier(.7,0,.84,0)` pour les sorties.
- Overshoot léger (`back.out(1.4)`) sur pop-ins de boutons/pilules.
- Durées : micro 150–250 ms, éléments 400–600 ms, mouvements caméra 800–1200 ms.
- Stagger : 30–60 ms (lettres, items de menu).
- **Toujours un mouvement de caméra lent en fond** (scale 1 → 1.05 ou légère rotation) pour éviter tout plan figé.
- Motion blur sur déplacements rapides (blur directionnel 4–8 px pendant 2–3 frames).
- Curseurs : trajectoires en courbe de Bézier, jamais en ligne droite ; petit « press » (scale .9) au clic.

## 4. Mise en œuvre

Choisir selon le projet :
- **Web (landing/intro)** : GSAP + timeline unique, ou Framer Motion pour React.
- **Vidéo exportable** : Remotion (React → MP4) ; une `<Sequence>` par scène.
- **Sans dépendance** : CSS keyframes + SVG.

Recettes de code prêtes : `references/recipes.md`.

## 5. Process

1. Lister les 6–9 scènes adaptées à la marque (remplacer les mots de la roue, le nom, le CTA, le logo).
2. Bloquer le timing (tableau §1) avant de coder.
3. Construire scène par scène dans **une seule timeline** ; chaque transition chevauche la scène suivante de 150–300 ms.
4. Vérifier : 30/60 fps fluide, lisible en mobile (texte ≥ 24 px à 1080p), `prefers-reduced-motion` → version fondus simples.
5. Export vidéo : 1920×1080 (16:9) ou 1080×1920 (9:16 réseaux) ; H.264, 30 fps.

## Ne pas faire

- Reprendre le logo, la marque ou l'interface exacte d'un produit tiers : créer ses propres éléments UI inspirés.
- Plus de 3 accents de couleur par scène, ou plus d'un mouvement principal à la fois.
