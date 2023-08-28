'use client';
import React from 'react';
import Link from 'next/link';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUserSchema } from '@/lib/schemas/register-user';

export default function RegisterPage() {
  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  function onSubmit(
    values: z.infer<typeof registerUserSchema>,
    e: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    e?.preventDefault();
    console.log(values);
  }

  return (
    <main className="flex items-center justify-center w-full h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 bg-mine-shaft-900 rounded p-6"
        >
          <p className="text-mine-shaft-200 text-2xl text-center">Create My Account</p>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mine-shaft-100 font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
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
                    <Input
                      placeholder="password"
                      type="password"
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
            <Button type="button" size={'sm'} variant={'link'} asChild>
              <Link href={'/login'} className="text-cyan-500 hover:text-cyan-600 font-semibold text-sm">
                Log in
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
