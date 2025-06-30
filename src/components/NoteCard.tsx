'use client';

import { useState } from 'react';
import type { Note } from '@/models/Note';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import NoteForm from './NoteForm';
import { deleteNote, updateNote } from '@/app/actions/notes';
import { useToast } from '@/hooks/use-toast';

export default function NoteCard({ note }: { note: Note }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateNote = async (formData: FormData) => {
    const result = await updateNote(note._id.toString(), formData);
    if (result?.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      setIsEditDialogOpen(false);
      toast({ title: 'Success', description: 'Note updated successfully.' });
    }
  };

  const handleDeleteNote = async () => {
    const result = await deleteNote(note._id.toString());
     if (result?.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Note deleted successfully.' });
    }
  };

  return (
    <Card
      className="flex flex-col break-inside-avoid-column"
      style={{ backgroundColor: note.color, transition: 'background-color 0.2s' }}
    >
      <CardHeader>
        <CardTitle className="font-headline text-lg">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm whitespace-pre-wrap">{note.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-2">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Edit note">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <NoteForm
              action={handleUpdateNote}
              note={note}
              isExpanded={true}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Delete note">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteNote}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
