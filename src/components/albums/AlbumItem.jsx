import { Link } from "react-router-dom";

const AlbumItem = ({ album, onEdit, onDelete }) => {
  return (
    <div className="album-item">
      <h3>{album.title}</h3>
      <p>{album.description}</p>
      <button onClick={() => onEdit(album)}>Modifier</button>
      <button onClick={() => onDelete(album.id)}>Supprimer</button>
      <Link to={`/albums/${album.id}`} style={{ marginLeft: "10px" }}>
        Voir
      </Link>
    </div>
  );
};

export default AlbumItem;