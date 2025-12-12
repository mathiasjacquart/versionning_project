# Versionning Project

Application web permettant de **gérer, organiser et partager des albums photos**, réalisée dans le cadre du module _Versionnage & Intégration Continue_.

---

## Fonctionnalités

- Authentification (Firebase Auth)
- Création, modification, suppression d’albums
- Ajout et gestion des photos dans un album
- Partage d’albums entre utilisateurs
- Commentaires sur les photos

---

## Technologies

- React
- Firebase (Auth, Firestore, Storage)

---

## 📦 Installation

Cloner le projet :

```bash
git clone https://github.com/<utilisateur>/<repo>.git
cd <repo>

```

Installer les dépendances :

```bash
npm install

```

---

## Configuration (Firebase)

Le projet utilise un fichier `.env` contenant les valeurs Firebase.

➡️ **Le fichier `.env` n’est pas fourni dans le dépôt**

➡️ **L’enseignant recevra le `.env` par mail**

Variables nécessaires :

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

```

---

## Lancer l’application

```bash
npm run dev

```
