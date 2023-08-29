import * as z from 'zod';
import { minLengthMessage } from '@/utils/min-length-message';
import { nonEmptyMessage } from '@/utils/non-empty-message';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: nonEmptyMessage('email') })
    .email({ message: 'invalid email format' }),

  password: z
    .string()
    .nonempty({ message: nonEmptyMessage('password') })
    .min(6, { message: minLengthMessage('password', 6) }),
});
