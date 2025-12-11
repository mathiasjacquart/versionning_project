import { useState } from "react";
import { signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./LogoutButton.css";

function LogoutButton({ user }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Mettre à jour le statut hors ligne dans Firestore avant déconnexion
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            isOnline: false,
            lastLogoutAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      await signOut(auth);
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="logout-button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Se déconnecter"
    >
      <span className="logout-button__text">
        {loading ? "Déconnexion..." : "Se déconnecter"}
      </span>
    </button>
  );
}

export default LogoutButton;

