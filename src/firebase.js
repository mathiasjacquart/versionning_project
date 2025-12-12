import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

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