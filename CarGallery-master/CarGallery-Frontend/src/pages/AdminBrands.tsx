import React, { useState, useEffect } from 'react';
import { brandService } from '../services/brandService';
import { galleryService } from '../services/galleryService';
import { Brand, AddBrandDto, UpdateBrandDto, Gallery } from '../types';
import { useAuthStore } from '../store/authStore';
import './Admin.css';

const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ 
    brandName: '',
    galleryId: undefined as number | undefined
  });
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === 'super-admin';
  const isGalleryAdmin = user?.role === 'gallery-admin';

  useEffect(() => {
    // Gallery-admin için galeri ataması kontrolü
    if (isGalleryAdmin && !user?.galleryId) {
      alert('You are not assigned to any gallery. Please contact a super-admin.');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Gallery-admin için userId gönder
      const brandsData = await brandService.getAll(user?.id);
      setBrands(brandsData);
      
      if (isSuperAdmin) {
        const galleriesData = await galleryService.getAll();
        setGalleries(galleriesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gallery-admin için galleryId otomatik olarak kullanıcının galleryId'si olmalı
      const galleryId = isGalleryAdmin ? user?.galleryId : formData.galleryId;
      
      const newBrand: AddBrandDto = { 
        brandName: formData.brandName,
        galleryId: galleryId,
        userId: user?.id
      };
      await brandService.create(newBrand);
      setShowAddForm(false);
      setFormData({ brandName: '', galleryId: undefined });
      loadData();
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Error adding brand');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    try {
      const updateData: UpdateBrandDto = {
        id: editingBrand.id,
        brandName: formData.brandName,
        userId: user?.id
      };
      await brandService.update(updateData);
      setEditingBrand(null);
      setFormData({ brandName: '', galleryId: undefined });
      loadData();
    } catch (error) {
      console.error('Error updating brand:', error);
      alert('Error updating brand');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      await brandService.delete(id, user?.id);
      loadData();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Error deleting brand');
    }
  };

  const startEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ brandName: brand.brandName, galleryId: brand.galleryId });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingBrand(null);
    setShowAddForm(false);
    setFormData({ brandName: '', galleryId: undefined });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Brand Management</h2>
        <button
          className="primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingBrand(null);
            setFormData({ brandName: '', galleryId: undefined });
          }}
        >
          + Add New Brand
        </button>
      </div>

      {(showAddForm || editingBrand) && (
        <div className="card form-card">
          <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
          <form onSubmit={editingBrand ? handleUpdate : handleAdd}>
            {isSuperAdmin && !editingBrand && (
              <div className="form-group">
                <label>Gallery (Super-Admin Only)</label>
                <select
                  value={formData.galleryId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, galleryId: e.target.value ? Number(e.target.value) : undefined })
                  }
                >
                  <option value="">No Gallery (Global Brand)</option>
                  {galleries.map((gallery) => (
                    <option key={gallery.id} value={gallery.id}>
                      {gallery.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="success">
                {editingBrand ? 'Update' : 'Add'}
              </button>
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand Name</th>
              {isSuperAdmin && <th>Gallery</th>}
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td>{brand.brandName}</td>
                {isSuperAdmin && <td>{brand.galleryName || 'Global'}</td>}
                <td>{new Date(brand.createdDate).toLocaleDateString('en-US')}</td>
                <td>
                  {brand.updateDate
                    ? new Date(brand.updateDate).toLocaleDateString('en-US')
                    : '-'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="secondary"
                      onClick={() => startEdit(brand)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(brand.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBrands;
