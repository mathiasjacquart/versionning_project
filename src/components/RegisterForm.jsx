import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuthErrorMessage } from "../utils/authErrors";
import ErrorMessage from "./ErrorMessage";
import "./AuthForm.css";

function RegisterForm({ onSuccess, onToggleMode, loading, setLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validation nom affiché (optionnel mais si fourni, doit être valide)
    if (displayName.trim() && displayName.trim().length < 2) {
      errors.displayName = "Le nom doit contenir au moins 2 caractères.";
      isValid = false;
    }

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

    // Validation confirmation mot de passe
    if (!confirmPassword) {
      errors.confirmPassword = "Veuillez confirmer votre mot de passe.";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
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
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Mise à jour du profil avec le displayName si fourni
      if (displayName.trim()) {
        await updateProfile(credential.user, {
          displayName: displayName.trim(),
        });
      }

      // Création du document utilisateur dans Firestore
      const userRef = doc(db, "users", credential.user.uid);
      await setDoc(userRef, {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: displayName.trim() || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isOnline: true,
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDisplayName("");
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);

      // Erreurs spécifiques par champ
      if (err.code === "auth/invalid-email" || err.code === "auth/email-already-in-use") {
        setFieldErrors({ email: errorMessage });
      } else if (err.code === "auth/weak-password") {
        setFieldErrors({ password: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__field">
        <label htmlFor="register-displayName" className="auth-form__label">
          Nom affiché <span className="auth-form__optional">(optionnel)</span>
        </label>
        <input
          id="register-displayName"
          type="text"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            if (fieldErrors.displayName) setFieldErrors({ ...fieldErrors, displayName: "" });
          }}
          className={`auth-form__input ${fieldErrors.displayName ? "auth-form__input--error" : ""}`}
          placeholder="Jane Doe"
          disabled={loading}
        />
        {fieldErrors.displayName && (
          <span className="auth-form__field-error">{fieldErrors.displayName}</span>
        )}
      </div>

      <div className="auth-form__field">
        <label htmlFor="register-email" className="auth-form__label">
          E-mail
        </label>
        <input
          id="register-email"
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
        <label htmlFor="register-password" className="auth-form__label">
          Mot de passe
        </label>
        <input
          id="register-password"
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

      <div className="auth-form__field">
        <label htmlFor="register-confirmPassword" className="auth-form__label">
          Confirmer le mot de passe
        </label>
        <input
          id="register-confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: "" });
          }}
          className={`auth-form__input ${fieldErrors.confirmPassword ? "auth-form__input--error" : ""}`}
          required
          minLength={6}
          placeholder="••••••••"
          disabled={loading}
        />
        {fieldErrors.confirmPassword && (
          <span className="auth-form__field-error">{fieldErrors.confirmPassword}</span>
        )}
      </div>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? "Inscription..." : "S'inscrire"}
      </button>

      <div className="auth-form__footer">
        <button
          type="button"
          className="auth-form__toggle"
          onClick={onToggleMode}
          disabled={loading}
        >
          Déjà inscrit ? Connexion
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;

