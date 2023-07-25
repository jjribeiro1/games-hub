'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosInstance } from '@/lib/axios/instance';
import { createGameSchema, createGameTypeSchema } from '@/lib/schemas/create-game';
import { RootObject } from '@/types/resource-response';
import ResourceData from '@/components/ResourceData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createGame } from '@/services/game';

export default function AdminPage() {
  const [id, setId] = useState('');
  const [resource, setResource] = useState<RootObject | null>(null);

  async function getResource() {
    const res = await axiosInstance.get(`/game?id=${id}`);
    const data = res.data;
    setResource(data);
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<createGameTypeSchema>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      title: '',
      genre: '',
      release_date: '',
      short_description: '',
      description: '',
      platform: '',
      developer: '',
      publisher: '',
      game_url: '',
      thumbnail: {} as FileList,
      min_system_requirements: {
        os: '',
        processor: '',
        graphics: '',
        memory: '',
        storage: '',
      },
    },
  });

  const handleFillForm = () => {
    const data = resource as RootObject;
    setValue('title', data.title, { shouldValidate: true });
    setValue('genre', data.genre, { shouldValidate: true });
    setValue('release_date', data.release_date, { shouldValidate: true });
    setValue('short_description', data.short_description, { shouldValidate: true });
    setValue('description', data.description, { shouldValidate: true });
    setValue('platform', data.platform, { shouldValidate: true });
    setValue('developer', data.developer, { shouldValidate: true });
    setValue('publisher', data.publisher, { shouldValidate: true });
    setValue('game_url', data.game_url, { shouldValidate: true });
    setValue('min_system_requirements.os', data.minimum_system_requirements.os, { shouldValidate: true });
    setValue('min_system_requirements.processor', data.minimum_system_requirements.processor, {
      shouldValidate: true,
    });
    setValue('min_system_requirements.graphics', data.minimum_system_requirements.graphics, {
      shouldValidate: true,
    });
    setValue('min_system_requirements.memory', data.minimum_system_requirements.memory, {
      shouldValidate: true,
    });
    setValue('min_system_requirements.storage', data.minimum_system_requirements.storage, {
      shouldValidate: true,
    });
  };

  const onSubmit = (data: createGameTypeSchema) => {
    createGame(data);
  };

  return (
    <div className="bg-[#fafafa] flex flex-col gap-8 w-full px-8 pb-4">
      <div className="space-y-1 mt-5 self-center">
        <Label htmlFor="resourceId" className="text-black text-base">
          ID dos dados
        </Label>
        <div className="flex items-center gap-2">
          <Input id="resourceId" value={id} onChange={(e) => setId(e.target.value)} required />
          <Button
            onClick={() => getResource()}
            type="button"
            variant={'default'}
            className="whitespace-nowrap"
          >
            Buscar dados
          </Button>
          <Button onClick={() => setResource(null)} type="button" variant={'default'}>
            Apagar
          </Button>
          <Button
            onClick={handleFillForm}
            type="button"
            variant={'default'}
            className="whitespace-nowrap"
            disabled={resource === null}
          >
            Mover dados para o form
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <form
          className="bg-[#0F172A] flex flex-col h-[500px] overflow-y-scroll gap-4 px-4 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex flex-col gap-4">
            <legend className="text-white">Informações básicas:</legend>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-white">
                  título
                </Label>
                <Input className="h-7" id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="genre" className="text-white">
                  gênero
                </Label>
                <Input className="h-7" id="genre" {...register('genre')} />
                {errors.genre && <p className="text-sm text-red-500">{errors.genre.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="release_date" className="text-white">
                  data de lançamento
                </Label>
                <Input className="h-7" id="release_date" {...register('release_date')} />
                {errors.release_date && <p className="text-sm text-red-500">{errors.release_date.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="short_description" className="text-white">
                descrição curta
              </Label>
              <Input className="h-7" id="short_description" {...register('short_description')} />
              {errors.short_description && (
                <p className="text-sm text-red-500">{errors.short_description.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-white">
                descrição
              </Label>
              <Input className="h-7" id="description" {...register('description')} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="platform" className="text-white">
                  plataforma
                </Label>
                <Input className="h-7" id="platform" {...register('platform')} />
                {errors.platform && <p className="text-sm text-red-500">{errors.platform.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="developer" className="text-white">
                  desenvolvedora
                </Label>
                <Input className="h-7" id="developer" {...register('developer')} />
                {errors.developer && <p className="text-sm text-red-500">{errors.developer.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="publisher" className="text-white">
                  editora
                </Label>
                <Input className="h-7" id="publisher" {...register('publisher')} />
                {errors.publisher && <p className="text-sm text-red-500">{errors.publisher.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="game_url" className="text-white">
                url do jogo
              </Label>
              <Input className="h-7" id="game_url" {...register('game_url')} />
              {errors.game_url && <p className="text-sm text-red-700">{errors.game_url.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="thumbnail" className="text-white">
                upload thumbnail
              </Label>
              <Input id="thumbnail" type="file" multiple={false} {...register('thumbnail')} />
              {errors.thumbnail && (
                <p className="text-sm text-red-700">{errors.thumbnail.message as string}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-white">Requisitos mínimos:</legend>

            <div className="flex flex-col gap-2 mt-4">
              <Label htmlFor="min_system_requirements_os" className="text-white">
                sistema operacional
              </Label>
              <Input
                className="h-7"
                id="min_system_requirements_os"
                {...register('min_system_requirements.os')}
              />
              {errors.min_system_requirements?.os && (
                <p className="text-sm text-red-700">{errors.min_system_requirements.os.message}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="min_system_requirements_processor" className="text-white">
                  processador
                </Label>
                <Input
                  className="h-7"
                  id="min_system_requirements_processor"
                  {...register('min_system_requirements.processor')}
                />
                {errors.min_system_requirements?.processor && (
                  <p className="text-sm text-red-700">{errors.min_system_requirements.processor.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="min_system_requirements_graphics" className="text-white">
                  placa de vídeo
                </Label>
                <Input
                  className="h-7"
                  id="min_system_requirements_graphics"
                  {...register('min_system_requirements.graphics')}
                />
                {errors.min_system_requirements?.graphics && (
                  <p className="text-sm text-red-700">{errors.min_system_requirements.graphics.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="min_system_requirements_memory" className="text-white">
                  memória RAM
                </Label>
                <Input
                  className="h-7"
                  id="min_system_requirements_memory"
                  {...register('min_system_requirements.memory')}
                />
                {errors.min_system_requirements?.memory && (
                  <p className="text-sm text-red-700">{errors.min_system_requirements.memory.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="min_system_requirements_storage" className="text-white">
                  armazenamento
                </Label>
                <Input
                  className="h-7"
                  id="min_system_requirements_storage"
                  {...register('min_system_requirements.storage')}
                />
                {errors.min_system_requirements?.storage && (
                  <p className="text-sm text-red-700">{errors.min_system_requirements.storage.message}</p>
                )}
              </div>
            </div>
          </fieldset>
          <div className="w-full flex items-center justify-around mt-4">
            <Button type="submit" variant={'secondary'} className="w-1/3">
              Criar jogo
            </Button>

            <Button onClick={() => reset()} type="button" variant={'destructive'} className="w-1/3">
              Resetar formulário
            </Button>
          </div>
        </form>
        <ResourceData resource={resource} />
      </div>
    </div>
  );
}
