'use client';

import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import NoteForm from './NoteForm';
import { createNote } from '@/app/actions/notes';
import { useToast } from '@/hooks/use-toast';

export default function CreateNote() {
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleCreateNote = async (formData: FormData) => {
    const result = await createNote(formData);
    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      formRef.current?.reset();
      setIsFocused(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <NoteForm
          ref={formRef}
          action={handleCreateNote}
          onFocus={() => setIsFocused(true)}
          isExpanded={isFocused}
          onClose={() => setIsFocused(false)}
        />
      </CardContent>
    </Card>
  );
}
