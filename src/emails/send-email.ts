import { Resend } from 'resend';
import { ReactNode } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, body: ReactNode) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'delivered@resend.dev',
    to,
    subject,
    react: body,
  });

  if (error) {
    console.log(error);
    throw error;
  }
}
