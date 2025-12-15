import React, { useState } from 'react';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Iridescence from '/src/pages/Iridescence/Iridescence.jsx';
import axios from 'axios';

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
            const response = await axios.post('http://localhost:5000/auth/login', {
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
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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

            {/* Curved Box */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Welcome Back</h2>
                    <p className="text-blue-200/80 text-sm">Sign in as <span className="text-cyan-400 font-semibold">{activeRole}</span></p>
                    <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                        <p className="text-xs text-blue-200/70 mb-1">Database Credentials:</p>
                        <p className="text-xs text-cyan-300">Admin: admin/admin</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Username Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaUser className="text-blue-300 Group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 text-white placeholder-blue-200/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-400/50 focus:bg-black/30 transition-all duration-300"
                            placeholder="Username"
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="text-blue-300 Group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 text-white placeholder-blue-200/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-400/50 focus:bg-black/30 transition-all duration-300"
                            placeholder="Password"
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="flex justify-center gap-4 mb-2">
                        {roles.map((role) => (
                            <button
                                type="button"
                                key={role}
                                onClick={() => setActiveRole(role)}
                                disabled={isLoading}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${activeRole === role
                                    ? 'bg-blue-600 border-transparent text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-white/5 border-white/10 text-blue-200/60 hover:bg-white/10 hover:text-white'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out flex items-center justify-center ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                        {isLoading ? (
                            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    {/* Footer Links */}
                    <div className="flex justify-between items-center text-sm mt-6 text-blue-200/60">
                        <a href="#" className="hover:text-white transition-colors">Forgot Password?</a>
                        <Link to="/enquiry" className="hover:text-white transition-colors">Need Help?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
