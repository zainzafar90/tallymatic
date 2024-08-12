import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Heading, Input, Text } from '@medusajs/ui';

import { Divider } from '../../components/common/divider';
import { Form } from '../../components/common/form';
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
    <div className="bg-ui-bg-base flex min-h-dvh w-dvw items-center justify-center">
      <div className="m-4 flex w-full max-w-[300px] flex-col items-center">
        <LogoBox className="mb-4" />
        <div className="mb-4 flex flex-col items-center">
          <Heading>Log in</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            to continue to Tallymatic
          </Text>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
              <div className="flex flex-col gap-y-4">
                <Form.Field
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Email</Form.Label>
                        <Form.Control>
                          <Input autoComplete="email" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Password</Form.Label>
                        <Form.Control>
                          <Input type="password" autoComplete="current-password" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
              </div>
              <Button className="w-full" type="submit" isLoading={isPending}>
                Continue
              </Button>
            </form>
            {serverError && (
              <Alert className="mt-4" dismissible variant="error">
                {serverError}
              </Alert>
            )}
          </Form>
        </div>
        <Divider variant="dashed" className="my-6" />
        <span className="text-ui-fg-subtle txt-small">
          <Link
            key="reset-password-link"
            to="/reset-password"
            className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover outline-none"
          >
            Forgot password?
          </Link>
        </span>
      </div>
    </div>
  );
};
