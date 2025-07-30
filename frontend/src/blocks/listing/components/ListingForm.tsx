// src/blocks/listing/components/ListingForm.tsx
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { listingSchema } from '../../../shared/utils/validation'
import Input from '../../../components/ui/input'
import Button from '../../../components/ui/button'
import {
  createListing,
  updateListing,
  fetchBrands,
  fetchModels,
  fetchBodyTypes,
  fetchEngines,
  fetchTransmissions,
  fetchFuelTypes,
  fetchDriveTypes,
  fetchColors,
} from '../api'
import { useQuery } from '@tanstack/react-query'

interface FormValues {
  title: string
  description: string
  vin?: string
  price: number
  year: number
  mileage: number
  owners_count: number
  currency: 'UAH' | 'USD'
  brand?: number
  model?: number
  body_type?: number
  engine?: number
  transmission?: number
  fuel_type?: number
  drive_type?: number
  color?: number
}

interface Props {
  listingId?: number
  initialValues?: Partial<FormValues>
}

export default function ListingForm({ listingId, initialValues }: Props) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(listingSchema),
    defaultValues: {
      currency: 'USD',
      ...initialValues,
    },
  })

  // --- data fetching ---
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands })
  const selectedBrand = watch('brand')
  const { data: models = [] } = useQuery({
    queryKey: ['models', selectedBrand],
    queryFn: () => fetchModels(selectedBrand!),
    enabled: Boolean(selectedBrand),
  })
  const { data: bodyTypes = [] } = useQuery({ queryKey: ['body_types'], queryFn: fetchBodyTypes })
  const { data: engines = [] } = useQuery({ queryKey: ['engines'], queryFn: fetchEngines })
  const { data: transmissions = [] } = useQuery({
    queryKey: ['transmissions'],
    queryFn: fetchTransmissions,
  })
  const { data: fuelTypes = [] } = useQuery({
    queryKey: ['fuel_types'],
    queryFn: fetchFuelTypes,
  })
  const { data: driveTypes = [] } = useQuery({
    queryKey: ['drive_types'],
    queryFn: fetchDriveTypes,
  })
  const { data: colors = [] } = useQuery({ queryKey: ['colors'], queryFn: fetchColors })

  const onSubmit = async (data: FormValues) => {
    try {
      if (listingId) await updateListing(listingId, data)
      else await createListing(data)
      // TODO: редирект / уведомление
    } catch (err) {
      console.error('Error saving listing', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block mb-1">Title</label>
        <Input {...register('title')} />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1">Description</label>
        <textarea
          {...register('description')}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* VIN */}
      <div>
        <label className="block mb-1">VIN</label>
        <Input {...register('vin')} />
        {errors.vin && <p className="text-red-600">{errors.vin.message}</p>}
      </div>

      {/* Price & Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Price</label>
          <Input type="number" {...register('price')} />
          {errors.price && <p className="text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Year</label>
          <Input type="number" {...register('year')} />
          {errors.year && <p className="text-red-600">{errors.year.message}</p>}
        </div>
      </div>

      {/* Mileage & Owners */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Mileage</label>
          <Input type="number" {...register('mileage')} />
          {errors.mileage && (
            <p className="text-red-600">{errors.mileage.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Owners Count</label>
          <Input type="number" {...register('owners_count')} />
          {errors.owners_count && (
            <p className="text-red-600">{errors.owners_count.message}</p>
          )}
        </div>
      </div>

      {/* Currency */}
      <Controller
        name="currency"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Currency</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UAH">UAH</option>
              <option value="USD">USD</option>
            </select>
          </div>
        )}
      />

      {/* Brand */}
      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Brand</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Model */}
      <Controller
        name="model"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Model</label>
            <select
              {...field}
              disabled={!selectedBrand}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select model</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Body Type */}
      <Controller
        name="body_type"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Body Type</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select body type</option>
              {bodyTypes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Engine */}
      <Controller
        name="engine"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Engine</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select engine</option>
              {engines.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Transmission */}
      <Controller
        name="transmission"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Transmission</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select transmission</option>
              {transmissions.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Fuel Type */}
      <Controller
        name="fuel_type"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Fuel Type</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select fuel type</option>
              {fuelTypes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Drive Type */}
      <Controller
        name="drive_type"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Drive Type</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select drive type</option>
              {driveTypes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Color */}
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1">Color</label>
            <select
              {...field}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select color</option>
              {colors.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Listing'}
      </Button>
    </form>
  )
}
