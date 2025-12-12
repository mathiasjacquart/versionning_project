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
    <div className="album-list-container">
      <div className="album-list-header">
        <h2>Mes albums</h2>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Créer un album
          </button>
        )}
      </div>
      {showForm && (
        <AlbumForm
          onSubmit={editingAlbum ? handleUpdate : handleCreate}
          initialData={editingAlbum || {}}
          onCancel={() => { setEditingAlbum(null); setShowForm(false); }}
        />
      )}
      {albums.length > 0 ? (
        <div className="album-list-grid">
          {albums.map((album) => (
            <AlbumItem
              key={album.id}
              album={album}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#64748b',
            fontSize: '1.1rem'
          }}>
            Aucun album pour le moment. Créez votre premier album !
          </div>
        )
      )}
    </div>
  );
};

export default AlbumList;
