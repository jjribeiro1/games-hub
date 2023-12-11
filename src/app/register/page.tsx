'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUserSchema } from '@/lib/schemas/register-user';
import { newUserAuthentication } from '@/services/authentication';
import { useAuthContext } from '@/context/auth-context';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser, currentUser } = useAuthContext();

  if (currentUser) {
    router.push('/');
  }

  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  async function onSubmit(
    values: z.infer<typeof registerUserSchema>,
    e: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    e?.preventDefault();
    try {
      const { email, password, username, name } = values;
      const newUser = await newUserAuthentication({ email, password, username, name });
      setCurrentUser({ ...newUser, displayName: username });
      router.push('/');
      toast.success('Your account has been successfully created');
    } catch (error: any) {
      toast.error(error.message, { autoClose: 5000 });
    }
  }

  return (
    <div className="flex items-center justify-center py-16">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 bg-mine-shaft-900 rounded px-6 py-2 sm:py-6"
        >
          <p className="text-mine-shaft-200 text-lg sm:text-2xl text-center">Create My Account</p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mine-shaft-100 font-medium">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your name"
                    type="text"
                    className="text-black font-semibold h-8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mine-shaft-100 font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: gamermaster42"
                    type="text"
                    className="text-black font-semibold h-8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mine-shaft-100 font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your email"
                    type="email"
                    className="text-black font-semibold h-8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row items-center gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-mine-shaft-100 font-medium">Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="text-black font-semibold h-8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-mine-shaft-100 font-medium">Password confirmation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="confirm your password"
                      type="password"
                      className="text-black font-semibold h-8"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            variant={'secondary'}
            size={'sm'}
            className="w-1/3 self-center bg-mine-shaft-600 hover:bg-mine-shaft-950 text-mine-shaft-100"
          >
            Submit
          </Button>

          <div className="flex items-center self-center">
            <p className="text-mine-shaft-300 text-sm">Already a member?</p>
            <Button
              type="button"
              size={'sm'}
              variant={'link'}
              asChild
              className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm"
            >
              <Link href={'/login'}>Log in</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
