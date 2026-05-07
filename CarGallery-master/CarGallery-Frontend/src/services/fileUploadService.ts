import api from './api';

export const fileUploadService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/FileUpload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  },

  uploadMultipleImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/FileUpload/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrls;
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    await api.delete(`/FileUpload/delete?imageUrl=${encodeURIComponent(imageUrl)}`);
  },
};
