// src/blocks/listing/components/BrandSelect.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import type { Brand } from '../../../shared/types/listing';

const BrandSelect: React.FC = () => {
  const { control } = useFormContext();
  const { data: brands = [], isLoading, isError } = useQuery<Brand[], Error>({
    queryKey: ['brands'],
    queryFn: () => api.get('/reference/brands/').then(res => res.data),
  });

  return (
    <div>
      <label className="block mb-1 font-medium">Марка</label>
      <Controller
        name="brand.id"
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={(val: string) => field.onChange(Number(val))}
            value={field.value?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? 'Завантаження...' : 'Оберіть марку'} />
            </SelectTrigger>
            <SelectContent>
              {isError && <SelectItem value="">Помилка завантаження</SelectItem>}
              {!isLoading &&
                brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default BrandSelect;
