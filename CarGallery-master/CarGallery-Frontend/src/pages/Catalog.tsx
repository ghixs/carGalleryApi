import React, { useState, useEffect } from 'react';
import { carService } from '../services/carService';
import { brandService } from '../services/brandService';
import { Car, Brand } from '../types';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Catalog.css';

const Catalog: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'price'>('year');
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [carsData, brandsData] = await Promise.all([
        carService.getAll(),
        brandService.getAll(),
      ]);
      setCars(carsData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars
    .filter((car) => {
      const matchesBrand = selectedBrand === 'all' || car.brandName === selectedBrand;
      const matchesCity = selectedCity === 'all' || car.city === selectedCity;
      const matchesSearch =
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (car.city && car.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (car.galleryName && car.galleryName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesBrand && matchesCity && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'year') {
        return b.year - a.year;
      } else {
        return b.price - a.price;
      }
    });

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <div className="header-content">
          <h1>Car Gallery</h1>
          <div className="header-actions">
            {user ? (
              <>
                <span className="welcome-text">Welcome, {user.username} ({user.role})</span>
                {(user.role === 'super-admin' || user.role === 'gallery-admin') && (
                  <Link to="/admin" className="admin-link">
                    🔧 Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">
                  Login
                </Link>
                <Link to="/register" className="auth-link primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="catalog-container">
        <div className="filters-section card">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="brand">Brand</label>
            <select
              id="brand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.brandName}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="city">City (İl)</label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              {Array.from(new Set(cars.filter(c => c.city).map(c => c.city))).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'year' | 'price')}
            >
              <option value="year">Year (Newest → Oldest)</option>
              <option value="price">Price (High → Low)</option>
            </select>
          </div>
        </div>

        <div className="results-info">
          <h2>
            {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
            {selectedBrand !== 'all' && ` - ${selectedBrand}`}
            {selectedCity !== 'all' && ` - ${selectedCity}`}
          </h2>
        </div>

        {filteredCars.length === 0 ? (
          <div className="no-results card">
            <h3>No Results Found</h3>
            <p>No cars match your search criteria.</p>
          </div>
        ) : (
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <Link 
                to={`/car/${car.id}`} 
                key={car.id} 
                className="car-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="car-image">
                  {car.imageUrl ? (
                    <img 
                      src={car.imageUrl.startsWith('http') ? car.imageUrl : `http://cargalleryapi-gaou.render.com${car.imageUrl}`} 
                      alt={`${car.brandName} ${car.model}`} 
                    />
                  ) : (
                    <div className="car-placeholder">
                      <span className="car-icon">CAR</span>
                    </div>
                  )}
                  <div className="car-year-badge">{car.year}</div>
                </div>
                <div className="car-details">
                  {car.galleryName && (
                    <div className="car-gallery-badge">
                      {car.galleryLogoUrl ? (
                        <img 
                          src={car.galleryLogoUrl.startsWith('http') ? car.galleryLogoUrl : `http://cargalleryapi-gaou.render.com${car.galleryLogoUrl}`}
                          alt={car.galleryName}
                          className="gallery-logo"
                        />
                      ) : (
                        <span className="gallery-icon">🏢</span>
                      )}
                      <span className="gallery-name">{car.galleryName}</span>
                    </div>
                  )}
                  <h3 className="car-brand">{car.brandName}</h3>
                  <p className="car-model">{car.model}</p>
                  <div className="car-info">
                    <span className="car-year">{car.year}</span>
                    {car.city && <span className="car-city">📍 {car.city}</span>}
                  </div>
                  {car.stock <= 0 ? (
                    <div className="car-out-of-stock">OUT OF STOCK</div>
                  ) : (
                    <div className="car-price">
                      {car.price.toLocaleString('en-US')} ₺
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="catalog-footer">
        <p>© 2026 Car Gallery. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Catalog;
