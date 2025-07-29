// src/blocks/listing/components/PhotoGalleryUploader.tsx
import React from 'react';
import { useListing, useUploadListingPhoto, useDeleteListingPhoto } from '../api';
import { Spinner } from '@/components/ui/spinner';
import type { ListingPhoto } from '@/shared/types/listing';

interface PhotoGalleryUploaderProps {
  listingId: number;
}

const PhotoGalleryUploader: React.FC<PhotoGalleryUploaderProps> = ({ listingId }) => {
  const { data: listing, isLoading: isLoadingListing } = useListing(listingId);
  const uploadMutation = useUploadListingPhoto(listingId);
  const deleteMutation = useDeleteListingPhoto(listingId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => uploadMutation.mutate(file));
    }
  };

  if (isLoadingListing) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block mb-1 font-medium">Фотогалерея</label>
      <input type="file" multiple onChange={handleFileChange} className="mb-2" />
      {uploadMutation.isLoading && (
        <div className="flex items-center">
          <Spinner size="sm" /> Завантаження фото...
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {listing?.photos.map((photo: ListingPhoto) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.image}
              alt={`Photo ${photo.id}`}
              className="w-full h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => deleteMutation.mutate(photo.id)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGalleryUploader;
