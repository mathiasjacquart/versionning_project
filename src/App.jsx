import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserProfile from "./components/UserProfile";
import LogoutButton from "./components/LogoutButton";
import "./App.css";

function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="app-container">
      {user && (
        <header className="app-header">
          <UserProfile user={user} />
          <LogoutButton user={user} />
        </header>
      )}

      <main className="app-main">
        {!user ? (
          <section className="auth-card">
            <header className="auth-card__header">
              <h1>{mode === "login" ? "Connexion" : "Inscription"}</h1>
              <p>
                {mode === "login"
                  ? "Accédez à votre compte."
                  : "Créez un compte avec e-mail et mot de passe."}
              </p>
            </header>

            {mode === "login" ? (
              <LoginForm
                onSuccess={() => {}}
                onToggleMode={toggleMode}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <RegisterForm
                onSuccess={() => {}}
                onToggleMode={toggleMode}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </section>
        ) : (
          <div className="welcome-message">
            <h2>Bienvenue {user.displayName || user.email} !</h2>
            <p>Vous êtes maintenant connecté.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
