import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserProfile from "./components/UserProfile";
import LogoutButton from "./components/LogoutButton";
import AlbumList from "./components/albums/AlbumList";
import AlbumDetail from "./components/albums/AlbumDetail";

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
    <BrowserRouter>
      {user && (
        <header className="app-header">
          <UserProfile user={user} />
          <LogoutButton user={user} />
          <nav>
            <Link to="/albums">Mes Albums</Link>
          </nav>
        </header>
      )}

      <main className="app-main">
        <Routes>
          {!user ? (
            <>
              <Route
                path="/*"
                element={
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
                }
              />
            </>
          ) : (
            <>
              <Route path="/albums" element={<AlbumList uid={user.uid} />} />
              <Route path="/albums/:albumId" element={<AlbumDetail uid={user.uid} />} />
              <Route path="*" element={<Navigate to="/albums" replace />} />
            </>
          )}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
