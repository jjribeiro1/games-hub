import * as z from 'zod';
import { minLengthMessage } from '@/utils/min-length-message';
import { nonEmptyMessage } from '@/utils/non-empty-message';

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: nonEmptyMessage('name') })
      .min(3, { message: minLengthMessage('name', 3) }),

    username: z
      .string()
      .nonempty({ message: nonEmptyMessage('username') })
      .min(4, { message: minLengthMessage('username', 4) }),

    email: z
      .string()
      .nonempty({ message: nonEmptyMessage('email') })
      .email({ message: 'invalid email format' }),

    password: z
      .string()
      .nonempty({ message: nonEmptyMessage('password') })
      .min(6, { message: minLengthMessage('password', 6) }),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'wrong password confirmation',
        path: ['passwordConfirmation'],
      });
    }
  });
