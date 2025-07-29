// src/blocks/listing/components/ListingForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Listing } from '../../../shared/types/listing';
import {
  useListing,
  useCreateListing,
  useUpdateListing,
} from '../api';
import { listingSchema } from '../../../shared/utils/validation';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Spinner } from '../../../components/ui/spinner';
import BrandSelect from './BrandSelect';
import ModelSelect from './ModelSelect';
import FeaturesPanel from './FeaturesPanel';
import PhotoGalleryUploader from './PhotoGalleryUploader';

export interface ListingFormProps {}

type FormValues = Omit<
  Listing,
  'id' | 'created_at' | 'updated_at' | 'slug' | 'is_promoted' | 'moderation_status' | 'promoted_until'
> & {
  brand: { id: number };
  model: { id: number };
  description?: string;
};

const ListingForm: React.FC<ListingFormProps> = () => {
  const { id } = useParams<{ id: string }>();
  const listingId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: listing, isLoading: isLoadingListing } = useListing(listingId ?? 0);
  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();

  const methods = useForm<FormValues>({
    resolver: yupResolver(listingSchema),
    defaultValues: listing
      ? { ...listing, brand: { id: listing.brand.id }, model: { id: listing.model.id } }
      : undefined,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (listing) {
      reset({ ...listing, brand: { id: listing.brand.id }, model: { id: listing.model.id } });
    }
  }, [listing, reset]);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    const payload = { ...data, brand: data.brand.id, model: data.model.id };
    try {
      if (listingId) {
        await updateMutation.mutateAsync({ id: listingId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/listings');
    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(error?.message || 'Сталася помилка при відправці');
    }
  };

  if (listingId && isLoadingListing) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 max-w-2xl mx-auto">
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}
        {/* Brand and Model */}
        <BrandSelect />
        <ModelSelect />

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <Controller
            name="description"
            control={methods.control}
            render={({ field }) => (
              <textarea
                {...field}
                className="border rounded p-2 w-full h-24"
                placeholder="Enter description"
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Basic fields */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <Controller
            name="title"
            control={methods.control}
            render={({ field }) => <Input {...field} placeholder="Enter title" />}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Price & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <Controller
              name="price"
              control={methods.control}
              render={({ field }) => <Input type="number" {...field} placeholder="0" />}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <Controller
              name="currency"
              control={methods.control}
              render={({ field }) => (
                <select {...field} className="border rounded p-2 w-full">
                  <option value="UAH">UAH</option>
                  <option value="USD">USD</option>
                </select>
              )}
            />
            {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
          </div>
        </div>

        {/* Year & Mileage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <Controller
              name="year"
              control={methods.control}
              render={({ field }) => <Input type="number" {...field} placeholder="2020" />}
            />
            {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Mileage</label>
            <Controller
              name="mileage"
              control={methods.control}
              render={({ field }) => <Input type="number" {...field} placeholder="100000" />}
            />
            {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage.message}</p>}
          </div>
        </div>

        <FeaturesPanel />
        {listingId && <PhotoGalleryUploader listingId={listingId} />}

        {/* VIN & Owners */}
        <div>
          <label className="block mb-1 font-medium">VIN</label>
          <Controller
            name="vin"
            control={methods.control}
            render={({ field }) => <Input {...field} placeholder="VIN code" />}
          />
          {errors.vin && <p className="text-red-500 text-sm">{errors.vin.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Owners Count</label>
          <Controller
            name="owners_count"
            control={methods.control}
            render={({ field }) => <Input type="number" {...field} placeholder="1" />}
          />
          {errors.owners_count && <p className="text-red-500 text-sm">{errors.owners_count.message}</p>}
        </div>

        <div className="pt-6">
          <Button type="submit" disabled={isSubmitting || createMutation.isLoading || updateMutation.isLoading}>
            {listingId ? 'Update Listing' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ListingForm;
