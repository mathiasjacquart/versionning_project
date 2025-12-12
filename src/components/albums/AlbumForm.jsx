// src/components/albums/AlbumForm.jsx
import { useState, useEffect } from "react";

const AlbumForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Le titre est obligatoire !");
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="album-form" onSubmit={handleSubmit}>
      <h3 className="album-form__title">
        {initialData.id ? "Modifier l'album" : "Créer un nouvel album"}
      </h3>
      <div className="album-form__field">
        <label htmlFor="album-title">Titre :</label>
        <input
          id="album-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre de l'album"
          required
        />
      </div>
      <div className="album-form__field">
        <label htmlFor="album-description">Description :</label>
        <textarea
          id="album-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ajoutez une description (optionnel)"
        />
      </div>
      <div className="album-form__actions">
        <button type="submit" className="album-form__submit-btn">
          {initialData.id ? "Modifier" : "Créer"}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="album-form__cancel-btn"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default AlbumForm;
