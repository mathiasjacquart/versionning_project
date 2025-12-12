// src/components/photos/PhotoList.jsx
import { useEffect, useState, useCallback } from "react";
import {
  getPhotosByAlbum,
  addPhoto,
  updatePhoto,
  deletePhoto,
} from "../../firebase";
import PhotoItem from "./PhotoItem";
import PhotoForm from "./PhotoForm";
import "./Photo.css";

const PhotoList = ({ albumId, album }) => {
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (!albumId) return;
    const photosData = await getPhotosByAlbum(albumId);
    setPhotos(photosData);
  }, [albumId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleAdd = async (data) => {
    if (!data.file) return alert("Une photo est obligatoire !");
    await addPhoto(albumId, data.file, {
      title: data.title,
      description: data.description,
    });
    setShowForm(false);
    fetchPhotos();
  };

  const handleUpdate = async (data) => {
    await updatePhoto(albumId, editingPhoto.id, {
      title: data.title,
      description: data.description,
    });
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
      <div className="photo-list-header">
        <h3>Photos</h3>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Ajouter une photo
          </button>
        )}
      </div>
      {showForm && (
        <PhotoForm
          onSubmit={editingPhoto ? handleUpdate : handleAdd}
          initialData={editingPhoto || {}}
          onCancel={() => {
            setEditingPhoto(null);
            setShowForm(false);
          }}
        />
      )}

      {photos.length > 0 ? (
        <div className="photo-grid">
          {photos.map((photo) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              albumId={albumId}
              album={album}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Aucune photo pour le moment. Ajoutez votre première photo !
          </div>
        )
      )}
    </div>
  );
};

export default PhotoList;
