import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@/models/User';

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error('JWT_SECRET is not set in environment variables');
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { userId: string; username: string, fullName: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionData = { userId: user._id.toString(), username: user.username, fullName: user.fullName };
  const session = await encrypt(sessionData);

  cookies().set('session', session, { expires, httpOnly: true });
}

export async function getSession() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  return session;
}

export function deleteSession() {
  cookies().delete('session');
}
