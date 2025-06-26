// src/pages/ForgotPasswordPage.jsx (Definitive Version - No react-hook-form)

import { useState } from 'react'; // <-- We only need useState
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth.api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || 'If an account exists, a reset link has been sent.');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred.');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            return toast.error('Please enter your email address.');
        }
        mutation.mutate({ email });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/40 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-foreground">Reset Password</h1>
                    <p className="mt-2 text-muted-foreground">No problem. Enter your email and we'll send a reset link.</p>
                </div>
                <div className="bg-card p-8 shadow-sm border border-border rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                placeholder="you@example.com" 
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </div>
                 <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="font-semibold text-primary hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};