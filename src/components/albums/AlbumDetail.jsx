// src/components/albums/AlbumDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlbumsByUser } from "../../firebase";
import PhotoList from "../photos/PhotoList";
import AlbumShare from "./AlbumShare";

const AlbumDetail = ({ uid }) => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);

  const fetchAlbum = async () => {
    const albums = await getAlbumsByUser(uid);
    const current = albums.find((a) => a.id === albumId);
    setAlbum(current);
  };

  useEffect(() => {
    if (uid) fetchAlbum();
  }, [albumId, uid]);

  if (!album) {
    return (
      <div className="album-detail-container">
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#64748b',
          fontSize: '1.1rem'
        }}>
          Chargement de l'album...
        </div>
      </div>
    );
  }

  return (
    <div className="album-detail-container">
      <div className="album-detail-header">
        <h2>{album.title}</h2>
        {album.description && <p>{album.description}</p>}
        <Link to="/albums" className="album-detail-back-link">
          ← Retour aux albums
        </Link>
      </div>
      <AlbumShare album={album} />
      <PhotoList albumId={album.id} />
    </div>
  );
};

export default AlbumDetail;
