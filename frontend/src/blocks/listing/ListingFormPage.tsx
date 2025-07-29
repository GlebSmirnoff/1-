// src/blocks/listing/ListingFormPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ListingForm from './components/ListingForm';

const ListingFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const listingId = id ? Number(id) : undefined;

  return <ListingForm listingId={listingId} />;
};

export default ListingFormPage;

