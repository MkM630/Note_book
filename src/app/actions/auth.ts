'use server';

import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { loginSchema, signupSchema } from '@/lib/schemas';
import { hashPassword, comparePassword } from '@/lib/password';
import { createSession, deleteSession } from '@/lib/session';

type AuthState = {
  error?: string;
  success?: boolean;
};

export async function signup(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return {
      error: firstError || 'Invalid input.'
    };
  }
  
  const { username, password, fullName, age } = validatedFields.data;

  try {
    await dbConnect();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return { error: 'Username already exists' };
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ username, password: hashedPassword, fullName, age });
    await user.save();
    
    await createSession(user);
  } catch (e) {
    console.error(e);
    return { error: 'Something went wrong.' };
  }

  redirect('/notes');
}

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { 
        error: validatedFields.error.flatten().fieldErrors.username?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0]
    };
  }

  const { username, password } = validatedFields.data;

  try {
    await dbConnect();
    const user = await User.findOne({ username }).select('+password');
    if (!user || !user.password) {
      return { error: 'Invalid username or password' };
    }

    const passwordsMatch = await comparePassword(password, user.password);
    if (!passwordsMatch) {
      return { error: 'Invalid username or password' };
    }

    await createSession(user);
  } catch (e) {
    console.error(e);
    return { error: 'Something went wrong.' };
  }

  redirect('/notes');
}

export async function logout() {
  deleteSession();
  redirect('/login');
}
