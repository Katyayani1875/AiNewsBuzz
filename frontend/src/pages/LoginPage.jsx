import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // On successful login, save user state and token globally
      login(data.token, { username: data.username, id: data._id });
      // Redirect to the homepage
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="container mx-auto max-w-md p-8">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Login to AI NewsBuzz
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... form inputs for email and password ... */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-500"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
        {mutation.isError && (
          <p className="text-red-400 text-center">{mutation.error.message}</p>
        )}
      </form>
    </div>
  );
};
