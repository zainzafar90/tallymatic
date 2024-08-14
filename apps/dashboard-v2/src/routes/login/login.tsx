import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

      localStorage.setItem('token', res.tokens.access.token);

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
    <div className="flex flex-col min-h-dvh w-dvw items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center space-y-3">
          <LogoBox />
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
              <div className="grid gap-4">
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
                        <FormMessage />
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
                {serverError && (
                  <Alert className="mt-4" onClose={() => console.log('closed')}>
                    {serverError}
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
