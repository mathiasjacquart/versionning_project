/**
 * Convertit les codes d'erreur Firebase en messages utilisateur-friendly
 */
export const getAuthErrorMessage = (error) => {
  const errorMessages = {
    "auth/operation-not-allowed":
      "L'authentification par email/mot de passe n'est pas activée. Veuillez l'activer dans la console Firebase.",
    "auth/email-already-in-use": "Cet email est déjà utilisé.",
    "auth/invalid-email": "L'adresse email n'est pas valide.",
    "auth/weak-password":
      "Le mot de passe est trop faible (minimum 6 caractères).",
    "auth/user-not-found": "Aucun compte trouvé avec cet email.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/invalid-credential": "Email ou mot de passe incorrect.",
    "auth/too-many-requests":
      "Trop de tentatives. Veuillez réessayer plus tard.",
    "auth/network-request-failed":
      "Erreur de connexion. Vérifiez votre connexion internet.",
    "auth/user-disabled": "Ce compte a été désactivé.",
  };

  return (
    errorMessages[error.code] ||
    error.message ||
    "Une erreur est survenue. Veuillez réessayer."
  );
};

