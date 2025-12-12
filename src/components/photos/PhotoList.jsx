// src/components/photos/PhotoList.jsx
import { useEffect, useState } from "react";
import { getPhotosByAlbum, addPhoto, updatePhoto, deletePhoto } from "../../firebase";
import PhotoItem from "./PhotoItem";
import PhotoForm from "./PhotoForm";

const PhotoList = ({ albumId }) => {
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPhotos = async () => {
    const photosData = await getPhotosByAlbum(albumId);
    setPhotos(photosData);
  };

  useEffect(() => {
    fetchPhotos();
  }, [albumId]);

  const handleAdd = async (data) => {
    if (!data.file) return alert("Une photo est obligatoire !");
    await addPhoto(albumId, data.file, { title: data.title, description: data.description });
    setShowForm(false);
    fetchPhotos();
  };

  const handleUpdate = async (data) => {
    await updatePhoto(albumId, editingPhoto.id, { title: data.title, description: data.description });
    setEditingPhoto(null);
    setShowForm(false);
    fetchPhotos();
  };

  const handleDelete = async (photo) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette photo ?")) {
      await deletePhoto(albumId, photo.id, photo.imageUrl.split("/").pop());
      fetchPhotos();
    }
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setShowForm(true);
  };

  return (
    <div className="photo-list">
      {!showForm && <button onClick={() => setShowForm(true)}>Ajouter une photo</button>}
      {showForm && (
        <PhotoForm
          onSubmit={editingPhoto ? handleUpdate : handleAdd}
          initialData={editingPhoto || {}}
          onCancel={() => { setEditingPhoto(null); setShowForm(false); }}
        />
      )}

      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoList;
