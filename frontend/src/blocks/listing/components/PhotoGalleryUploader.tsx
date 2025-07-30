// src/blocks/listing/components/PhotoGalleryUploader.tsx
import React, { useState } from 'react';
import Spinner from '../../../components/ui/spinner';
import { uploadPhoto, deleteListingPhoto } from '../api';

interface Photo {
  id: number;
  image: string;
  is_main: boolean;
}

interface Props {
  listingId: number;
  initialPhotos: Photo[];
}

export default function PhotoGalleryUploader({ listingId, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const file = e.target.files[0];
    try {
      const res = await uploadListingPhoto(listingId, file);
      setPhotos(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Upload error', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: number) => {
    try {
      await deleteListingPhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto mb-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative">
            <img src={photo.image} alt="listing" className="w-32 h-32 object-cover rounded" />
            <button
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
              onClick={() => handleDelete(photo.id)}
            >
              &times;
            </button>
          </div>
        ))}
        {uploading && (
          <div className="flex items-center justify-center w-32 h-32 border-dashed border-2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
      <label className="block">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <div className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer text-center">
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </div>
      </label>
    </div>
  );
}
