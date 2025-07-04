// // src/pages/LoginPage.jsx
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { loginUser } from "../api/auth.api";
// import { useAuthStore } from "../store/auth.store";
// import { motion } from 'framer-motion';
// import { Logo } from "../components/layout/Logo";
// import { toast } from "react-hot-toast";
// import { Mail, Lock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const BrandShowcase = () => {
//   return (
//     <div className="hidden lg:flex flex-col items-center justify-center p-12 text-white relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
//       <div className="absolute inset-0 z-0">
//         <motion.div
//           className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/40 rounded-full blur-3xl"
//           animate={{ x: [-100, 100], y: [-50, 50], rotate: [0, 45] }}
//           transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
//         />
//         <motion.div
//           className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-600/40 rounded-full blur-3xl"
//           animate={{ x: [100, -100], y: [50, -50], rotate: [-45, 0] }}
//           transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
//       </div>
      
//       <motion.div
//         className="relative z-10 text-center flex flex-col items-center"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//       >
//         <motion.div
//           animate={{ y: [-5, 5] }}
//           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
//         >
//           <div className="relative p-0">
//             <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl opacity-50" />
//             <Logo />
//           </div>
//         </motion.div>

//         <h1 className="text-3xl font-bold tracking-tight mt-4" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
//           AINewsBuzz
//         </h1>
//         <p className="text mt-2 text-white/75 max-w-sm" style={{ textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)' }}>
//           Your daily digest of AI-powered news, curated for clarity.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const loginAction = useAuthStore((state) => state.login);
//   const googleButtonRef = useRef(null);

//   const { mutate, isPending } = useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       toast.success("Welcome back!");
//       loginAction(data.token, data.user);
//       setTimeout(() => { window.location.href = '/news'; }, 500);
//     },
//     onError: (error) => {
//       toast.error(error.message || "Login failed. Please check your credentials.");
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error("Please enter both email and password");
//       return;
//     }
//     mutate({ email, password });
//   };

//   useEffect(() => {
//     // Check if the google accounts library is loaded and the ref is available
//     if (window.google && googleButtonRef.current) {
//       // Render the button explicitly
//       window.google.accounts.id.renderButton(
//         googleButtonRef.current,
//         { 
//           type: "standard",
//           size: "large",
//           theme: "outline",
//           text: "signin_with",
//           shape: "rectangular",
//           logo_alignment: "left",
//           width: "320"
//         }
//       );
//     }
//   }, []);

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden border border-border/20 bg-card"
//       >
//         {/* Left Side - Brand Showcase */}
//         <BrandShowcase />
      
//         {/* Right Side - Form Section */}
//         <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12 bg-card/80 backdrop-blur-sm">
//           <div className="w-full max-w-md space-y-6">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-center"
//             >
//               <h2 className="text-3xl font-bold tracking-tight text-foreground">
//                 Welcome Back
//               </h2>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Enter your credentials to access your account.
//               </p>
//             </motion.div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="space-y-2"
//               >
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                   <Input 
//                     id="email" 
//                     type="email" 
//                     placeholder="you@example.com" 
//                     className="w-full pl-10" 
//                     value={email} 
//                     onChange={(e) => setEmail(e.target.value)} 
//                     required 
//                   />
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="space-y-2"
//               >
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                   <Input 
//                     id="password" 
//                     type="password" 
//                     placeholder="Enter your password" 
//                     className="w-full pl-10" 
//                     value={password} 
//                     onChange={(e) => setPassword(e.target.value)} 
//                     required 
//                   />
//                 </div>
//               </motion.div>
              
//               <div className="flex items-center justify-end">
//                 <Link 
//                   to="/forgot-password" 
//                   className="text-sm font-semibold text-primary hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
              
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <Button 
//                   type="submit" 
//                   className="w-full" 
//                   disabled={isPending}
//                 >
//                   {isPending ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Logging In...
//                     </>
//                   ) : "Login"}
//                 </Button>
//               </motion.div>
//             </form>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="relative my-6"
//             >
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-border/50" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card/80 backdrop-blur-sm px-2 text-muted-foreground">
//                   Or continue with
//                 </span>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7 }}
//               className="flex justify-center w-full"
//             >
//               <div 
//                 ref={googleButtonRef} 
//                 id="google-login-button"
//                 className="w-full flex justify-center"
//               />
//             </motion.div>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8 }}
//               className="text-center text-muted-foreground mt-6 text-sm"
//             >
//               Don't have an account?{" "}
//               <Link 
//                 to="/register" 
//                 className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </motion.p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { motion } from 'framer-motion';
import { Logo } from "../components/layout/Logo";
import { toast } from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// <-- NEW: Import the callback function directly
import { handleGoogleCredentialResponse } from "../utils/googleAuthCallback";

