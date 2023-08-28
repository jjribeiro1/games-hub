import * as z from 'zod';
import { minLengthMessage } from '@/utils/min-length-message';
import { nonEmptyMessage } from '@/utils/non-empty-message';

export const registerUserSchema = z
  .object({
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
    passwordConfirmation: z
      .string()
      .nonempty({ message: nonEmptyMessage('password confirmation') })
      .min(6, { message: minLengthMessage('password confirmation', 6) }),
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
