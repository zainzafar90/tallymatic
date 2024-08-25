import { useLocation, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Text, TextLink } from '@/components/ui/text';
import { API_TOKEN_KEY } from '@/utils/common.utils';

import { LogoBox } from '../../components/common/logo-box';
import { useEmailPassLogin } from '../../hooks/api/auth';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/dashboard';

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  //  TODO: Update when more than emailpass is supported
  const { mutateAsync, isPending } = useEmailPassLogin();

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      const res = await mutateAsync({
        email,
        password,
      });

      localStorage.setItem(API_TOKEN_KEY, res.access.token);

      navigate(from, { replace: true });
    } catch (error: any) {
      if (error?.code === 401) {
        form.setError('email', {
          type: 'manual',
        });

        form.setError('password', {
          type: 'manual',
          message: 'Wrong email or password',
        });

        return;
      }

      form.setError('root.serverError', {
        type: 'manual',
        message: 'Server error - Try again later.',
      });
    }
  });

  const serverError = form.formState.errors?.root?.serverError?.message;

  return (
    <div className="relative flex flex-col min-h-dvh w-dvw items-center justify-center">
      <div className="absolute inset-0 bg-[url(/bg/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="mx-auto max-w-md">
        <div className="relative h-full w-full rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
          <div className="grid h-full w-full justify-items-center overflow-hidden place-items-start p-6 py-8 sm:p-8 lg:p-12">
            <Form {...form}>
              <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
                <div className="flex items-center space-x-4">
                  <LogoBox className="w-6 h-6" />
                  <Heading className="text-lg capitalize">Tallymatic</Heading>
                </div>
                <Text>Enter your email below to login to your account</Text>
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input autoComplete="email" {...field} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" autoComplete="current-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="flex flex-wrap justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <Switch name="remember_me" />
                      <Label htmlFor="remember_me">Remember me</Label>
                    </div>
                    <TextLink href="/forgot-password" className="underline">
                      Forgot password?
                    </TextLink>
                  </div>

                  {serverError && (
                    <Alert variant="destructive">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}

                  <Button color="blue" type="submit" className="w-full" disabled={isPending}>
                    Login
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              <Text>
                Don&apos;t have an account?{' '}
                <TextLink href="/register" className="underline">
                  Sign up
                </TextLink>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
