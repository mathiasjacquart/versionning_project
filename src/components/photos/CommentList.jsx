import { useEffect, useState } from "react";
import { getCommentsByPhoto, deleteComment, addComment } from "../../firebase";
import { auth } from "../../firebase";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ albumId, photoId, album }) => {
  const [comments, setComments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;

  // Vérifier si l'utilisateur peut commenter (propriétaire ou partagé)
  const canComment =
    currentUser &&
    (album?.ownerId === currentUser.uid ||
      (album?.sharedWith && album.sharedWith.includes(currentUser.uid)));

  const fetchComments = async () => {
    if (!albumId || !photoId) return;
    setLoading(true);
    try {
      const commentsData = await getCommentsByPhoto(albumId, photoId);
      setComments(commentsData);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId, photoId]);

  const handleAddComment = async (text) => {
    if (!currentUser || !canComment) return;
    try {
      await addComment(albumId, photoId, text, currentUser.uid, currentUser.email);
      setShowForm(false);
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      alert("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      return;
    }
    try {
      await deleteComment(albumId, photoId, commentId);
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      alert("Erreur lors de la suppression du commentaire");
    }
  };

  if (!canComment) {
    return null;
  }

  return (
    <div className="comment-list">
      <div className="comment-list__header">
        <h4 className="comment-list__title">
          Commentaires ({comments.length})
        </h4>
        {!showForm && (
          <button
            className="comment-list__add-btn"
            onClick={() => setShowForm(true)}
          >
            Ajouter un commentaire
          </button>
        )}
      </div>

      {showForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="comment-list__loading">Chargement...</div>
      ) : comments.length > 0 ? (
        <div className="comment-list__items">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
              currentUserId={currentUser?.uid}
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="comment-list__empty">
            Aucun commentaire pour le moment.
          </div>
        )
      )}
    </div>
  );
};

export default CommentList;

