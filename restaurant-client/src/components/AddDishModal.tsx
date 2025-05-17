import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/AdminModal.css';

interface Props {
  onClose: () => void;
  onAdded?: () => void;
}

const AddDishModal: React.FC<Props> = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    nameEn: '',
    nameRu: '',
    nameAz: '',
    price: '',
    descriptionEn: '',
    descriptionRu: '',
    descriptionAz: '',
    dishCategoryId: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('NameEn', form.nameEn);
      data.append('NameRu', form.nameRu);
      data.append('NameAz', form.nameAz);
      data.append('Price', form.price);
      data.append('DescriptionEn', form.descriptionEn);
      data.append('DescriptionRu', form.descriptionRu);
      data.append('DescriptionAz', form.descriptionAz);
      data.append('DishCategoryId', form.dishCategoryId);
      if (form.image) data.append('Image', form.image);

      await axios.post('/api/dishes', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Dish added successfully!');
      if (onAdded) onAdded();
      onClose();
    } catch {
      toast.error('Failed to add dish.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={handleSubmit}>
        <h2 style={{ color: '#ba420f', marginBottom: 24, textAlign: 'center' }}>Add New Dish</h2>

        <input name="nameEn" placeholder="Name (English)" value={form.nameEn} onChange={handleChange} required className="admin-input" />
        <input name="nameRu" placeholder="Name (Russian)" value={form.nameRu} onChange={handleChange} required className="admin-input" />
        <input name="nameAz" placeholder="Name (Azerbaijani)" value={form.nameAz} onChange={handleChange} required className="admin-input" />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required className="admin-input" />
        <input name="descriptionEn" placeholder="Description (English)" value={form.descriptionEn} onChange={handleChange} required className="admin-input" />
        <input name="descriptionRu" placeholder="Description (Russian)" value={form.descriptionRu} onChange={handleChange} required className="admin-input" />
        <input name="descriptionAz" placeholder="Description (Azerbaijani)" value={form.descriptionAz} onChange={handleChange} required className="admin-input" />
        <input name="dishCategoryId" type="number" placeholder="Dish Category ID" value={form.dishCategoryId} onChange={handleChange} required className="admin-input" />
        <input name="image" type="file" accept="image/*" onChange={handleChange} className="admin-input" style={{ marginBottom: 16 }} />

        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <button type="submit" className="admin-save-btn" disabled={loading}>Save</button>
          <button type="button" className="admin-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddDishModal;