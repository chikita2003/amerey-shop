# AMEREY SHOP

Ce projet est prêt pour GitHub Pages.

## Fichiers

- `index.html` : boutique publique.
- `admin.html` : gestionnaire du catalogue.

## Mettre la boutique en ligne

1. Crée un dépôt GitHub public nommé `amerey-shop`.
2. Ajoute `index.html`, `admin.html`, `README.md` et `.nojekyll` à la racine du dépôt.
3. Dans GitHub, ouvre **Settings → Pages**.
4. Dans **Build and deployment**, choisis **Deploy from a branch**.
5. Sélectionne la branche `main` et le dossier `/(root)`, puis enregistre.
6. La boutique sera accessible à l'adresse indiquée par GitHub, généralement `https://TON-COMPTE.github.io/amerey-shop/`.

## Mettre le catalogue à jour

1. Ouvre `admin.html` depuis GitHub Pages ou sur ton ordinateur.
2. Renseigne ton propriétaire GitHub, le nom du dépôt, la branche `main` et le chemin `index.html`.
3. Crée un token GitHub **fine-grained**, limité à ce dépôt, avec seulement **Contents: Read and write**.
4. Colle le token dans le gestionnaire, charge le catalogue, fais tes modifications puis publie.

Le token n'est pas enregistré par le gestionnaire. Ne le partage jamais et ne l'ajoute pas dans le code.
