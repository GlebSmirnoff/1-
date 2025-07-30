// src/blocks/listing/ListingFormPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from './components/ListingForm';
import Spinner from '../../components/ui/spinner';
import { fetchListing, createListing, updateListing } from './api';

export default function ListingFormPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(!!listingId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listingId) {
      fetchListing(listingId)
        .then(res => {
          const data = res.data;
          // Map API fields to form default values
          setInitialValues({
            vin: data.vin || '',
            price: data.price,
            year: data.year,
            mileage: data.mileage,
            owners_count: data.owners_count,
            currency: data.currency,
            // add other fields as needed
          });
        })
        .catch(() => setError('Ошибка при загрузке объявления'))
        .finally(() => setLoading(false));
    }
  }, [listingId]);

  const handleSubmit = async (formData: any) => {
    try {
      if (listingId) {
        await updateListing(listingId, formData);
      } else {
        const res = await createListing(formData);
        // get new id and redirect to detail
        navigate(`/listings/${res.data.id}`);
        return;
      }
      // after update, go to detail
      navigate(`/listings/${listingId}`);
    } catch (err) {
      console.error('Save error', err);
      setError('Не удалось сохранить объявление');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ListingForm
        listingId={listingId}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

