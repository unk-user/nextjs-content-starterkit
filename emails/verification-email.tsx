import { Html, Button, Text } from '@react-email/components';
import * as React from 'react';
import { sendEmail } from './send-email';

export default function VerificationEmail({ token }: { token: string }) {
  return (
    <Html>
      <Text>this is your token: {token}</Text>
      <Button
        href={
          'http://' +
          (process.env.DOMAIN_NAME || 'localhost:3000') +
          `/api/verify-email?token=${token}`
        }
        style={{
          backgroundColor: 'black',
          padding: '10px',
          borderRadius: '2px',
          color: 'white',
        }}
      >
        Verify Email
      </Button>
    </Html>
  );
}

export function sendVerificationEmail(to: string, token: string) {
  sendEmail(to, 'Email verification', <VerificationEmail token={token} />)
    .then((res) => console.log('email sent :', res))
    .catch((err) => console.log(err));
}
