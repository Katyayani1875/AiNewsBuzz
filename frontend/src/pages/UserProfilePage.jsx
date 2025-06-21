// src/pages/UserProfilePage.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../api/user.api';
import { useAuthStore } from '../store/auth.store';
import { EditProfileModal } from '../components/features/profile/EditProfileModal';
import { UserActivity } from '../components/features/profile/UserActivity'; // <-- IMPORT

export const UserProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserProfile(username),
  });

  const isOwnProfile = currentUser?.username === username;

  if (isLoading) return <div className="text-center p-10">Loading Profile...</div>;
  if (isError) return <div className="text-center p-10 text-red-400">User not found.</div>;

  return (
    <>
      {isOwnProfile && <EditProfileModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />}

      <div className="container mx-auto p-4 md:p-8">
        {/* Profile Header (no changes needed here) */}
        <div className="bg-[#161B22] rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800">
          <img
            src={profile.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'}
            alt={profile.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white">{profile.username}</h1>
            <p className="text-gray-400 mt-2 max-w-lg">{profile.bio || "This user hasn't added a bio yet."}</p>
            {isOwnProfile && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* --- RENDER THE USER ACTIVITY COMPONENT --- */}
        <UserActivity username={username} />
      </div>
    </>
  );
};