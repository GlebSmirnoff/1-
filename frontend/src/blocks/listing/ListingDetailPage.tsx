// src/blocks/listing/ListingDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../../components/ui/spinner';
import Button from '../../components/ui/button';
import ListingCard from './components/ListingCard';
import { fetchListing, deleteListing } from './api';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = Number(id);
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;
    fetchListing(listingId)
      .then(res => {
        setListing(res.data);
      })
      .catch(() => setError('Ошибка при загрузке объявления'))
      .finally(() => setLoading(false));
  }, [listingId]);

  const handleDelete = async () => {
    try {
      await deleteListing(listingId);
      navigate('/listings');
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <div className="space-y-4">
      <ListingCard listing={listing} />
      <div className="flex gap-2">
        <Button onClick={() => navigate(`/listings/${listingId}/edit`)}>Edit</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}
