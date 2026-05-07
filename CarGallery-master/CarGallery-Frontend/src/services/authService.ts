import api from './api';
import { User, LoginDto, RegisterDto, UpdateUserRoleDto } from '../types';

export const authService = {
  login: async (data: LoginDto): Promise<User> => {
    const response = await api.post('/Auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<User> => {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/Auth/users');
    return response.data;
  },

  updateUserRole: async (data: UpdateUserRoleDto): Promise<User> => {
    const response = await api.put('/Auth/users/role', data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/Auth/users/${id}`);
  },
};
