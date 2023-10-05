import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useCreateComment from '@/mutations/create-comment';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import { toast } from 'react-toastify';

interface WriteCommentDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  gameId: string;
}

export default function WriteCommentDialog({ open, onOpenChange, gameId }: WriteCommentDialogProps) {
  const [commentValue, setCommentValue] = useState('');
  const maxCommentLength = 140;
  const { loggedUserInfo } = useLoggedUserInfo();
  const createCommentMutation = useCreateComment();

  const handleCreateComment = () => {
    if (!loggedUserInfo) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    createCommentMutation.mutate({
      userId: loggedUserInfo.id,
      username: loggedUserInfo.username,
      gameId,
      text: commentValue,
      createdAt: new Date(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-mine-shaft-950 p-6 max-w-[350px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl text-mine-shaft-100 font-semibold">Comment text</DialogTitle>
        </DialogHeader>
        <Textarea
          className="text-lg text-mine-shaft-950 font-medium placeholder:text-mine-shaft-900 placeholder:text-sm"
          placeholder="write a comment"
          onChange={(e) => setCommentValue(e.target.value)}
          value={commentValue}
          maxLength={maxCommentLength}
        />
        <div className="text-mine-shaft-50 text-sm text-end">
          {`${commentValue.length} / ${maxCommentLength}`}
        </div>

        <DialogFooter className='gap-3 sm:gap-0'>
          <Button type="button" variant={'destructive'} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateComment}
            className="bg-cyan-700 hover:bg-cyan-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-lg font-medium"
            disabled={commentValue.length < 1}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
