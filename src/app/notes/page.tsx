import { getSession } from "@/lib/session";
import { getNotes } from "@/app/actions/notes";
import Header from "@/components/Header";
import CreateNote from "@/components/CreateNote";
import NoteCard from "@/components/NoteCard";
import type { Note } from "@/models/Note";

export default async function NotesPage() {
  const session = await getSession();
  const notes = session ? await getNotes() : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto mb-8">
          <CreateNote />
        </div>
        
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Your Notes</h2>
          {notes.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {notes.map((note) => (
                <NoteCard key={note._id.toString()} note={JSON.parse(JSON.stringify(note)) as Note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">You haven't created any notes yet.</h3>
              <p className="mt-2">Use the form above to get started!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
