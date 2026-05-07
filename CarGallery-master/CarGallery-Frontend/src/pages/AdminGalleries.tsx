import React, { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import { fileUploadService } from '../services/fileUploadService';
import { Gallery, AddGalleryDto, UpdateGalleryDto, User } from '../types';
import axios from 'axios';
import './Admin.css';

const AdminGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAssignAdmin, setShowAssignAdmin] = useState<Gallery | null>(null);
  
  const [formData, setFormData] = useState<AddGalleryDto>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logoUrl: '',
  });

  const [assignData, setAssignData] = useState({
    galleryId: 0,
    userId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [galleriesData, usersData] = await Promise.all([
        galleryService.getAll(),
        axios.get<User[]>('http://localhost:5000/api/Auth/users').then(res => res.data),
      ]);
      setGalleries(galleriesData);
      setUsers(usersData);
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
      await galleryService.create(formData);
      setShowAddForm(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error adding gallery:', error);
      alert('Error adding gallery');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    try {
      const updateData: UpdateGalleryDto = {
        id: editingGallery.id,
        ...formData,
      };
      await galleryService.update(updateData);
      setEditingGallery(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error updating gallery:', error);
      alert('Error updating gallery');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      await galleryService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Error deleting gallery');
    }
  };

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await galleryService.assignAdmin(assignData);
      setShowAssignAdmin(null);
      setAssignData({ galleryId: 0, userId: 0 });
      loadData();
      alert('Gallery admin assigned successfully');
    } catch (error: any) {
      console.error('Error assigning admin:', error);
      alert(error.response?.data?.message || 'Error assigning admin');
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    if (!confirm('Remove gallery admin role from this user?')) return;

    try {
      await galleryService.removeAdmin(userId);
      loadData();
      alert('Gallery admin role removed successfully');
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Error removing admin');
    }
  };

  const startEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      name: gallery.name,
      description: gallery.description || '',
      address: gallery.address || '',
      phone: gallery.phone || '',
      email: gallery.email || '',
      logoUrl: gallery.logoUrl || '',
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      logoUrl: '',
    });
  };

  const cancelEdit = () => {
    setEditingGallery(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Only image files can be uploaded');
      return;
    }

    try {
      setUploading(true);
      const logoUrl = await fileUploadService.uploadImage(file);
      setFormData({ ...formData, logoUrl });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert(error.response?.data?.message || 'Error uploading logo');
    } finally {
      setUploading(false);
    }
  };

  const openAssignAdmin = (gallery: Gallery) => {
    setShowAssignAdmin(gallery);
    setAssignData({ galleryId: gallery.id, userId: 0 });
  };

  const getGalleryAdmins = (galleryId: number) => {
    return users.filter(u => u.role === 'gallery-admin' && u.galleryId === galleryId);
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
        <h2>Gallery Management</h2>
        <button
          className="primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingGallery(null);
            resetForm();
          }}
        >
          + Add New Gallery
        </button>
      </div>

      {(showAddForm || editingGallery) && (
        <div className="card form-card">
          <h3>{editingGallery ? 'Edit Gallery' : 'Add New Gallery'}</h3>
          <form onSubmit={editingGallery ? handleUpdate : handleAdd}>
            <div className="form-group">
              <label>Gallery Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter gallery name (e.g., Otobin)"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Gallery description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Gallery address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+90 555 555 5555"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@gallery.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
              {uploading && <span style={{ color: '#667eea', marginLeft: '10px' }}>Uploading...</span>}
              {formData.logoUrl && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={formData.logoUrl.startsWith('http') ? formData.logoUrl : `http://localhost:5000${formData.logoUrl}`}
                    alt="Logo Preview"
                    style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="success">
                {editingGallery ? 'Update' : 'Add'}
              </button>
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showAssignAdmin && (
        <div className="card form-card">
          <h3>Assign Gallery Admin - {showAssignAdmin.name}</h3>
          <form onSubmit={handleAssignAdmin}>
            <div className="form-group">
              <label>Select User</label>
              <select
                value={assignData.userId}
                onChange={(e) => setAssignData({ ...assignData, userId: Number(e.target.value) })}
                required
              >
                <option value={0}>Select User</option>
                {users.filter(u => u.role === 'user' || u.role === 'gallery-admin').map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="success">
                Assign Admin
              </button>
              <button type="button" className="secondary" onClick={() => setShowAssignAdmin(null)}>
                Cancel
              </button>
            </div>
          </form>

          {getGalleryAdmins(showAssignAdmin.id).length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4>Current Gallery Admins:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {getGalleryAdmins(showAssignAdmin.id).map((admin) => (
                  <li key={admin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f5f5f5', marginBottom: '5px', borderRadius: '4px' }}>
                    <span>{admin.username}</span>
                    <button
                      className="danger"
                      onClick={() => handleRemoveAdmin(admin.id)}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Brands</th>
              <th>Admins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {galleries.map((gallery) => (
              <tr key={gallery.id}>
                <td>{gallery.id}</td>
                <td>
                  {gallery.logoUrl && (
                    <img
                      src={gallery.logoUrl.startsWith('http') ? gallery.logoUrl : `http://localhost:5000${gallery.logoUrl}`}
                      alt={gallery.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                  )}
                </td>
                <td>
                  <strong>{gallery.name}</strong>
                  {gallery.description && (
                    <div style={{ fontSize: '12px', color: '#666' }}>{gallery.description}</div>
                  )}
                </td>
                <td>
                  {gallery.address && <div>{gallery.address}</div>}
                </td>
                <td>
                  {gallery.phone && <div>📞 {gallery.phone}</div>}
                  {gallery.email && <div>📧 {gallery.email}</div>}
                </td>
                <td>{gallery.brandCount} brand{gallery.brandCount !== 1 ? 's' : ''}</td>
                <td>{gallery.adminCount} admin{gallery.adminCount !== 1 ? 's' : ''}</td>
                <td>
                  <div className="action-buttons">
                    <button className="secondary" onClick={() => startEdit(gallery)}>
                      Edit
                    </button>
                    <button className="primary" onClick={() => openAssignAdmin(gallery)}>
                      Assign Admin
                    </button>
                    <button className="danger" onClick={() => handleDelete(gallery.id)}>
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

export default AdminGalleries;
