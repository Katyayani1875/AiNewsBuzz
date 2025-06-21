// // src/pages/UserProfilePage.jsx
// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { fetchUserProfile } from '../api/user.api';
// import { useAuthStore } from '../store/auth.store';

// export const UserProfilePage = () => {
//   const { username } = useParams();
//   const { user: currentUser } = useAuthStore();
//   const { data: profile, isLoading, isError } = useQuery({
//     queryKey: ['profile', username],
//     queryFn: () => fetchUserProfile(username),
//   });
//   const isOwnProfile = currentUser?.username === username;

//   if (isLoading) return <div className="text-center p-10">Loading Profile...</div>;
//   if (isError) return <div className="text-center p-10 text-red-400">User not found.</div>;

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <div className="bg-[#161B22] rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800">
//         <img src={profile.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} alt={profile.username}
//           className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-lg"/>
//         <div className="text-center md:text-left">
//           <h1 className="text-4xl font-bold text-white">{profile.username}</h1>
//           <p className="text-gray-400 mt-2 max-w-lg">{profile.bio || "This user hasn't added a bio yet."}</p>
//           {isOwnProfile && (
//             <button className="mt-4 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
//               Edit Profile
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold text-white">User Activity</h2>
//         <p className="text-gray-500 mt-4">User's comment and like history will be displayed here.</p>
//       </div>
//     </div>
//   );
// };

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../api/user.api';
import { useAuthStore } from '../store/auth.store';

export const UserProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserProfile(username),
  });

  const isOwnProfile = currentUser?.username === username;

  if (isLoading) return <div className="text-center p-10">Loading Profile...</div>;

  if (isError)
    return (
      <div className="text-center p-10">
        <p className="text-red-400">User not found.</p>
        <button
          onClick={refetch}
          className="mt-4 bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  const handleEditProfile = () => {
    navigate(`/edit-profile/${username}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-[#161B22] rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800">
        <img
          src={profile.profilePicture?.url || 'https://i.imgur.com/placeholder.png'}
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white">{profile.username}</h1>
          <p className="text-gray-400 mt-2 max-w-lg">{profile.bio || "This user hasn't added a bio yet."}</p>
          {isOwnProfile && (
            <button
              onClick={handleEditProfile}
              className="mt-4 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white">User Activity</h2>
        {profile.activities?.length ? (
          <ul className="mt-4 space-y-4">
            {profile.activities.map((activity, index) => (
              <li key={index} className="bg-gray-900 text-gray-400 p-4 rounded-md">
                {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
};
