// src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { motion } from 'framer-motion';
import { Logo } from "../components/layout/Logo";
import { toast } from "react-hot-toast";
import { Mail, Lock } from "lucide-react";

// --- REUSABLE GOOGLE ICON ---
const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);

// ===================================================================
// === START: PREMIUM "AURORA" BRAND SHOWCASE ===
// ===================================================================
const BrandShowcase = () => {
    return (
        <div className="hidden lg:flex flex-col items-center justify-center p-12 text-white relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/40 rounded-full blur-3xl"
                    animate={{ x: [-100, 100], y: [-50, 50], rotate: [0, 45] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                />
                <motion.div
                    className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-600/40 rounded-full blur-3xl"
                    animate={{ x: [100, -100], y: [50, -50], rotate: [-45, 0] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
            </div>
            
            <motion.div
                className="relative z-10 text-center flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                <motion.div
                    animate={{ y: [-5, 5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                >
                    <div className="relative p-0">
                        <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl opacity-50" />
                        <Logo />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-bold tracking-tight mt-4" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
                    AINewsBuzz
                </h1>
                <p className="text mt-2 text-white/75 max-w-sm" style={{ textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)' }}>
                    Your daily digest of AI-powered news, curated for clarity.
                </p>
            </motion.div>
        </div>
    );
};

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const loginAction = useAuthStore((state) => state.login);

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            toast.success("Welcome back!");
            loginAction(data.token, { 
                username: data.username, 
                id: data._id, 
                profilePicture: data.profilePicture 
            });
            navigate("/news");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Login failed. Please check your details.");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ email, password });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
            {/* The Master Card that contains both sections */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden border border-border/20 bg-card"
            >
                {/* Left Side - Brand Showcase */}
                <BrandShowcase />
            
                {/* Right Side - Form Section */}
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12 bg-card/80 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Enter your credentials to access your account.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative"
                            >
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input 
                                    type="email" 
                                    id="email" 
                                    required 
                                    className="w-full pl-10 pr-3 py-3 border border-border bg-secondary/80 rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all duration-200" 
                                    placeholder="you@example.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative"
                            >
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input 
                                    type="password" 
                                    id="password" 
                                    required 
                                    className="w-full pl-10 pr-3 py-3 border border-border bg-secondary/80 rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all duration-200" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </motion.div>
                            
                            <motion.button
                                type="submit" 
                                disabled={isPending}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging In...
                                    </>
                                ) : "Login"}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative my-6"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card/80 backdrop-blur-sm px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center border border-border bg-secondary py-3 rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors text-foreground font-medium"
                            onClick={() => toast("Google authentication coming soon!", { icon: "🔜" })}
                        >
                            <GoogleIcon />
                            Sign in with Google
                        </motion.button>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center text-muted-foreground mt-6 text-sm"
                        >
                            Don't have an account?{" "}
                            <Link 
                                to="/register" 
                                className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};