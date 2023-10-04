'use client';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosInstance } from '@/lib/axios/instance';
import { createGameSchema, createGameTypeSchema } from '@/lib/schemas/create-game';
import { RootObject } from '@/types/resource-response';
import { ResourceData } from '@/components/ResourceData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createGame } from '@/services/game';
import { AddDocFirebaseError, UploadImageError } from '@/exceptions';
import { getImageDownloadUrl, uploadFile } from '@/services/storage';

export default function AdminPage() {
  const [id, setId] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [resource, setResource] = useState<RootObject | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function getResource() {
    try {
      const res = await axiosInstance.get(`/game?id=${id}`);
      const data = res.data;
      setResource(data);
    } catch (error) {
      toast.error('Erro ao buscar dados');
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<createGameTypeSchema>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      title: '',
      genre: [{ name: '' }],
      release_date: '',
      short_description: '',
      description: '',
      platform: [{ name: '' }],
      developer: '',
      publisher: '',
      game_url: '',
      isFree: true,
      thumbnail: '',
      screenshots: ['', ''],
      createdAt: new Date(),
      minimum_system_requirements: {
        os: '',
        processor: '',
        graphics: '',
        memory: '',
        storage: '',
      },
    },
  });

  const {
    fields: platformFields,
    append: appendPlatform,
    remove: removePlatform,
  } = useFieldArray({ name: 'platform', control });
  const {
    fields: genresFields,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({ name: 'genre', control });

  const handleFillForm = () => {
    const data = resource as RootObject;
    setValue('title', data.title, { shouldValidate: true });
    setValue('release_date', data.release_date, { shouldValidate: true });
    setValue('short_description', data.short_description, { shouldValidate: true });
    setValue('description', data.description, { shouldValidate: true });
    setValue('developer', data.developer, { shouldValidate: true });
    setValue('publisher', data.publisher, { shouldValidate: true });
    setValue('game_url', data.game_url, { shouldValidate: true });
    if (data.minimum_system_requirements) {
      setValue('minimum_system_requirements.os', data.minimum_system_requirements?.os, {
        shouldValidate: true,
      });
      setValue('minimum_system_requirements.processor', data.minimum_system_requirements?.processor, {
        shouldValidate: true,
      });
      setValue('minimum_system_requirements.graphics', data.minimum_system_requirements?.graphics, {
        shouldValidate: true,
      });
      setValue('minimum_system_requirements.memory', data.minimum_system_requirements?.memory, {
        shouldValidate: true,
      });
      setValue('minimum_system_requirements.storage', data.minimum_system_requirements?.storage, {
        shouldValidate: true,
      });
    }
  };

  function handleSelectedFile(fileList: FileList | null) {
    fileList && setImageFile(fileList[0]);
  }

  function handleResetFileInput() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setImageFile(null);
  }

  async function handleUploadImageSubmit() {
    try {
      const storagePath = imageFile?.name.includes('thumb')
        ? `/thumbnail/${imageFile.name}`
        : `/screenshots/${imageFile?.name}`;
      const uploadedImage = await uploadFile(storagePath, imageFile as File);
      const downloadUrl = await getImageDownloadUrl(uploadedImage.ref);
      setDownloadUrl(downloadUrl);
      toast.success('upload feito com sucesso');
    } catch (error: any) {
      if (error instanceof UploadImageError) {
        toast.error(error.message);
        return;
      }
      toast.error(`Um erro inesperado ocorreu no upload da imagem: ${error.message}`);
    }
  }

  const onSubmit = async (data: createGameTypeSchema) => {
    try {
      setDisableButton(true);
      const createGameInput = {
        ...data,
        release_date: new Date(data.release_date),
        platform: data.platform.map((platform) => platform.name),
        genre: data.genre.map((genre) => genre.name),
      };
      await createGame(createGameInput);
      toast.success('Jogo criado com sucesso');
    } catch (error: any) {
      if (error instanceof AddDocFirebaseError || error instanceof UploadImageError) {
        toast.error(error.message);
        return;
      }
      toast.error(`Um erro inesperado ocorreu ao criar o jogo: ${error.message}`);
    } finally {
      setDisableButton(false);
    }
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
      <div className="flex items-center gap-4 my-2 mx-auto">
        <div className="flex flex-col gap-2 ">
          <Label htmlFor="fileInput" className="text-black">
            upload de imagem
          </Label>
          <Input
            type="file"
            id="fileInput"
            onChange={(e) => handleSelectedFile(e.target.files)}
            ref={inputRef}
          />
        </div>

        <Button
          variant={'default'}
          type="button"
          onClick={handleUploadImageSubmit}
          disabled={!imageFile ? true : false}
        >
          enviar imagem
        </Button>
        <Button variant={'default'} type="button" onClick={handleResetFileInput}>
          limpar input
        </Button>
      </div>
      {downloadUrl && (
        <div>
          <span className="text-black">URL: {downloadUrl}</span>
          <Button
            className="ml-4 w-6 h-6"
            size={'sm'}
            variant={'destructive'}
            onClick={() => setDownloadUrl('')}
          >
            x
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <form
          className="bg-[#0F172A] flex flex-col h-[500px] overflow-y-scroll gap-4 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex flex-col gap-4">
            <legend className="text-white text-lg">Informações básicas:</legend>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-white">
                  título
                </Label>
                <Input className="h-7" id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="release_date" className="text-white">
                  data de lançamento
                </Label>
                <Input className="h-7" id="release_date" {...register('release_date')} />
                {errors.release_date && <p className="text-sm text-red-500">{errors.release_date.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="genre" className="text-white">
                  Lista de gêneros
                </Label>
                <Button
                  className=" h-5 w-6 text-xs"
                  size={'sm'}
                  variant={'secondary'}
                  type="button"
                  onClick={() => appendGenre({ name: '' })}
                >
                  +1
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-8">
                {genresFields.map((field, i) => (
                  <div key={field.id} className="relative w-1/5">
                    <Input className="h-7" id="genre" {...register(`genre.${i}.name`)} />
                    {errors.genre && <p className="text-sm text-red-500">{errors.genre.message}</p>}

                    {i > 0 && (
                      <Button
                        className="absolute -top-5 right-0 h-4 w-4 text-xs"
                        size={'sm'}
                        variant={'destructive'}
                        type="button"
                        onClick={() => removeGenre(i)}
                      >
                        x
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-8">
                <Label htmlFor="platform" className="text-white">
                  Lista de plataformas
                </Label>
                <Button
                  className=" h-5 w-6 text-xs"
                  size={'sm'}
                  variant={'secondary'}
                  type="button"
                  onClick={() => appendPlatform({ name: '' })}
                >
                  +1
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-8">
                {platformFields.map((field, i) => (
                  <div key={field.id} className="relative w-1/5">
                    <Input className="h-7" id="platform" {...register(`platform.${i}.name`)} />
                    {errors.platform && <p className="text-sm text-red-500">{errors.platform.message}</p>}

                    {i > 0 && (
                      <Button
                        className="absolute -top-5 right-0 h-4 w-4 text-xs"
                        size={'sm'}
                        variant={'destructive'}
                        type="button"
                        onClick={() => removePlatform(i)}
                      >
                        x
                      </Button>
                    )}
                  </div>
                ))}
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
                thumbnail
              </Label>
              <Input id="thumbnail" className="h-7" {...register('thumbnail')} />
              {errors.thumbnail && (
                <p className="text-sm text-red-700">{errors.thumbnail.message as string}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="screenshot1" className="text-white">
                screenshot 1
              </Label>
              <Input id="screenshot1" className="h-7" {...register('screenshots.0')} />
              {errors.screenshots && (
                <p className="text-sm text-red-700">{errors.screenshots.message as string}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="screenshot2" className="text-white">
                screenshot 2
              </Label>
              <Input id="screenshot2" className="h-7" {...register('screenshots.1')} />
              {errors.screenshots && (
                <p className="text-sm text-red-700">{errors.screenshots.message as string}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-white text-lg">É grátis para jogar?</legend>

            <div className="flex items-center gap-3 mt-4">
              <Label htmlFor="isFree" className="text-white">
                Sim
              </Label>
              <Input
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                id="isFree"
                type="radio"
                {...register('isFree')}
                value={1}
              />
            </div>

            <div className="flex items-center gap-2.5">
              <Label htmlFor="isNotFree" className="text-white">
                Não
              </Label>
              <Input
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                id="isNotFree"
                type="radio"
                {...register('isFree')}
                value={0}
              />
            </div>
            {errors.isFree && <p className="text-sm text-red-700">{errors.isFree.message}</p>}
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-white text-lg">Requisitos mínimos:</legend>

            <div className="flex flex-col gap-2 mt-4">
              <Label htmlFor="minimum_system_requirements_os" className="text-white">
                sistema operacional
              </Label>
              <Input
                className="h-7"
                id="minimum_system_requirements_os"
                {...register('minimum_system_requirements.os')}
              />
              {errors.minimum_system_requirements?.os && (
                <p className="text-sm text-red-700">{errors.minimum_system_requirements.os.message}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="minimum_system_requirements_processor" className="text-white">
                  processador
                </Label>
                <Input
                  className="h-7"
                  id="minimum_system_requirements_processor"
                  {...register('minimum_system_requirements.processor')}
                />
                {errors.minimum_system_requirements?.processor && (
                  <p className="text-sm text-red-700">
                    {errors.minimum_system_requirements.processor.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="minimum_system_requirements_graphics" className="text-white">
                  placa de vídeo
                </Label>
                <Input
                  className="h-7"
                  id="minimum_system_requirements_graphics"
                  {...register('minimum_system_requirements.graphics')}
                />
                {errors.minimum_system_requirements?.graphics && (
                  <p className="text-sm text-red-700">
                    {errors.minimum_system_requirements.graphics.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="minimum_system_requirements_memory" className="text-white">
                  memória RAM
                </Label>
                <Input
                  className="h-7"
                  id="minimum_system_requirements_memory"
                  {...register('minimum_system_requirements.memory')}
                />
                {errors.minimum_system_requirements?.memory && (
                  <p className="text-sm text-red-700">{errors.minimum_system_requirements.memory.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="minimum_system_requirements_storage" className="text-white">
                  armazenamento
                </Label>
                <Input
                  className="h-7"
                  id="minimum_system_requirements_storage"
                  {...register('minimum_system_requirements.storage')}
                />
                {errors.minimum_system_requirements?.storage && (
                  <p className="text-sm text-red-700">{errors.minimum_system_requirements.storage.message}</p>
                )}
              </div>
            </div>
          </fieldset>
          <div className="w-full flex items-center justify-around mt-4">
            <Button type="submit" variant={'secondary'} className="w-1/3" disabled={disableButton}>
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
