import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const resetErrors = () => setError("");

  const handleAuth = async (event) => {
    event.preventDefault();
    resetErrors();
    setLoading(true);
    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        if (displayName.trim()) {
          await updateProfile(credential.user, {
            displayName: displayName.trim(),
          });
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message || "Impossible de se déconnecter.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError("");
  };

  return (
    <main className="app">
      <section className="card">
        <header className="card__header">
          <h1>{mode === "login" ? "Connexion" : "Inscription"}</h1>
          <p>
            {mode === "login"
              ? "Accédez à votre compte."
              : "Créez un compte avec e-mail et mot de passe."}
          </p>
        </header>

        {!user ? (
          <form className="form" onSubmit={handleAuth}>
            {mode === "register" && (
              <label className="form__field">
                <span>Nom affiché (optionnel)</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </label>
            )}

            <label className="form__field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@example.com"
              />
            </label>

            <label className="form__field">
              <span>Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </label>

            {error && <div className="alert alert--error">{error}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading
                ? "Veuillez patienter..."
                : mode === "login"
                ? "Se connecter"
                : "S'inscrire"}
            </button>
          </form>
        ) : (
          <div className="profile">
            <p className="profile__welcome">
              Bonjour {user.displayName || user.email} !
            </p>
            <p className="profile__email">{user.email}</p>
            <button
              className="btn btn--secondary"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </div>
        )}

        <footer className="card__footer">
          <button
            className="link-btn"
            type="button"
            onClick={toggleMode}
            disabled={loading}
          >
            {mode === "login"
              ? "Pas de compte ? Inscription"
              : "Déjà inscrit ? Connexion"}
          </button>
        </footer>
      </section>
    </main>
  );
}

export default App;
