'use client';
import React from 'react';
import Link from 'next/link';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema } from '@/lib/schemas/login-input';
import { login } from '@/services/authentication';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(
    values: z.infer<typeof loginSchema>,
    e: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    e?.preventDefault();
    try {
      const { email, password } = values;
      await login({ email, password });
      toast.success('Login successful! Welcome back!');
    } catch (error: any) {
      toast.error(error.message, { autoClose: 5000 });
    }
  }

  return (
    <main className="flex items-center justify-center w-full h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 bg-mine-shaft-900 rounded p-6"
        >
          <p className="text-mine-shaft-200 text-2xl text-center">Login</p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mine-shaft-100 font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email"
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

          <Button
            type="submit"
            variant={'secondary'}
            size={'sm'}
            className="w-1/3 self-center bg-mine-shaft-600 hover:bg-mine-shaft-950 text-mine-shaft-100"
          >
            Submit
          </Button>

          <div className="flex items-center self-center">
            <p className="text-mine-shaft-300 text-sm">{"Don't have an account?"}</p>
            <Button
              type="button"
              size={'sm'}
              variant={'link'}
              asChild
              className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm"
            >
              <Link href={'/register'}>Register</Link>
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
