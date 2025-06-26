// frontend/src/pages/ResetPasswordPage.jsx (No new dependencies)

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { validateResetToken, resetPassword } from '../api/auth.api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { isLoading, isError, error } = useQuery({
        queryKey: ['validateToken', token],
        queryFn: () => validateResetToken(token),
        retry: false,
    });

    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            toast.success(data.message);
            navigate('/login');
        },
        onError: (err) => toast.error(err.message),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error("Passwords do not match.");
        if (password.length < 8) return toast.error("Password must be at least 8 characters.");
        mutation.mutate({ token, password });
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Validating link...</div>;
    if (isError) return <div className="min-h-screen flex items-center justify-center text-destructive">Error: {error.message}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/40 p-4">
             <div className="w-full max-w-md space-y-6">
                <div className="text-center"><h1 className="text-3xl font-extrabold text-foreground">Choose a New Password</h1></div>
                <div className="bg-card p-8 shadow-sm border border-border rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter new password"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" />
                        </div>
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Updating...' : 'Set New Password'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};