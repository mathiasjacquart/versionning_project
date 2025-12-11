import "./ErrorMessage.css";

function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <span className="error-message__text">{message}</span>
      {onDismiss && (
        <button
          className="error-message__close"
          onClick={onDismiss}
          aria-label="Fermer"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

