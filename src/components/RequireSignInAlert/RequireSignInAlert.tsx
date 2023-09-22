import React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';

interface RequireSignInDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}
export default function RequireSignInAlert({ open, onOpenChange }: RequireSignInDialogProps) {
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-mine-shaft-950">
        <AlertDialogHeader>
          <AlertDialogDescription className="text-mine-shaft-200 text-lg">
            You must be logged in to complete this action
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => router.push('/login')}
            className="bg-cyan-700 hover:bg-cyan-800 text-mine-shaft-50"
          >
            Go to login page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
