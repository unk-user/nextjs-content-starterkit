'use client';

import { SubmitButton } from '@/components/submit-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { signin } from './action';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';

export function SigninForm() {
  const params = useSearchParams();
  const [state, formAction] = useFormState(signin, {
    formError: params.get('formError') ?? null,
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-1">
          <Button type="button" variant="outline" className="w-full" asChild>
            <Link href="api/login/github" prefetch={false}>
              <GitHubLogoIcon className="mr-2 h-5 w-5" />
              Log in with Github
            </Link>
          </Button>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              required
              placeholder="hello@example.con"
              defaultValue={params.get('email') ?? ''}
              autoComplete="email"
              name="email"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              required
              autoComplete="new-password"
              name="password"
              type="password"
            />
          </div>
          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={err}>
                  {err}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="mt-2">
          <SubmitButton className="w-full" aria-label="submit-btn">
            Sign in
          </SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
