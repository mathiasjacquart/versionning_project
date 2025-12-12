// src/components/albums/AlbumList.jsx
import { useEffect, useState } from "react";
import { getAlbumsByUser, createAlbum, updateAlbum, deleteAlbum } from "../../firebase";
import AlbumItem from "./AlbumItem";
import AlbumForm from "./AlbumForm";
import { auth } from "../../firebase";
import "./Album.css";


const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const uid = auth.currentUser?.uid;

  const fetchAlbums = async () => {
    if (!uid) return;
    const userAlbums = await getAlbumsByUser(uid);
    setAlbums(userAlbums);
  };

  useEffect(() => {
    fetchAlbums();
  }, [uid]);

  const handleCreate = async (data) => {
    await createAlbum({ ...data, ownerId: uid });
    setShowForm(false);
    fetchAlbums();
  };

  const handleUpdate = async (data) => {
    await updateAlbum(editingAlbum.id, data);
    setEditingAlbum(null);
    setShowForm(false);
    fetchAlbums();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet album ?")) {
      await deleteAlbum(id);
      fetchAlbums();
    }
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Mes albums</h2>
      {!showForm && <button onClick={() => setShowForm(true)}>Créer un album</button>}
      {showForm && (
        <AlbumForm
          onSubmit={editingAlbum ? handleUpdate : handleCreate}
          initialData={editingAlbum || {}}
          onCancel={() => { setEditingAlbum(null); setShowForm(false); }}
        />
      )}
      <div>
        {albums.map((album) => (
          <AlbumItem
            key={album.id}
            album={album}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
