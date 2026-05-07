import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import CarDetail from './pages/CarDetail';
import AdminPanel from './pages/AdminPanel';
import AdminCars from './pages/AdminCars';
import AdminBrands from './pages/AdminBrands';
import AdminUsers from './pages/AdminUsers';
import AdminGalleries from './pages/AdminGalleries';
import DebugPage from './pages/DebugPage';
import './styles/global.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Catalog />} />
        <Route path="/car/:id" element={<CarDetail />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/cars" replace />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="galleries" element={<AdminGalleries />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
