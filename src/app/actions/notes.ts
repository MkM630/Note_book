'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { getSession } from '@/lib/session';
import { noteSchema } from '@/lib/schemas';
import { generateKeywords } from '@/ai/flows/generate-keywords';

export async function getNotes() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return [];
    }

    await dbConnect();
    const notes = await Note.find({ owner: session.userId }).sort({ createdAt: -1 });
    return notes;
  } catch (error) {
    console.error('Failed to get notes:', error);
    return [];
  }
}

export async function createNote(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = noteSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    color: formData.get('color'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    await dbConnect();
    const newNote = new Note({
      ...validatedFields.data,
      owner: session.userId,
    });
    await newNote.save();
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    console.error('Failed to create note:', error);
    return { error: 'Failed to create note' };
  }
}

export async function updateNote(noteId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = noteSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    color: formData.get('color'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    await dbConnect();
    await Note.findOneAndUpdate(
      { _id: noteId, owner: session.userId },
      validatedFields.data
    );
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    console.error('Failed to update note:', error);
    return { error: 'Failed to update note' };
  }
}

export async function deleteNote(noteId: string) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: 'Unauthorized' };
  }

  try {
    await dbConnect();
    await Note.findOneAndDelete({ _id: noteId, owner: session.userId });
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete note:', error);
    return { error: 'Failed to delete note' };
  }
}

export async function generateNoteTitle(noteContent: string) {
  if (!noteContent) {
    return { title: '' };
  }
  try {
    const result = await generateKeywords({ noteContent });
    return { title: result.keywords };
  } catch (error) {
    console.error('Failed to generate title:', error);
    return { error: 'Failed to generate title' };
  }
}
