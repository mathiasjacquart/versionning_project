import { auth } from "../../firebase";

const CommentItem = ({ comment, onDelete, currentUserId }) => {
  const canDelete = comment.userId === currentUserId;
  const createdAt = comment.createdAt?.toDate?.() || new Date(comment.createdAt);
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt);

  return (
    <div className="comment-item">
      <div className="comment-item__header">
        <div className="comment-item__author">
          <span className="comment-item__author-name">
            {comment.userEmail || "Utilisateur"}
          </span>
          <span className="comment-item__date">{formattedDate}</span>
        </div>
        {canDelete && (
          <button
            className="comment-item__delete-btn"
            onClick={() => onDelete(comment.id)}
            title="Supprimer le commentaire"
          >
            ×
          </button>
        )}
      </div>
      <div className="comment-item__text">{comment.text}</div>
    </div>
  );
};

export default CommentItem;

