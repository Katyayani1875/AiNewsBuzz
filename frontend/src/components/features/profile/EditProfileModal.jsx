// src/components/features/profile/EditProfileModal.jsx
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth.store';
import { updateUserProfile } from '../../../api/user.api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // Assuming you've added this via shadcn
import { Input } from '@/components/ui/input';   // Assuming you've added this
import { Textarea } from '@/components/ui/textarea'; // Assuming you've added this

export const EditProfileModal = ({ isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { user, login } = useAuthStore();

  // State for form fields, initialized with current user data
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  
  // State for the new profile picture file and its preview URL
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePicture?.url);
  const fileInputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUserData) => {
      // On success, update the global auth state with the new user info
      const { token, ...newUser } = updatedUserData;
      login(useAuthStore.getState().token, newUser); // Re-use existing token
      // Invalidate the profile query to refetch the fresh data
      queryClient.invalidateQueries({ queryKey: ['profile', user.username] });
      onOpenChange(false); // Close the modal
    },
    onError: (error) => {
      console.error("Profile update failed:", error.message);
      // TODO: Show an error toast
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('location', location);
    formData.append('website', website);
    if (profilePicFile) {
      formData.append('profilePicture', profilePicFile);
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161B22] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Your Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-6">
            <img src={profilePicPreview || 'https://i.imgur.com/V4Rcl9I.png'} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-700" />
            <div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden"/>
              <Button type="button" onClick={() => fileInputRef.current.click()} variant="outline">
                Change Picture
              </Button>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB.</p>
            </div>
          </div>

          {/* Bio Textarea */}
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">Bio</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength="160" className="bg-gray-800 border-gray-700" />
          </div>

          {/* Location and Website Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">Location</label>
              <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">Website</label>
              <Input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://your-site.com" className="bg-gray-800 border-gray-700" />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};