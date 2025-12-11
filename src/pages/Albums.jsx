// src/pages/Albums.jsx
import { useAuth } from "../auth/AuthContext";

export default function Albums() {
  const { user, logoutUser } = useAuth();

  return (
    <div>
      <h1>Bienvenue {user.user.email}</h1>
      <button onClick={logoutUser}>Déconnexion</button>
    </div>
  );
}
