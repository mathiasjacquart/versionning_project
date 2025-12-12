// src/components/photos/PhotoForm.jsx
import { useState, useEffect } from "react";

const PhotoForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Le titre est obligatoire !");
    onSubmit({ title, description, file });
    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="photo-form">
      <div>
        <label>Titre :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {!initialData.id && (
        <div>
          <label>Photo :</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
      )}

      <button type="submit">{initialData.id ? "Modifier" : "Ajouter"}</button>
      {onCancel && <button type="button" onClick={onCancel}>Annuler</button>}
    </form>
  );
};

export default PhotoForm;
