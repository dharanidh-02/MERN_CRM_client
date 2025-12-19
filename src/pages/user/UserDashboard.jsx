import React, { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaDashcube, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user data from localStorage
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!userId) {
            // Redirect to login if no user data
            navigate('/login');
            return;
        }

        setUser({ userId, username, role });
    }, [navigate]);

    const handleLogout = () => {
        // Clear localStorage and redirect to login
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Header */}
            <header className="bg-[#0f172a] border-b border-white/10 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FaDashcube className="text-blue-400 text-2xl" />
                        <h1 className="text-2xl font-bold">User Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FaUser className="text-blue-400" />
                            <span className="text-sm">
                                {user.username} ({user.role})
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h2>
                    <p className="text-gray-400">Here's your dashboard overview</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                <FaUser className="text-blue-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Profile</h3>
                                <p className="text-gray-400 text-sm">Manage your account</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <FaChartLine className="text-green-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Activity</h3>
                                <p className="text-gray-400 text-sm">View your progress</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <FaDashcube className="text-purple-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Dashboard</h3>
                                <p className="text-gray-400 text-sm">System overview</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">User Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400">User ID</label>
                            <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1">
                                {user.userId}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Username</label>
                            <p className="text-white p-2 mt-1">{user.username}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Role</label>
                            <p className="text-white p-2 mt-1 capitalize">{user.role}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Status</label>
                            <p className="text-green-400 p-2 mt-1">Active</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;