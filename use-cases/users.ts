import { lucia } from '@/auth';
import {
  createEmailVerification,
  deleteEmailVerifications,
  deleteExpiredEmailVerifications,
  getLastEmailVerifications,
} from '@/data-access/email-verification';
import {
  createUserWithPassword,
  getUserByEmail,
  hashPassword,
  updatePassword,
  verifyUser,
} from '@/data-access/users';
import { sendVerificationEmail } from '@/emails/verification-email';
import jwt from 'jsonwebtoken';

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    const user = await createUserWithPassword(email, password);
    const emailVerification = await createEmailVerification(user.id);
    sendVerificationEmail(email, emailVerification.token);
    console.log('verification token: ', emailVerification.token);

    return { user, emailVerification };
  }

  if (existingUser.emailVerified && existingUser.password) {
    throw new Error('User already exists');
  }

  const LastEmailVerifications = await getLastEmailVerifications(
    existingUser.id,
    12
  );
  if (LastEmailVerifications.length < 3) {
    await updatePassword(existingUser.id, password);

    const emailVerification = await createEmailVerification(existingUser.id);
    sendVerificationEmail(email, emailVerification.token);
    console.log('verification token: ', emailVerification.token);

    deleteExpiredEmailVerifications(existingUser.id)
      .then(() => console.log('expired tokens removed'))
      .catch((err) => console.log('error deleting expired tokens', err));

    return { user: existingUser, emailVerification };
  } else {
    throw new Error(
      'Please check your inbox. You can only request 3 verification emails per 12 hours.'
    );
  }
}

export async function loginUserUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || !user.emailVerified) {
    throw new Error('Account not found');
  }
  if (!user.password) {
    throw new Error('Invalid account type');
  }

  const hashedPassword = await hashPassword(
    password,
    user.salt as string
  );

  if (hashedPassword !== user.password) {
    throw new Error('Wrong password');
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return sessionCookie;
}

export async function verifyEmailUseCase(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = decoded as { userId: string };

    const LastEmailVerifications = await getLastEmailVerifications(userId);
    if (
      LastEmailVerifications.length === 0 ||
      LastEmailVerifications[0].tokenExpiresAt < new Date()
    ) {
      throw new Error('Token expired');
    }

    const user = await verifyUser(userId);
    deleteEmailVerifications(userId)
      .then(() => console.log('tokens removed'))
      .catch((error) => console.error('error deleting tokens: ', error));

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return sessionCookie;
  } catch (error) {
    console.error(error);
  }
}
