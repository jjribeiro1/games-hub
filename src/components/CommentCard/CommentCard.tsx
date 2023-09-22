import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { BsTrash } from 'react-icons/bs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useDeleteComment from '@/mutations/delete-comment';
import { Comment } from '@/types/comment';
import { UserInfo } from '@/types/user-info';
import { timestampToDate } from '@/utils/timestamp-to-date';
import { toast } from 'react-toastify';

interface CommentCardProps {
  loggedUserInfo: UserInfo | undefined;
  comment: Comment;
}

export default function CommentCard({ loggedUserInfo, comment }: CommentCardProps) {
  const deleteCommentMutation = useDeleteComment();

  const handleDeleteComment = (comment: Comment) => {
    if (!loggedUserInfo || comment.userId !== loggedUserInfo.id) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    deleteCommentMutation.mutate({ commentId: comment.id });
  };

  return (
    <Card className="bg-zinc-900/50 border-2 border-mine-shaft-600 rounded">
      <CardHeader className="pb-2">
        {loggedUserInfo?.id === comment.userId ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="bg-inherit hover:bg-inherit h-min w-min py-0.5 px-2 self-end rounded-sm"
              >
                <BsTrash className="text-red-500 w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-mine-shaft-950">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl text-mine-shaft-100 font-semibold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-mine-shaft-200">
                  This action cannot be undone. This will permanently delete your comment
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteComment(comment)}
                  type="button"
                  className="bg-red-500 hover:bg-red-500 text-mine-shaft-50"
                >
                  Yes, delete my comment
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-mine-shaft-300 pt-5">{comment.text}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Avatar>
          <AvatarFallback
            className="bg-mine-shaft-100 hover:bg-mine-shaft-200 text-mine-shaft-900 text-lg font-semibold 
                          h-9 w-9 capitalize cursor-pointer"
          >
            {comment.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="text-mine-shaft-200">{comment.username}</p>
        <span className="text-mine-shaft-400 text-xs">
          {timestampToDate(comment.createdAt as unknown as Timestamp)}
        </span>
      </CardFooter>
    </Card>
  );
}
