// src/pages/UserProfilePage.jsx (Updated with Professional Side-by-Side Header)

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile } from '../api/user.api';
import { useAuthStore } from '../store/auth.store';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, Link as LinkIcon, MapPin, Edit, MessageSquare, Heart, Bookmark, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const EditProfileModal = ({ isOpen, onOpenChange, userProfile }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ bio: '', location: '', website: '' });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                bio: userProfile.bio || '',
                location: userProfile.location || '',
                website: userProfile.website || '',
            });
            setPreview(userProfile.profilePicture?.url);
        }
    }, [userProfile, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const mutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['profile', updatedUser.username] });
            onOpenChange(false);
        },
        onError: (error) => console.error("Profile update failed:", error),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('bio', formData.bio);
        data.append('location', formData.location);
        data.append('website', formData.website);
        if (profilePictureFile) {
            data.append('profilePicture', profilePictureFile);
        }
        mutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[525px]">
                <DialogHeader><DialogTitle className="text-xl">Edit Your Profile</DialogTitle><DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription></DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="flex items-center gap-6">
                        <div className="relative"><img src={preview || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.username}`} alt="Profile preview" className="w-24 h-24 rounded-full object-cover bg-secondary" /><Label htmlFor="picture" className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"><Upload size={16} /></Label><Input id="picture" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" /></div>
                        <div><p className="font-semibold text-foreground">Profile Picture</p><p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB.</p></div>
                    </div>
                    <div className="grid gap-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="min-h-[80px]" maxLength={160}/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="location">Location</Label><Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
                        <div className="grid gap-2"><Label htmlFor="website">Website</Label><Input id="website" placeholder="https://your-site.com" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} /></div>
                    </div>
                </form>
                 <DialogFooter><Button type="submit" onClick={handleSubmit} disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Changes'}</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ProfileBanner = () => ( <div className="absolute top-0 left-0 w-full h-40 md:h-48 bg-secondary -z-10"><div className="w-full h-full bg-[url('/img/circuit-pattern.svg')] opacity-5"></div></div> );

// The placeholder now includes a shadow for better depth perception
const ActivityPlaceholder = ({ icon: Icon, title, description }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center py-16 px-6 bg-card border border-border rounded-lg shadow-sm dark:shadow-none">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
);


// --- The Main UserProfilePage Component ---
export const UserProfilePage = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('comments');

    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => fetchUserProfile(username),
    });

    const isOwnProfile = currentUser?.username === username;

    if (isLoading) return <div className="text-center p-10 text-muted-foreground animate-pulse">Loading Profile...</div>;
    if (isError) return <div className="text-center p-10 text-destructive">User not found.</div>;

    const tabs = [
        { id: 'comments', label: 'Comments', icon: MessageSquare },
        { id: 'likes', label: 'Likes', icon: Heart },
        { id: 'followed', label: 'Followed Topics', icon: Bookmark }
    ];

    return (
        <>
            {isOwnProfile && <EditProfileModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} userProfile={profile} />}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative min-h-screen">
                <ProfileBanner />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative pt-12 pb-8 border-b border-border">
                        {/* 
                          *** LAYOUT FIX STARTS HERE ***
                        */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                            {/* AVATAR */}
                            <div className="relative -mt-24 flex-shrink-0">
                                <img
                                    src={profile.profilePicture?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`}
                                    alt={profile.username}
                                    className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-background bg-background shadow-lg"
                                />
                            </div>
                            
                            {/* USER INFO & METADATA */}
                            <div className="flex-grow text-center sm:text-left">
                                <h1 className="text-3xl font-extrabold text-foreground">{profile.username}</h1>
                                <p className="text-muted-foreground">@{profile.username}</p>
                                <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
                                    </div>
                                    {/* Other metadata like location or website can be added here */}
                                </div>
                            </div>

                            {/* ACTION BUTTON (pushed to the right on larger screens) */}
                            <div className="sm:ml-auto">
                                {isOwnProfile ? (
                                    <Button onClick={() => setIsModalOpen(true)} variant="outline"><Edit size={16} className="mr-2" /> Edit Profile</Button>
                                ) : (
                                    <Button><UserPlus size={16} className="mr-2" /> Follow</Button>
                                )}
                            </div>
                        </div>

                        {/* BIO (now sits below the main header line for better flow) */}
                        <div className="mt-6 text-center sm:text-left">
                           <p className="text-foreground/90 max-w-2xl">{profile.bio || "This user hasn't written a bio yet."}</p>
                        </div>
                    </div>
                    
                    {/* USER ACTIVITY SECTION (This part remains unchanged) */}
                    <div className="mt-8">
                        <div className="border-b border-border">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors focus:outline-none ${ activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-700' }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="mt-6">
                            {activeTab === 'comments' && <ActivityPlaceholder icon={MessageSquare} title="User's Comments" description="A list of all comments made by this user will appear here."/>}
                            {activeTab === 'likes' && <ActivityPlaceholder icon={Heart} title="Liked Articles" description="A grid of news articles that this user has liked will be displayed here."/>}
                            {activeTab === 'followed' && <ActivityPlaceholder icon={Bookmark} title="Followed Topics" description="Topics this user follows will be listed here."/>}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default UserProfilePage;