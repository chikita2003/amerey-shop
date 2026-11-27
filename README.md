# AMEREY SHOP

Boutique en ligne de prêt-à-porter homme & femme et de tenues sur-mesure (Cotonou).
Site statique hébergé gratuitement sur **GitHub Pages** : aucun serveur, aucune base de données, aucune installation.

- Les clients parcourent le catalogue et commandent via **WhatsApp**.
- Le formulaire **sur-mesure** génère un PDF récapitulatif des mesures.
- Le catalogue se gère depuis la page **`admin.html`**, sans toucher au code.

## Contenu du dépôt

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | La boutique publique |
| `admin.html` | Le gestionnaire de catalogue |
| `data/catalogue.json` | La liste des articles (modifiée par l'admin) |
| `assets/images/products/` | Les photos des articles |
| `assets/images/site/` | Les images de la page (accueil, vignettes, fond sur-mesure) |
| `assets/css/`, `assets/js/` | Styles et scripts de la boutique |
| `favicon.svg`, `favicon.ico`, `assets/images/icons/` | Icône du site (onglet, écran d'accueil mobile) |
| `.nojekyll` | Indispensable pour GitHub Pages, ne pas supprimer |

## Gérer le catalogue

### Première fois : créer un token GitHub

Le gestionnaire publie directement sur GitHub. Il a besoin d'une clé d'accès (« token ») :

1. Sur GitHub : **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token** (lien direct : <https://github.com/settings/personal-access-tokens>).
2. **Token name** : `admin amerey-shop`.
3. **Expiration** : 90 jours par exemple (évite « No expiration »).
4. **Repository access** : *Only select repositories* → `amerey-shop`.
5. **Permissions → Repository permissions → Contents** : *Read and write*. Rien d'autre.
6. Génère le token, copie-le avec l'icône 📋 (pas en sélectionnant le texte) et enregistre-le **tout de suite** dans ton gestionnaire de mots de passe : GitHub ne l'affiche qu'une seule fois.

> Le gestionnaire n'enregistre jamais le token. Ne le partage avec personne et ne le colle jamais dans le code, un message ou un site : GitHub révoque automatiquement un token rendu public.

### ⏰ Rappel : le token expire

Le token cesse de fonctionner à la date d'expiration choisie à sa création. Ce jour-là, le gestionnaire affiche « **GitHub refuse ce token : il est probablement expiré** ».

- **Dès la création d'un token**, mets un rappel dans ton agenda ou ton téléphone **une semaine avant** sa date d'expiration (la date est visible dans la liste de tes tokens sur GitHub).
- **À l'échéance** (ou si le message ci-dessus apparaît) : crée un nouveau token en refaisant les étapes ci-dessus, remplace l'ancien dans ton gestionnaire de mots de passe, puis supprime l'ancien token sur GitHub.
- Utilise le **même token** sur le PC et le téléphone : en créer ou en régénérer un autre rend l'ancien inutilisable partout.

| Token actuel créé le | Expire le | Rappel prévu le |
|---|---|---|
| … | … | … |

*(Remplis ce tableau à chaque nouveau token, sans jamais y écrire le token lui-même.)*

### Ajouter, modifier ou supprimer un article

1. Ouvre le gestionnaire : <https://amerey.shop/admin.html>.
2. Renseigne le propriétaire GitHub, le dépôt `amerey-shop`, la branche `main`, le chemin `data/catalogue.json` et colle le token.
3. Clique sur **Tester la connexion**, puis **Ouvrir le catalogue**.
4. Fais tes modifications :
   - **Ajouter** : choisis une photo (elle est automatiquement redimensionnée et compressée), remplis le nom, le prix, la collection, le type, et éventuellement un badge, une description et les autres coloris.
   - **Modifier** / **Supprimer** : boutons à droite de chaque article.
5. Clique sur **Publier sur GitHub Pages**. Toutes les modifications partent en une seule fois.

Le site est mis à jour **1 à 2 minutes** après la publication. Si l'ancienne version s'affiche encore, recharge la page (Ctrl+Shift+R ou Cmd+Shift+R).

Les photos des articles supprimés ou remplacées sont retirées du dépôt automatiquement.

### Sans connexion GitHub (secours)

Dans l'admin, **Charger un fichier manuellement** permet d'ouvrir un `catalogue.json`. Le bouton **Télécharger le fichier mis à jour** fournit alors le nouveau `catalogue.json` et les nouvelles photos : dépose-les respectivement dans `data/` et `assets/images/products/` sur GitHub.

## Nom de domaine personnalisé

1. Crée à la racine du dépôt un fichier `CNAME` contenant uniquement le domaine, par ex. `www.ton-domaine.com`.
2. Chez le fournisseur du domaine (registraire), ajoute ces enregistrements DNS :

   | Type | Nom | Valeur |
   |---|---|---|
   | `CNAME` | `www` | `TON-COMPTE.github.io` |
   | `A` | `@` | `185.199.108.153` |
   | `A` | `@` | `185.199.109.153` |
   | `A` | `@` | `185.199.110.153` |
   | `A` | `@` | `185.199.111.153` |

3. Sur GitHub : **Settings → Pages → Custom domain**, saisis le domaine puis coche **Enforce HTTPS** (disponible quelques minutes à quelques heures après la propagation DNS).
4. Recommandé : vérifie le domaine dans les réglages du compte GitHub (**Settings → Pages → Add a domain**) pour empêcher quiconque de l'utiliser.

Tous les chemins du site sont relatifs : rien d'autre n'est à modifier. L'ancienne adresse `github.io` redirigera automatiquement vers le nouveau domaine.

## Tester en local

Le catalogue est chargé dynamiquement, donc ouvrir `index.html` par double-clic **ne fonctionne pas**. Lance un petit serveur depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

puis ouvre <http://localhost:8000>.

## Mise en ligne initiale (pour mémoire)

Dans GitHub : **Settings → Pages → Build and deployment** → *Deploy from a branch* → branche `main`, dossier `/(root)`.
