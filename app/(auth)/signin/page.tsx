import { validateRequest } from '@/lib/validateRequest';
import { SigninForm } from './signin-form';
import { redirect } from 'next/navigation';

export default async function Signin() {
  const { user } = await validateRequest();
  if (user) redirect('/dashboard');

  return (
    <>
      <SigninForm />
    </>
  );
}
