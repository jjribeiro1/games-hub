import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommentCard } from '@/components/CommentCard';
import { ReviewCard } from '@/components/ReviewCard';
import WriteCommentDialog from './WriteCommentDialog';
import { RequireSignInAlert } from '@/components/RequireSignInAlert';
import { Game } from '@/types/game';
import { Review } from '@/types/review';
import { Comment } from '@/types/comment';
import { UserInfo } from '@/types/user-info';

interface ReviewAndCommentTabsProps {
  loggedUserInfo: UserInfo | undefined;
  game: Game;
  reviewsWithComment: Review[] | undefined;
  commentsFromGame: Comment[] | undefined;
}

export default function ReviewAndCommentTabs({
  loggedUserInfo,
  game,
  reviewsWithComment,
  commentsFromGame,
}: ReviewAndCommentTabsProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openRequireSignInAlert, setOpenRequireSignInAlert] = useState(false);

  return (
    <Tabs defaultValue="reviews" className="flex flex-col gap-6 w-full max-w-3xl">
      <TabsList className="bg-inherit flex gap-4">
        <TabsTrigger value="reviews" asChild>
          <Button className="bg-inherit hover:bg-inherit text-mine-shaft-400 text-lg data-[state=active]:text-mine-shaft-100 data-[state=active]:underline gap-2">
            Reviews
            <span className="text-sm mb-4 no-underline">{reviewsWithComment?.length || 0}</span>
          </Button>
        </TabsTrigger>
        <TabsTrigger value="comments" asChild>
          <Button className="bg-inherit hover:bg-inherit text-mine-shaft-400 text-lg data-[state=active]:text-mine-shaft-100 data-[state=active]:underline gap-2">
            Comments
            <span className="text-sm mb-4 no-underline">{commentsFromGame?.length || 0}</span>
          </Button>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="reviews">
        <ul className="flex flex-col gap-4">
          {reviewsWithComment?.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} loggedUserInfo={loggedUserInfo} game={game} />
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="comments" className="flex flex-col gap-6 items-center">
        <Button
          type="button"
          onClick={loggedUserInfo ? () => setOpenDialog(true) : () => setOpenRequireSignInAlert(true)}
          className="bg-mine-shaft-800 hover:bg-mine-shaft-700 flex flex-col gap-2 py-4 h-min w-[80%] rounded-sm"
        >
          <AiOutlinePlus className="w-6 h-6 self-start" />
          <span className="self-start text-lg">Write a comment</span>
        </Button>
        <ul className="flex flex-col gap-4 w-full">
          {commentsFromGame?.map((comment) => (
            <li key={comment.id}>
              <CommentCard loggedUserInfo={loggedUserInfo} comment={comment} />
            </li>
          ))}
        </ul>
        {openRequireSignInAlert ? (
          <RequireSignInAlert
            open={openRequireSignInAlert}
            onOpenChange={setOpenRequireSignInAlert}
            message="You must be logged in to make a comment"
          />
        ) : null}
        {openDialog ? (
          <WriteCommentDialog open={openDialog} onOpenChange={setOpenDialog} gameId={game.id} />
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
