import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const DebugPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    testLoginAPI();
  }, []);

  const testLoginAPI = async () => {
    try {
      const response = await fetch('http://cargalleryapi-gaou.render.com/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin' })
      });
      const data = await response.json();
      setApiTest(data);
    } catch (error: any) {
      setApiTest({ error: error.message });
    }
  };

  const clearStorage = () => {
    if (window.confirm('This will logout and clear all storage. Continue?')) {
      logout();
      localStorage.clear();
      sessionStorage.clear();
      alert('✅ Storage cleared! Redirecting to login...');
      navigate('/login');
    }
  };

  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '50px auto', 
      padding: '20px',
      fontFamily: 'monospace',
      background: '#1a202c',
      color: '#e2e8f0',
      borderRadius: '10px'
    }}>
      <h1 style={{ color: '#63b3ed', borderBottom: '2px solid #4299e1', paddingBottom: '10px' }}>
        🔍 Debug Panel - User & Auth Status
      </h1>

      <div style={{ background: '#2d3748', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <h2 style={{ color: '#48bb78' }}>📦 Current User (from Zustand Store)</h2>
        <pre style={{ background: '#1a202c', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
          {user ? JSON.stringify(user, null, 2) : 'No user logged in'}
        </pre>
      </div>

      <div style={{ background: '#2d3748', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <h2 style={{ color: '#48bb78' }}>📦 LocalStorage Data</h2>
        <pre style={{ background: '#1a202c', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
          {localStorage.getItem('user') || 'No user in localStorage'}
        </pre>
      </div>

      <div style={{ background: '#2d3748', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <h2 style={{ color: '#48bb78' }}>✅ Diagnostics</h2>
        {!user && (
          <div style={{ background: '#742a2a', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
            ❌ No user logged in
          </div>
        )}
        {user && user.role === 'super-admin' && (
          <div style={{ background: '#22543d', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
            ✅ Role is correct: "super-admin"
          </div>
        )}
        {user && user.role === 'gallery-admin' && (
          <div style={{ background: '#22543d', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
            ✅ Role is: "gallery-admin"
          </div>
        )}
        {user && user.role === 'user' && (
          <div style={{ background: '#744210', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
            ⚠️ Role is "user" - no admin access
          </div>
        )}
        {user && !user.hasOwnProperty('galleryId') && (
          <div style={{ background: '#742a2a', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
            ❌ Missing galleryId property (old user object)
          </div>
        )}
      </div>

      <div style={{ background: '#2d3748', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <h2 style={{ color: '#48bb78' }}>🧪 API Test Result (admin/admin login)</h2>
        <pre style={{ background: '#1a202c', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
          {apiTest ? JSON.stringify(apiTest, null, 2) : 'Testing...'}
        </pre>
        {apiTest && apiTest.role === 'super-admin' && (
          <div style={{ background: '#22543d', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
            ✅ API IS WORKING! Backend returns "super-admin" role correctly
          </div>
        )}
      </div>

      <div style={{ background: '#22543d', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <h2 style={{ color: '#68d391' }}>💡 Suggested Fix</h2>
        {!user && (
          <ol>
            <li>You are not logged in</li>
            <li>Click "Go to Login" button below</li>
            <li>Login with: admin / admin</li>
          </ol>
        )}
        {user && !user.hasOwnProperty('galleryId') && (
          <ol>
            <li><strong>PROBLEM FOUND: Old user data!</strong></li>
            <li>Click "🗑️ Clear Storage & Logout" button below</li>
            <li>Login again with: admin / admin</li>
            <li>New role will be "super-admin"</li>
          </ol>
        )}
        {user && user.role === 'super-admin' && user.hasOwnProperty('galleryId') && (
          <ol>
            <li>✅ Your data is correct!</li>
            <li>Click "Go to Admin Panel" button</li>
            <li>You should see the admin menu</li>
          </ol>
        )}
        {user && user.role === 'user' && (
          <ol>
            <li>You are logged in as regular user</li>
            <li>Logout and login with: admin / admin</li>
          </ol>
        )}
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#48bb78' }}>🔧 Actions</h2>
        <button 
          onClick={clearStorage}
          style={{ 
            background: '#f56565', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🗑️ Clear Storage & Logout
        </button>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            background: '#4299e1', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔑 Go to Login
        </button>
        <button 
          onClick={() => navigate('/admin')}
          style={{ 
            background: '#48bb78', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➡️ Go to Admin Panel
        </button>
        <button 
          onClick={testLoginAPI}
          style={{ 
            background: '#ed8936', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Re-test API
        </button>
      </div>

      <div style={{ background: '#2d3748', padding: '20px', borderRadius: '5px', margin: '20px 0' }}>
        <h2 style={{ color: '#48bb78' }}>🌐 Current Location</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #4a5568' }}>Current URL</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #4a5568' }}>{window.location.href}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #4a5568' }}>Pathname</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #4a5568' }}>{window.location.pathname}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebugPage;
