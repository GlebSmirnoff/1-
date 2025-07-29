// src/blocks/listing/ListingDetailPage.tsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useListing, useDeleteListing } from './api';
import PhotoGalleryUploader from './components/PhotoGalleryUploader';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const listingId = Number(id);
  const navigate = useNavigate();

  const {
    data: listing,
    isLoading,
    isError,
    error,
  } = useListing(listingId);
  const deleteMutation = useDeleteListing();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Помилка завантаження: {error.message}
      </div>
    );
  }

  if (!listing) {
    return <div className="p-4">Оголошення не знайдено</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(listingId);
      navigate('/listings');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <div className="space-x-2">
          <Link to={`/listings/${listingId}/edit`}>
            <Button>Редагувати</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Видалити
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Бренд:</strong> {listing.brand.name}</p>
        <p><strong>Модель:</strong> {listing.model.name}</p>
        <p><strong>Рік:</strong> {listing.year}</p>
        <p><strong>Пробіг:</strong> {listing.mileage.toLocaleString()}</p>
        <p><strong>Ціна:</strong> {listing.price.toLocaleString()} {listing.currency}</p>
      </div>

      {listing.description && (
        <div>
          <h2 className="text-xl font-semibold">Опис</h2>
          <p>{listing.description}</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Фото</h2>
        <PhotoGalleryUploader listingId={listingId} readOnly />
      </div>
    </div>
  );
};

export default ListingDetailPage;
