import { getSession } from "@/lib/session";
import { NotebookText } from "lucide-react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function Header() {
  const session = await getSession();

  const nameToDisplay = (session?.fullName as string) || (session?.username as string);

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/notes" className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline text-foreground">
            MM NoteBook
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {nameToDisplay && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{nameToDisplay.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{nameToDisplay}</span>
            </div>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
