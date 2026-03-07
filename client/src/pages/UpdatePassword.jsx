import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: string }
    const navigate = useNavigate();

    // Ideally, we would check for a session or access token here if the logic required it, 
    // but Supabase usually handles the "link click" by setting the session before this page renders 
    // or passing the token in the URL fragment which the client library processes.

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage(null);
        
        try {
            const { error } = await supabase.auth.updateUser({ 
                password: password 
            });

            if (error) throw error;
            
            setMessage({ type: 'success', text: 'Password updated successfully! Redirecting to login...' });
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ivory text-[#2d1a1a] font-display flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Element handled by global CSS or same as Auth if needed, keeping it clean here */}
             
            <div className="w-full max-w-md bg-white border border-primary/10 rounded-2xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                        Set New Password
                    </h1>
                    <div className="h-1 w-20 bg-gold rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 border ${
                        message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-700'
                    }`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-ivory border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-ivory border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-deep-maroon text-white font-bold py-3.5 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                           'Update Password'
                        )}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-3 text-center text-sm">
                        <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-primary transition-colors font-bold flex items-center justify-center gap-1">
                            <span>←</span> Cancel
                        </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
