import React, { useState } from 'react';
import { FaUser, FaLock, FaArrowLeft, FaUserGraduate } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Iridescence from '/src/pages/Iridescence/Iridescence.jsx';
import * as API from '../../api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState('Student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log('Login attempt:', { username, password, activeRole });

        try {
            console.log('Sending request to server...');
            const response = await API.loginUser({
                username,
                password,
                role: activeRole // Send the selected role
            });

            console.log('Server response:', response.data);

            const { role, message, user } = response.data;

            // Store user data in localStorage
            if (user) {
                localStorage.setItem('userId', user._id);
                localStorage.setItem('username', user.name || username);
                localStorage.setItem('role', role);
                console.log('Stored user data:', { userId: user._id, username: user.name, role });
            }

            // Navigate based on role (case insensitive)
            const userRole = role.toLowerCase();

            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else if (userRole === 'faculty') {
                navigate('/faculty/dashboard');
            } else if (userRole === 'student') {
                navigate('/student/dashboard');
            } else {
                // For any other users, redirect to general user dashboard
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const roles = ['Admin', 'Faculty', 'Student'];

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
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
            <Link to="/" className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors flex items-center gap-2 z-20 font-medium tracking-wide">
                <FaArrowLeft /> Back to Home
            </Link>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">

                <div className="text-center mb-8">
                    {/* University Icon/Logo could go here */}
                    <div className="w-16 h-16 bg-blue-900/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/10">
                        <FaUserGraduate className="text-2xl text-white" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide text-shadow-sm">University Portal</h2>
                    <p className="text-blue-100/80 text-sm">Secure Access Gateway</p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-100 text-sm p-3 rounded-lg text-center backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection (Segmented Control) */}
                    <div className="p-1 bg-black/20 rounded-lg flex mb-6">
                        {roles.map((role) => (
                            <button
                                type="button"
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeRole === role
                                    ? 'bg-white text-blue-900 shadow-sm'
                                    : 'text-blue-100/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {/* Username Field */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-blue-100/80 ml-1 uppercase tracking-wider">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaUser className="text-blue-200 group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/10 text-white placeholder-blue-200/50 border border-white/20 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-200"
                                placeholder="Enter your ID"
                                disabled={isLoading}
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-blue-100/80 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLock className="text-blue-200 group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 text-white placeholder-blue-200/50 border border-white/20 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-200"
                                placeholder="Enter your password"
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-900/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center mt-4 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                        {isLoading ? (
                            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            'LOGIN'
                        )}
                    </button>

                    {/* Footer Links */}
                    <div className="flex justify-between items-center text-xs mt-6 text-blue-200/60 font-medium">
                        <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5">Forgot Password?</a>
                        <Link to="/enquiry" className="hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5">Public Enquiry</Link>
                    </div>
                </form>
            </div>

            <div className="absolute bottom-4 text-white/30 text-xs font-medium tracking-widest z-10">
                SECURE CAMPUS ERP SYSTEM
            </div>
        </div>
    );
};

export default LoginPage;
