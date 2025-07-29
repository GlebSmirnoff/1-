// src/blocks/listing/components/ModelSelect.tsx
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import type { Model } from '../../../shared/types/listing';

const ModelSelect: React.FC = () => {
  const { control } = useFormContext();
  const brandId = useWatch({ control, name: 'brand.id' });

  const { data: models = [], isLoading, isError } = useQuery<Model[], Error>({
    queryKey: ['models', brandId],
    queryFn: () => {
      if (!brandId) return Promise.resolve([]);
      return api
        .get(`/reference/brands/${brandId}/models/`)
        .then(res => res.data);
    },
    enabled: Boolean(brandId),
  });

  return (
    <div>
      <label className="block mb-1 font-medium">Модель</label>
      <Controller
        name="model.id"
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={(val: string) => field.onChange(Number(val))}
            value={field.value?.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoading ? 'Завантаження...' : 'Оберіть модель'} />
            </SelectTrigger>
            <SelectContent>
              {isError && <SelectItem value="">Помилка завантаження</SelectItem>}
              {!isLoading &&
                models.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default ModelSelect;