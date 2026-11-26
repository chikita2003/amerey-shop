# CLAUDE.md

Boutique en ligne statique **AMEREY SHOP** (prêt-à-porter homme & femme + sur-mesure), hébergée sur **GitHub Pages**. Aucun build, aucun framework, aucune dépendance npm : HTML/CSS/JS vanilla servis tels quels. Langue du site et des commits : **français**.

## Structure

- `index.html` : boutique publique (hero, catégories, catalogue, formulaire sur-mesure, footer). Charge jsPDF (CDN), puis `assets/js/site-data.js`, puis `assets/js/app.js`.
- `assets/js/site-data.js` : constantes globales — `MESURE_BG_SMALL` (image base64), `SUBLABELS` (libellés des sous-catégories), `CAT_META` (titre/description par catégorie).
- `assets/js/app.js` : toute la logique de la boutique :
  - `fetch('data/catalogue.json?v=<timestamp>', {cache:'no-store'})` remplit `PRODUCTS`, puis `renderSubfilters()` / `renderGrid()`.
  - Commandes via WhatsApp : `waLink()` → `https://wa.me/22956990915`.
  - Assistant « sur-mesure » multi-étapes (`WIZ_STEPS`, `wizRender`, `wizValid`) avec génération d'un PDF de mesures (`generateMesurePDF`, jsPDF).
  - Lightbox photos, bannière cookies (`localStorage` clé `amerey_cookie_choice`).
- `assets/css/style.css` : styles (fichier volumineux, contient des images base64).
- `assets/images/products/` : photos produits (`.jpg`), référencées par chemin relatif dans le catalogue.
- `data/catalogue.json` : **source de vérité du catalogue**.
- `admin.html` : gestionnaire de catalogue autonome (HTML+JS inline) qui lit/écrit `data/catalogue.json` directement via l'API Git Data de GitHub (ref → commit → tree → blob → nouveau commit), avec un token fine-grained saisi par l'utilisateur (jamais stocké).
- `backup-before-refactor/` : anciennes versions (ignorées par git) où le catalogue et les photos étaient embarqués dans `index.html`. Ne pas modifier.
- `.nojekyll` : requis pour GitHub Pages.

## Format du catalogue

```json
{
  "femme": [ { "sub": "tenue", "name": "...", "price": "45 000 FCFA",
               "photo": "assets/images/products/xxx.jpg",
               "badge": "Premium", "desc": "...", "colors": ["Rose", "Gris"] } ],
  "homme": [ ... ],
  "mesure": []
}
```

- Champs obligatoires : `sub`, `name`, `price`, `photo`. Optionnels : `badge`, `desc`, `colors`.
- `sub` ∈ clés de `SUBLABELS` (`tenue`, `haut`, `bas`, …).
- Prix au format texte `"45 000 FCFA"` (espace comme séparateur de milliers).
- Attention : un article ajouté via `admin.html` stocke sa photo en **data URI base64** dans `photo` (pas de fichier image séparé) — cela fait grossir le JSON.

## Développer / tester

Le catalogue est chargé par `fetch`, donc **ouvrir `index.html` en `file://` ne fonctionne pas**. Lancer un serveur local :

```bash
python3 -m http.server 8000
# puis http://localhost:8000/
```

Pas de tests automatisés ni de linter. Vérifier manuellement dans le navigateur (console sans erreur, grille affichée, liens WhatsApp, assistant sur-mesure + PDF).

## Conventions et points d'attention

- Le HTML est construit par template strings : **toujours passer les champs produit par `escapeHtml()`** (présente dans `app.js` et dans `admin.html`) avant de les insérer dans `innerHTML` ou un attribut.
- `admin.html` ne gère que le format JSON (l'ancien format « catalogue embarqué dans index.html » a été retiré). Les commits de l'admin sont faits directement sur `main`, avec un message construit à partir de `pendingLog` (ex. « Ajout article : … »).
- `admin.html` porte `<meta name="robots" content="noindex, nofollow">` : la garder.
- Le `README.md` est en partie obsolète (il mentionne `index.html` comme chemin du catalogue dans l'admin ; le chemin actuel est `data/catalogue.json`).
- Ne jamais committer de token GitHub ni l'ajouter dans le code.
