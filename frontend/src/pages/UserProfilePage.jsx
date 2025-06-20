// src/pages/UserProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// We'll create this API function next
import { fetchUserProfile } from '../api/user.api'; 

export const UserProfilePage = () => {
  const { username } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserProfile(username),
  });

  if (isLoading) {
    return <div>Loading profile...</div>; // TODO: Add a skeleton loader
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-[#161B22] p-8 rounded-lg text-center">
        <img 
          src={profile.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-cyan-400"
        />
        <h1 className="text-4xl font-bold text-white mt-4">{profile.username}</h1>
        <p className="text-gray-400 mt-2">{profile.bio || "This user hasn't written a bio yet."}</p>
        {/* TODO: Add tabs for comments, likes, etc. */}
      </div>
    </div>
  );
};