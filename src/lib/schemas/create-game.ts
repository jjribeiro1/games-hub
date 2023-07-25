import * as z from 'zod';
import { minLengthMessage } from './utils';

const baseGameSchema = z.object({
  title: z.string().min(3, { message: minLengthMessage('título', 3) }),
  genre: z.string().min(3, { message: minLengthMessage('gênero', 3) }),
  release_date: z.string().nonempty({ message: 'A data de lançamento é obrigatória' }),
  short_description: z.string().min(10, { message: minLengthMessage('descrição', 10) }),
  description: z.string().min(30, { message: minLengthMessage('descrição', 30) }),
  platform: z.string().min(3, { message: minLengthMessage('plataforma', 3) }),
  developer: z.string().min(3, { message: minLengthMessage('desenvolvedora', 3) }),
  publisher: z.string().min(3, { message: minLengthMessage('editora', 3) }),
  game_url: z.string().min(3, { message: minLengthMessage('url do jogo', 3) }),
  thumbnail: z.any().refine((val) => val.length > 0, { message: 'thumbnail é obrigatória' }),
});

export const createGameSchema = baseGameSchema.extend({
  min_system_requirements: z.object({
    os: z
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    processor: z
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    graphics: z
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    memory: z
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    storage: z
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
  }),
});

export type createGameTypeSchema = z.infer<typeof createGameSchema>;
