# PRD — Manga News

## Vision
Un forum communautaire où les fans de manga notent et commentent les chapitres, chapitre par chapitre.

---

## Stack
- **MongoDB** — base de données
- **Express** — API REST
- **React** — frontend
- **Node.js** — serveur
- **Déployé sur Azure + MongoDB Atlas**

---

## Modèles de données

### User
| Champ | Type |
|-------|------|
| username | String |
| email | String |
| password | String (hashé) |
| createdAt | Date |

### Manga
| Champ | Type |
|-------|------|
| title | String |
| description | String |
| coverImage | String (URL) |
| createdAt | Date |

### Chapter
| Champ | Type |
|-------|------|
| mangaId | ObjectId (ref Manga) |
| number | Number |
| title | String |

### Rating
| Champ | Type |
|-------|------|
| userId | ObjectId (ref User) |
| chapterId | ObjectId (ref Chapter) |
| score | Number (1-5) |
| comment | String |
| createdAt | Date |

---

## Fonctionnalités

### Auth
- [ ] Inscription (username, email, password)
- [ ] Connexion / Déconnexion
- [ ] JWT pour protéger les routes

### Mangas
- [ ] Lister tous les mangas
- [ ] Voir la page d'un manga (infos + liste des chapitres)
- [ ] Ajouter un manga (admin)

### Chapitres
- [ ] Lister les chapitres d'un manga
- [ ] Voir la page d'un chapitre (note moyenne + commentaires)
- [ ] Ajouter un chapitre (admin)

### Notations
- [ ] Noter un chapitre (1-5 étoiles)
- [ ] Laisser un commentaire sur un chapitre
- [ ] Modifier / supprimer sa note
- [ ] Voir la note moyenne d'un chapitre

### Blog Actu

**Vue utilisateur connecté**
- [x] Lister les articles sur la page d'accueil
- [x] Lire un article (page détail)
- [x] Écrire un article (titre, contenu, cover, tags)
- [x] Supprimer son propre article

**Vue admin (auteur de l'article)**
- [x] Modifier un article
- [x] Supprimer n'importe quel article

**Vue visiteur**
- [x] Lister et lire les articles

---

## Pages React

| Page | Route |
|------|-------|
| Accueil (blog actu) | `/` |
| Détail article | `/articles/:id` |
| Liste des mangas | `/mangas` |
| Page manga | `/mangas/:id` |
| Page chapitre | `/mangas/:mangaId/chapters/:chapterId` |
| Connexion | `/login` |
| Inscription | `/register` |

---

## Modèle Article

| Champ | Type |
|-------|------|
| title | String |
| content | String |
| coverImage | String (URL) |
| tags | [String] |
| author | ObjectId (ref User) |
| createdAt | Date |

---

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/mangas` | Lister les mangas |
| POST | `/api/mangas` | Ajouter un manga |
| GET | `/api/mangas/:id` | Détail d'un manga |
| GET | `/api/mangas/:id/chapters` | Chapitres d'un manga |
| POST | `/api/mangas/:id/chapters` | Ajouter un chapitre |
| GET | `/api/chapters/:id/ratings` | Notes d'un chapitre |
| POST | `/api/chapters/:id/ratings` | Noter un chapitre |
| PUT | `/api/ratings/:id` | Modifier une note |
| DELETE | `/api/ratings/:id` | Supprimer une note |
| GET | `/api/articles` | Lister les articles |
| POST | `/api/articles` | Créer un article |
| GET | `/api/articles/:id` | Détail d'un article |
| PUT | `/api/articles/:id` | Modifier un article |
| DELETE | `/api/articles/:id` | Supprimer un article |

---

## Ordre de développement

### Phase 1 — Backend
- [x] Init projet Node/Express
- [x] Connexion MongoDB Atlas
- [x] Modèles Mongoose (User, Manga, Chapter, Rating, Article)
- [x] Routes Auth (register, login, JWT)
- [x] Routes Mangas (CRUD)
- [x] Routes Chapitres (CRUD)
- [x] Routes Notations (CRUD)
- [x] Routes Articles (CRUD)

### Phase 2 — Frontend
- [x] Init projet React
- [x] Context Auth (login/logout)
- [x] Page Accueil (blog actu)
- [x] Page détail article
- [x] Page liste des mangas
- [x] Page détail manga
- [x] Page chapitre + système de notation
- [x] Pages Login / Register

### Phase 3 — Déploiement
- [x] Build React pour production
- [x] Servir le build depuis Express
- [x] Variables d'environnement (.env)
- [ ] Déploiement Azure Web App
- [ ] Tests de l'app en ligne
