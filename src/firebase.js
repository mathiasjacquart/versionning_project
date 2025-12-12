import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { arrayUnion, arrayRemove } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);



// Ajouter un album
export const createAlbum = async (album) => {
  const docRef = await addDoc(collection(db, 'albums'), {
    ...album,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

// Modifier un album
export const updateAlbum = async (id, album) => {
  const albumRef = doc(db, 'albums', id);
  await updateDoc(albumRef, {
    ...album,
    updatedAt: new Date(),
  });
};

// Supprimer un album
export const deleteAlbum = async (id) => {
  const albumRef = doc(db, 'albums', id);
  await deleteDoc(albumRef);
};

// Récupérer les albums d'un utilisateur
export const getAlbumsByUser = async (uid) => {
  const querySnapshot = await getDocs(collection(db, 'albums'));
  const albums = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.ownerId === uid || (data.sharedWith && data.sharedWith.includes(uid))) {
      albums.push({ id: doc.id, ...data });
    }
  });
  return albums;
};


// Ajouter une photo à un album
export const addPhoto = async (albumId, file, data) => {
  if (!file) throw new Error("Fichier manquant");

  // Générer un nom de fichier unique pour éviter les collisions et problèmes CORS
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;

  const storageRef = ref(storage, `albums/${albumId}/${fileName}`);

  // Upload du fichier
  await uploadBytes(storageRef, file);

  // Récupérer l'URL publique
  const imageUrl = await getDownloadURL(storageRef);

  // Enregistrer dans Firestore
  const docRef = await addDoc(collection(db, "albums", albumId, "photos"), {
    ...data,
    imageUrl,
    fileName, // on stocke le nom du fichier pour suppression future
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
};

// Modifier une photo (titre/description seulement)
export const updatePhoto = async (albumId, photoId, data) => {
  const photoRef = doc(db, 'albums', albumId, 'photos', photoId);
  await updateDoc(photoRef, {
    ...data,
    updatedAt: new Date(),
  });
};

// Supprimer une photo (Firestore + Storage)
export const deletePhoto = async (albumId, photoId, fileName) => {
  const photoRef = doc(db, 'albums', albumId, 'photos', photoId);
  await deleteDoc(photoRef);

  const storageRef = ref(storage, `albums/${albumId}/${fileName}`);
  await deleteObject(storageRef);
};

// Récupérer toutes les photos d’un album
export const getPhotosByAlbum = async (albumId) => {
  const querySnapshot = await getDocs(collection(db, 'albums', albumId, 'photos'));
  const photos = [];
  querySnapshot.forEach((doc) => {
    photos.push({ id: doc.id, ...doc.data() });
  });
  return photos;
};


// Partager un album avec un utilisateur (UID)
export const shareAlbum = async (albumId, uid) => {
  const albumRef = doc(db, "albums", albumId);

  await updateDoc(albumRef, {
    sharedWith: arrayUnion(uid),
    updatedAt: new Date(),
  });
};

// Retirer un utilisateur du partage
export const unshareAlbum = async (albumId, uid) => {
  const albumRef = doc(db, "albums", albumId);

  await updateDoc(albumRef, {
    sharedWith: arrayRemove(uid),
    updatedAt: new Date(),
  });
};

// Ajouter un commentaire à une photo
export const addComment = async (albumId, photoId, comment, userId, userEmail) => {
  const docRef = await addDoc(collection(db, 'albums', albumId, 'photos', photoId, 'comments'), {
    text: comment,
    userId,
    userEmail,
    createdAt: new Date(),
  });
  return docRef.id;
};

// Récupérer tous les commentaires d'une photo
export const getCommentsByPhoto = async (albumId, photoId) => {
  const querySnapshot = await getDocs(collection(db, 'albums', albumId, 'photos', photoId, 'comments'));
  const comments = [];
  querySnapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });
  // Trier par date de création (plus récent en premier)
  return comments.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB - dateA;
  });
};

// Supprimer un commentaire
export const deleteComment = async (albumId, photoId, commentId) => {
  const commentRef = doc(db, 'albums', albumId, 'photos', photoId, 'comments', commentId);
  await deleteDoc(commentRef);
};