// src/components/features/profile/UserActivity.jsx (FINAL, WITH LIKES)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUserComments, fetchUserLikedComments } from '../../../api/user.api';
import { UserComment } from './UserComment';
import { UserLikedComment } from './UserLikedComment'; // <-- IMPORT

export const UserActivity = ({ username }) => {
  const [activeTab, setActiveTab] = useState('comments');

  // Query for user's own comments
  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['userComments', username],
    queryFn: () => fetchUserComments(username),
    // This query will only run when the component mounts, as it's not disabled.
  });

  // Query for user's liked comments
  const { data: likedComments, isLoading: isLoadingLikes } = useQuery({
    queryKey: ['userLikedComments', username],
    queryFn: () => fetchUserLikedComments(username),
    // **THE OPTIMIZATION**: This query is disabled initially.
    // It will only be fetched when the 'likes' tab becomes active.
    enabled: activeTab === 'likes',
  });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">User Activity</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900">
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="topics" disabled>Followed Topics</TabsTrigger>
        </TabsList>

        {/* Comments Tab Content */}
        <TabsContent value="comments" className="mt-4">
          <div className="space-y-4">
            {isLoadingComments && <p className="text-gray-400">Loading comments...</p>}
            {comments && comments.length > 0 && comments.map(comment => (
              <UserComment key={comment._id} comment={comment} />
            ))}
            {comments && comments.length === 0 && (
              <p className="text-gray-500 text-center py-8">This user hasn't made any comments yet.</p>
            )}
          </div>
        </TabsContent>

        {/* Likes Tab Content */}
        <TabsContent value="likes" className="mt-4">
          <div className="space-y-4">
            {isLoadingLikes && <p className="text-gray-400">Loading likes...</p>}
            {likedComments && likedComments.length > 0 && likedComments.map(comment => (
              <UserLikedComment key={comment._id} comment={comment} />
            ))}
            {likedComments && likedComments.length === 0 && (
              <p className="text-gray-500 text-center py-8">This user hasn't liked any comments yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};