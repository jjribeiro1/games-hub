import * as z from 'zod';
import { minLengthMessage } from '@/utils/min-length-message';

const baseGameSchema = z.object({
  title: z.string().min(3, { message: minLengthMessage('título', 3) }),
  genre: z.array(
    z.object({
      name: z.string().min(3, { message: minLengthMessage('gênero', 3) }),
    }),
  ),
  release_date: z.string().nonempty({ message: 'A data de lançamento é obrigatória' }),
  short_description: z.string().min(10, { message: minLengthMessage('descrição', 10) }),
  description: z.string().min(30, { message: minLengthMessage('descrição', 30) }),
  platform: z.array(
    z.object({
      name: z.string().min(2, { message: minLengthMessage('plataforma', 2) }),
    }),
  ),
  developer: z.string().min(3, { message: minLengthMessage('desenvolvedora', 3) }),
  publisher: z.string().min(3, { message: minLengthMessage('editora', 3) }),
  isFree: z
    .enum(['0', '1'])
    .refine((val) => val === '0' || val === '1', { message: 'valor inválido' })
    .transform((val) => {
      return Boolean(parseInt(val));
    }),
  game_url: z.string().min(3, { message: minLengthMessage('url do jogo', 3) }),
  thumbnail: z.string(),
  screenshots: z.array(z.string()),
});

export const createGameSchema = baseGameSchema.extend({
  minimum_system_requirements: z.object({
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
