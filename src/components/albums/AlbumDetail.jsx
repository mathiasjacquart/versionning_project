// src/components/albums/AlbumDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlbumsByUser } from "../../firebase";
import PhotoList from "../photos/PhotoList";

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

  if (!album) return <p>Chargement de l’album...</p>;

  return (
    <div>
      <h2>{album.title}</h2>
      <p>{album.description}</p>
      <Link to="/albums">← Retour aux albums</Link>

      <h3>Photos</h3>
      <PhotoList albumId={album.id} />
    </div>
  );
};

export default AlbumDetail;
