import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User, UpdateUserRoleDto } from '../types';
import { useAuthStore } from '../store/authStore';
import './Admin.css';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      const updateData: UpdateUserRoleDto = {
        userId,
        role: newRole,
      };
      await authService.updateUserRole(updateData);
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating role');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (currentUser?.id === id) {
      alert('You cannot delete your own account!');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await authService.deleteUser(id);
      loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Error deleting user');
    }
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
        <h2>User Management</h2>
        <div className="info-badge">
          Total {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.username}
                  {currentUser?.id === user.id && (
                    <span className="current-user-badge"> (You)</span>
                  )}
                </td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td>
                  {user.createdDate
                    ? new Date(user.createdDate).toLocaleDateString('en-US')
                    : '-'}
                </td>
                <td>
                  <div className="action-buttons">
                    {user.role === 'user' ? (
                      <button
                        className="success"
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        disabled={currentUser?.id === user.id}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="secondary"
                        onClick={() => handleRoleChange(user.id, 'user')}
                        disabled={currentUser?.id === user.id}
                      >
                        Make User
                      </button>
                    )}
                    <button
                      className="danger"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={currentUser?.id === user.id}
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

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>ℹ️ Information</h3>
        <ul style={{ lineHeight: '1.8', color: '#666' }}>
          <li>The first registered user automatically becomes an admin.</li>
          <li>Admin users can promote other users to admin.</li>
          <li>You cannot delete or change your own account role.</li>
          <li>The first admin user cannot be deleted.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUsers;
