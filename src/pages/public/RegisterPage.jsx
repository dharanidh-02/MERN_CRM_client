import React, { useState } from 'react';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Iridescence from '/src/pages/Iridescence/Iridescence.jsx';
import * as API from '../../api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await API.registerUser({
                username,
                password,
                role
            });

            // Redirect to login page after successful registration
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const roles = ['Admin', 'Faculty', 'Student'];

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
            {/* Iridescence Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                <Iridescence
                    color={[0.7, 0.7, 1]}
                    mouseReact={false}
                    amplitude={0.1}
                    speed={1.0}
                />
            </div>

            {/* Back Button */}
            <Link to="/" className="absolute top-8 left-8 text-blue-300 hover:text-white transition-colors flex items-center gap-2 z-20">
                <FaArrowLeft /> Back to Home
            </Link>

            {/* Registration Form */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Create Account</h2>
                    <p className="text-blue-200/80 text-sm">Register as <span className="text-cyan-400 font-semibold">{role}</span></p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Username Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaUser className="text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 text-white placeholder-blue-200/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-400/50 focus:bg-black/30 transition-all duration-300"
                            placeholder="Username"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 text-white placeholder-blue-200/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-400/50 focus:bg-black/30 transition-all duration-300"
                            placeholder="Password"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/20 text-white placeholder-blue-200/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-400/50 focus:bg-black/30 transition-all duration-300"
                            placeholder="Confirm Password"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="flex justify-center gap-4 mb-2">
                        {roles.map((roleOption) => (
                            <button
                                type="button"
                                key={roleOption}
                                onClick={() => setRole(roleOption)}
                                disabled={isLoading}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${role === roleOption
                                    ? 'bg-blue-600 border-transparent text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-white/5 border-white/10 text-blue-200/60 hover:bg-white/10 hover:text-white'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {roleOption}
                            </button>
                        ))}
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out flex items-center justify-center ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                        {isLoading ? (
                            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            'Register'
                        )}
                    </button>

                    {/* Footer Links */}
                    <div className="flex justify-center items-center text-sm mt-6 text-blue-200/60">
                        <span>Already have an account? </span>
                        <Link to="/login" className="ml-1 hover:text-white transition-colors text-cyan-400">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;