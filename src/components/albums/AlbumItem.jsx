import { Link } from "react-router-dom";

const AlbumItem = ({ album, onEdit, onDelete }) => {
  return (
    <div className="album-item">
      <div className="album-item__header">
        <h3>{album.title}</h3>
        {album.description && <p>{album.description}</p>}
      </div>
      <div className="album-item__actions">
        <button 
          className="album-item__edit-btn" 
          onClick={() => onEdit(album)}
        >
          Modifier
        </button>
        <button 
          className="album-item__delete-btn" 
          onClick={() => onDelete(album.id)}
        >
          Supprimer
        </button>
        <Link to={`/albums/${album.id}`} className="album-item__link">
          Voir →
        </Link>
      </div>
    </div>
  );
};

export default AlbumItem;