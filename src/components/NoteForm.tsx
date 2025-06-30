'use client';

import { forwardRef, useState, useTransition, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Wand2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Note } from '@/models/Note';
import { generateNoteTitle } from '@/app/actions/notes';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NOTE_COLORS = ['#FFFFFF', '#F28B82', '#AECBFA', '#CCFF90', '#FFF475', '#E8EAED'];

function SubmitButton({ isExpanded, onClose, isEditing }: { isExpanded: boolean; onClose: () => void, isEditing?: boolean }) {
  const { pending } = useFormStatus();
  if (!isExpanded) return null;
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="ghost" size="sm" onClick={onClose}>Close</Button>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save' : 'Add Note')}
      </Button>
    </div>
  );
}

type NoteFormProps = {
  action: (formData: FormData) => Promise<void | { error?: string | undefined; success?: boolean | undefined; }>;
  note?: Note;
  onFocus?: () => void;
  isExpanded: boolean;
  onClose: () => void;
};

const NoteForm = forwardRef<HTMLFormElement, NoteFormProps>(
  ({ action, note, onFocus, isExpanded, onClose }, ref) => {
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(note?.title || '');
    const [description, setDescription] = useState(note?.description || '');
    const [color, setColor] = useState(note?.color || '#FFFFFF');
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const handleGenerateTitle = () => {
      const currentDescription = descriptionRef.current?.value;
      if (!currentDescription) return;
      startTransition(async () => {
        const result = await generateNoteTitle(currentDescription);
        if (result.title) {
          setTitle(result.title);
        }
      });
    };
    
    return (
      <form ref={ref} action={action} className="grid gap-2" style={{ backgroundColor: color, transition: 'background-color 0.2s' }} onFocus={onFocus}>
        <input type="hidden" name="color" value={color} />
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Input
              name="title"
              placeholder="Title"
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" onClick={handleGenerateTitle} disabled={isPending}>
                    <Wand2 className={cn("h-4 w-4", isPending && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate Title from Note</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <Textarea
          ref={descriptionRef}
          name="description"
          placeholder="Take a note..."
          className="border-none bg-transparent shadow-none focus-visible:ring-0 resize-none"
          rows={isExpanded ? 5 : 1}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isExpanded && (
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-6 w-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: c }}
                  aria-label={`Set color to ${c}`}
                >
                  {color === c && <Check className="h-4 w-4 mx-auto my-auto text-black" />}
                </button>
              ))}
            </div>
            <SubmitButton isExpanded={isExpanded} onClose={onClose} isEditing={!!note} />
          </div>
        )}
      </form>
    );
  }
);

NoteForm.displayName = "NoteForm";

export default NoteForm;
