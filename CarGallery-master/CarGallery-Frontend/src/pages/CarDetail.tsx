import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '../services/carService';
import { fileUploadService } from '../services/fileUploadService';
import { Car } from '../types';
import { useAuthStore } from '../store/authStore';
import './CarDetail.css';

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCar = async () => {
    try {
      setLoading(true);
      if (!id) {
        setError('Invalid car ID');
        setLoading(false);
        return;
      }
      const data = await carService.getById(Number(id));
      setCar(data);
      setError(null);
    } catch (error: any) {
      console.error('Error loading car:', error);
      setError(error.response?.data?.message || 'An error occurred while loading car details.');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    alert('Redirecting to contact form...');
    // Here you can redirect to contact page or open a modal
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !car) return;

    setUploading(true);
    try {
      const fileArray = Array.from(files);
      const uploadedUrls = await fileUploadService.uploadMultipleImages(fileArray);
      
      // Merge with existing images
      const newImageUrls = [...(car.imageUrls || []), ...uploadedUrls];
      
      // Save to backend with userId for gallery isolation
      await carService.updateImages(car.id, newImageUrls, user?.id);
      
      alert('Photos uploaded successfully!');
      loadCar();
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading photos: ' + (error as any).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!car || !confirm('Are you sure you want to delete this photo?')) return;

    try {
      await fileUploadService.deleteImage(imageUrl);
      
      const newImageUrls = (car.imageUrls || []).filter(url => url !== imageUrl);
      
      // Save to backend with userId for gallery isolation
      await carService.updateImages(car.id, newImageUrls, user?.id);
      
      // Adjust selected index
      if (selectedImageIndex >= newImageUrls.length && newImageUrls.length > 0) {
        setSelectedImageIndex(newImageUrls.length - 1);
      } else if (newImageUrls.length === 0) {
        setSelectedImageIndex(0);
      }
      
      alert('Photo deleted!');
      loadCar();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo');
    }
  };

  const currentImages = car?.imageUrls && car.imageUrls.length > 0 ? car.imageUrls : (car?.imageUrl ? [car.imageUrl] : []);

  if (loading) {
    return (
      <div className="car-detail-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="car-detail-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Car not found'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="car-detail-page">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back
        </button>
        {user?.role === 'super-admin' || user?.role === 'gallery-admin' && (
          <button onClick={() => navigate(`/admin/cars`)} className="admin-button">
            Admin Edit
          </button>
        )}
      </div>

      <div className="car-detail-container">
        <div className="car-detail-image">
          {currentImages.length > 0 ? (
            <>
              <img
                src={currentImages[selectedImageIndex].startsWith('http') 
                  ? currentImages[selectedImageIndex] 
                  : `http://localhost:5000${currentImages[selectedImageIndex]}`}
                alt={`${car.brandName} ${car.model}`}
              />
              
              {/* Navigation Buttons - Always visible for testing */}
              <button 
                className="image-nav prev" 
                onClick={() => setSelectedImageIndex((prev) => 
                  prev === 0 ? currentImages.length - 1 : prev - 1
                )}
                style={{ display: 'flex' }}
              >
                ‹
              </button>
              <button 
                className="image-nav next" 
                onClick={() => setSelectedImageIndex((prev) => 
                  prev === currentImages.length - 1 ? 0 : prev + 1
                )}
                style={{ display: 'flex' }}
              >
                ›
              </button>
              
              {/* Indicators */}
              {currentImages.length > 1 && (
                <div className="image-indicators">
                  {currentImages.map((_, index) => (
                    <span
                      key={index}
                      className={`indicator ${index === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="car-placeholder-large">
              <span className="car-icon">CAR</span>
            </div>
          )}
          {car.stock <= 0 && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
          
          {user?.role === 'super-admin' || user?.role === 'gallery-admin' && (
            <div className="admin-image-controls">
              <label className="upload-button">
                + Add Photo
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              {currentImages.length > 0 && (
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteImage(currentImages[selectedImageIndex])}
                >
                  Delete This Photo
                </button>
              )}
            </div>
          )}
        </div>

        <div className="car-detail-info">
          <div className="car-header">
            {car.galleryName && (
              <div className="detail-gallery-badge">
                {car.galleryLogoUrl ? (
                  <img 
                    src={car.galleryLogoUrl.startsWith('http') ? car.galleryLogoUrl : `http://localhost:5000${car.galleryLogoUrl}`}
                    alt={car.galleryName}
                    className="detail-gallery-logo"
                  />
                ) : (
                  <span className="detail-gallery-icon">🏢</span>
                )}
                <span className="detail-gallery-name">{car.galleryName}</span>
              </div>
            )}
            <h1 className="car-title">
              <span className="brand">{car.brandName}</span>
              <span className="model">{car.model}</span>
            </h1>
            <div className="year-badge">{car.year}</div>
          </div>

          <div className="price-section">
            <span className="price-label">Price</span>
            <span className="price-value">{car.price.toLocaleString('en-US')} ₺</span>
          </div>

          <div className="stock-section">
            <span className="stock-icon">{car.stock > 0 ? '✓' : '✗'}</span>
            <span className="stock-text">
              {car.stock > 0 ? `${car.stock} unit${car.stock > 1 ? 's' : ''} in stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-content">
                <span className="info-label">Brand</span>
                <span className="info-value">{car.brandName}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-content">
                <span className="info-label">Model</span>
                <span className="info-value">{car.model}</span>
              </div>
            </div>

            {car.color && (
              <div className="info-item">
                <div className="info-content">
                  <span className="info-label">Color</span>
                  <span className="info-value">{car.color}</span>
                </div>
              </div>
            )}

            {user?.role === 'super-admin' || user?.role === 'gallery-admin' && (
              <>
                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">Model Year</span>
                    <span className="info-value">{car.year}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">Car ID</span>
                    <span className="info-value">#{car.id}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <span className="info-label">Stock Quantity</span>
                    <span className="info-value">{car.stock}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="action-buttons">
            <button 
              className="contact-button"
              onClick={handleContact}
              disabled={car.stock <= 0}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