const BrandShowcase = () => {
  // This component remains unchanged
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
  const googleButtonRef = useRef(null);

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("Welcome back!");
      loginAction(data.token, data.user);
      setTimeout(() => { window.location.href = '/news'; }, 500);
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please check your credentials.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    mutate({ email, password });
  };

  // --- UPDATED GOOGLE AUTH LOGIC ---
  useEffect(() => {
    // Check if the google accounts library is loaded and the ref is available
    if (window.google && googleButtonRef.current) {
      // 1. Initialize the Google library
      window.google.accounts.id.initialize({
        client_id: "694198870363-9hb9h8ug0m59o6fdc25ek2h86c7rj2k7.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse // Pass the imported function directly
      });

      // 2. Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { 
          type: "standard",
          size: "large",
          theme: "outline",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: "320"
        }
      );
      
      // Optional: You can also display the One Tap prompt if you want
      // window.google.accounts.id.prompt();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden border border-border/20 bg-card"
      >
        <BrandShowcase />
      
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
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full pl-10" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full pl-10" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </motion.div>
              
              <div className="flex items-center justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isPending}
                >
                  {isPending ? "Logging In..." : "Login"}
                </Button>
              </motion.div>
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center w-full"
            >
              <div 
                ref={googleButtonRef} 
                id="google-login-button"
                className="w-full flex justify-center"
              />
            </motion.div>

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
// // src/pages/LoginPage.jsx
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { loginUser } from "../api/auth.api";
// import { useAuthStore } from "../store/auth.store";
// import { motion } from 'framer-motion';
// import { Logo } from "../components/layout/Logo";
// import { toast } from "react-hot-toast";
// import { Mail, Lock, Chrome } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const BrandShowcase = () => {
//   return (
//     <div className="hidden lg:flex flex-col items-center justify-center p-12 text-white relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
//       <div className="absolute inset-0 z-0">
//         <motion.div
//           className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/40 rounded-full blur-3xl"
//           animate={{ x: [-100, 100], y: [-50, 50], rotate: [0, 45] }}
//           transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
//         />
//         <motion.div
//           className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-600/40 rounded-full blur-3xl"
//           animate={{ x: [100, -100], y: [50, -50], rotate: [-45, 0] }}
//           transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
//       </div>
      
//       <motion.div
//         className="relative z-10 text-center flex flex-col items-center"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//       >
//         <motion.div
//           animate={{ y: [-5, 5] }}
//           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
//         >
//           <div className="relative p-0">
//             <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl opacity-50" />
//             <Logo />
//           </div>
//         </motion.div>

//         <h1 className="text-3xl font-bold tracking-tight mt-4" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
//           AINewsBuzz
//         </h1>
//         <p className="text mt-2 text-white/75 max-w-sm" style={{ textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)' }}>
//           Your daily digest of AI-powered news, curated for clarity.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const loginAction = useAuthStore((state) => state.login);

//   const { mutate, isPending } = useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       toast.success("Welcome back!");
//       loginAction(data.token, data.user);
//       navigate("/news");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Login failed. Please check your credentials.");
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error("Please enter both email and password");
//       return;
//     }
//     mutate({ email, password });
//   };

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden border border-border/20 bg-card"
//       >
//         {/* Left Side - Brand Showcase */}
//         <BrandShowcase />
      
//         {/* Right Side - Form Section */}
//         <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12 bg-card/80 backdrop-blur-sm">
//           <div className="w-full max-w-md space-y-6">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-center"
//             >
//               <h2 className="text-3xl font-bold tracking-tight text-foreground">
//                 Welcome Back
//               </h2>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Enter your credentials to access your account.
//               </p>
//             </motion.div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="space-y-2"
//               >
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                   <Input 
//                     id="email" 
//                     type="email" 
//                     placeholder="you@example.com" 
//                     className="w-full pl-10" 
//                     value={email} 
//                     onChange={(e) => setEmail(e.target.value)} 
//                     required 
//                   />
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="space-y-2"
//               >
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                   <Input 
//                     id="password" 
//                     type="password" 
//                     placeholder="Enter your password" 
//                     className="w-full pl-10" 
//                     value={password} 
//                     onChange={(e) => setPassword(e.target.value)} 
//                     required 
//                   />
//                 </div>
//               </motion.div>
              
//               <div className="flex items-center justify-end">
//                 <Link 
//                   to="/forgot-password" 
//                   className="text-sm font-semibold text-primary hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
              
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <Button 
//                   type="submit" 
//                   className="w-full" 
//                   disabled={isPending}
//                 >
//                   {isPending ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Logging In...
//                     </>
//                   ) : "Login"}
//                 </Button>
//               </motion.div>
//             </form>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="relative my-6"
//             >
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-border/50" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card/80 backdrop-blur-sm px-2 text-muted-foreground">
//                   Or continue with
//                 </span>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7 }}
//             >
//               <Button 
//                 variant="outline" 
//                 className="w-full" 
//                 onClick={() => toast("Google authentication coming soon!", { icon: "🔜" })}
//               >
//                 <Chrome className="mr-2 h-4 w-4" />
//                 Sign in with Google
//               </Button>
//             </motion.div>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8 }}
//               className="text-center text-muted-foreground mt-6 text-sm"
//             >
//               Don't have an account?{" "}
//               <Link 
//                 to="/register" 
//                 className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </motion.p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };