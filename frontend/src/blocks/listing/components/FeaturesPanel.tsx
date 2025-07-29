// src/blocks/listing/components/FeaturesPanel.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';
import type {
  BodyType,
  Color,
  DriveType,
  FuelType,
  Transmission,
  Engine,
} from '../../../shared/types/listing';

const FeaturesPanel: React.FC = () => {
  const { control } = useFormContext();

  const { data: bodyTypes = [], isLoading: loadingBody } = useQuery<BodyType[]>({
    queryKey: ['body_types'],
    queryFn: () => api.get('/reference/body-types/').then(res => res.data),
  });
  const { data: colors = [], isLoading: loadingColor } = useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: () => api.get('/reference/colors/').then(res => res.data),
  });
  const { data: driveTypes = [], isLoading: loadingDrive } = useQuery<DriveType[]>({
    queryKey: ['drive_types'],
    queryFn: () => api.get('/reference/drive-types/').then(res => res.data),
  });
  const { data: fuelTypes = [], isLoading: loadingFuel } = useQuery<FuelType[]>({
    queryKey: ['fuel_types'],
    queryFn: () => api.get('/reference/fuel-types/').then(res => res.data),
  });
  const { data: transmissions = [], isLoading: loadingTrans } = useQuery<Transmission[]>({
    queryKey: ['transmissions'],
    queryFn: () => api.get('/reference/transmissions/').then(res => res.data),
  });
  const { data: engines = [], isLoading: loadingEngine } = useQuery<Engine[]>({
    queryKey: ['engines'],
    queryFn: () => api.get('/reference/engine-types/').then(res => res.data),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Body Type */}
      <div>
        <label className="block mb-1 font-medium">Тип кузова</label>
        <Controller
          name="body_type.id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={val => field.onChange(Number(val))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingBody ? 'Завантаження...' : 'Оберіть тип кузова'} />
              </SelectTrigger>
              <SelectContent>
                {bodyTypes.map(bt => (
                  <SelectItem key={bt.id} value={bt.id.toString()}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Color */}
      <div>
        <label className="block mb-1 font-medium">Колір</label>
        <Controller
          name="color.id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={val => field.onChange(Number(val))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingColor ? 'Завантаження...' : 'Оберіть колір'} />
              </SelectTrigger>
              <SelectContent>
                {colors.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Drive Type */}
      <div>
        <label className="block mb-1 font-medium">Привід</label>
        <Controller
          name="drive_type.id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={val => field.onChange(Number(val))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingDrive ? 'Завантаження...' : 'Оберіть привід'} />
              </SelectTrigger>
              <SelectContent>
                {driveTypes.map(d => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block mb-1 font-medium">Тип палива</label>
        <Controller
          name="fuel_type.id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={val => field.onChange(Number(val))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingFuel ? 'Завантаження...' : 'Оберіть паливо'} />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map(f => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Transmission */}
      <div>
        <label className="block mb-1 font-medium">Коробка передач</label>
        <Controller
          name="transmission.id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={val => field.onChange(Number(val))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTrans ? 'Завантаження...' : 'Оберіть коробку'} />
              </SelectTrigger>
              <SelectContent>
                {transmissions.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Engine */}
      <div>
        <label className="block mb-1 font-medium">Двигун</label>
        <Controller
          name="engine.id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={val => field.onChange(Number(val))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingEngine ? 'Завантаження...' : 'Оберіть двигун'} />
              </SelectTrigger>
              <SelectContent>
                {engines.map(e => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {e.name} {e.volume_l ? `(${e.volume_l}L)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default FeaturesPanel;
