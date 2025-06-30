'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleLogout} 
      disabled={isPending}
      aria-label="Log out"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
