// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2lqV7aHskJ2LQqG5k-l3l9LrVQPE4f9I",
  authDomain: "versionning-project.firebaseapp.com",
  projectId: "versionning-project",
  storageBucket: "versionning-project.firebasestorage.app",
  messagingSenderId: "587581056108",
  appId: "1:587581056108:web:c6ebb27122d3d634956449",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const storage = getStorage(app);
