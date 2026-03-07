import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const Auth = () => {
  const { role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("signIn"); // 'signIn' | 'forgotPassword'
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: string }
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // Security Check: Verify if the email has been confirmed
      if (data.user && !data.user.email_confirmed_at) {
        // Force sign out to clear the unverified session
        await supabase.auth.signOut();
        throw new Error(
          "Please verify your email address before logging in. Check your inbox for the confirmation link.",
        );
      }

      console.log(data.user);

      // AuthContext.onAuthStateChange will fire and fetch the DB role automatically.
      // Navigate home — role-based redirects can be handled by ProtectedRoute.
      navigate("/portal");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }; 

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const appUrl = import.meta.env.VITE_APP_URL ?? "http://localhost:5173";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/update-password`,
      });
      if (error) throw error;
      setMessage({
        type: "success",
        text: "Check your email for the password reset link!",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-[#2d1a1a] font-display flex items-center justify-center p-4 pt-28 relative overflow-hidden">
      <div className="w-full max-w-md bg-white border border-primary/10 rounded-2xl p-8 shadow-2xl relative z-10 my-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            {view === "signIn" ? "Welcome Back" : "Reset Password"}
          </h1>
          <div className="h-1 w-20 bg-gold rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            {view === "signIn"
              ? "Sign in to access the hall portal"
              : "Enter your email to receive instructions"}
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 flex items-start gap-3 border ${
              message.type === "error"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form
          onSubmit={view === "signIn" ? handleSignIn : handleResetPassword}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ivory border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                placeholder="name@kgpian.iitkgp.ac.in"
              />
            </div>
          </div>

          {view === "signIn" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ivory border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-deep-maroon text-white font-bold py-3.5 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : view === "signIn" ? (
              "Sign In"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 text-center text-sm">
          {view === "signIn" && (
            <button
              onClick={() => {
                setView("forgotPassword");
                setMessage(null);
              }}
              className="text-gray-500 hover:text-primary transition-colors font-medium"
            >
              Forgot your password?
            </button>
          )}

          {view === "forgotPassword" && (
            <button
              onClick={() => {
                setView("signIn");
                setMessage(null);
              }}
              className="text-gray-600 hover:text-primary transition-colors font-bold flex items-center justify-center gap-1"
            >
              <span>←</span> Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
