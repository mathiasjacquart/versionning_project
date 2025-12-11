import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuthErrorMessage } from "../utils/authErrors";
import ErrorMessage from "./ErrorMessage";
import "./AuthForm.css";

function LoginForm({ onSuccess, onToggleMode, loading, setLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validation email
    if (!email.trim()) {
      errors.email = "L'email est requis.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "L'adresse email n'est pas valide.";
      isValid = false;
    }

    // Validation mot de passe
    if (!password) {
      errors.password = "Le mot de passe est requis.";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Mise à jour du document utilisateur dans Firestore
      const userRef = doc(db, "users", credential.user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            lastLoginAt: serverTimestamp(),
            isOnline: true,
          },
          { merge: true }
        );
      } else {
        // Si le document n'existe pas (ancien utilisateur), le créer
        await setDoc(userRef, {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName || null,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isOnline: true,
        });
      }

      setEmail("");
      setPassword("");
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);

      // Erreurs spécifiques par champ
      if (err.code === "auth/invalid-email" || err.code === "auth/user-not-found") {
        setFieldErrors({ email: errorMessage });
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setFieldErrors({ password: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__field">
        <label htmlFor="login-email" className="auth-form__label">
          E-mail
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
          }}
          className={`auth-form__input ${fieldErrors.email ? "auth-form__input--error" : ""}`}
          required
          placeholder="vous@example.com"
          disabled={loading}
        />
        {fieldErrors.email && (
          <span className="auth-form__field-error">{fieldErrors.email}</span>
        )}
      </div>

      <div className="auth-form__field">
        <label htmlFor="login-password" className="auth-form__label">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
          }}
          className={`auth-form__input ${fieldErrors.password ? "auth-form__input--error" : ""}`}
          required
          minLength={6}
          placeholder="••••••••"
          disabled={loading}
        />
        {fieldErrors.password && (
          <span className="auth-form__field-error">{fieldErrors.password}</span>
        )}
      </div>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <div className="auth-form__footer">
        <button
          type="button"
          className="auth-form__toggle"
          onClick={onToggleMode}
          disabled={loading}
        >
          Pas de compte ? Inscription
        </button>
      </div>
    </form>
  );
}

export default LoginForm;

