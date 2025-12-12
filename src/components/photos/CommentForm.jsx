import { useState } from "react";

const CommentForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form__field">
        <textarea
          className="comment-form__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez un commentaire..."
          rows="3"
          required
        />
      </div>
      <div className="comment-form__actions">
        <button type="submit" className="comment-form__submit-btn">
          Publier
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="comment-form__cancel-btn"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;

