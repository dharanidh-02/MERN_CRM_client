import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPen, FaSave, FaExclamationCircle } from 'react-icons/fa';
import * as API from '../../api';

const StudentProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        regNo: '',
        dept: '',
        batch: '',
        semester: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        bloodGroup: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                // Determine which API to call. If fetchStudent(id) exists, use it.
                // Otherwise fetch all and find. 
                // Since I added fetchStudent(id) to api/index.js, I can use it.
                const response = await API.fetchStudent(userId);
                const data = response.data;

                setProfile({
                    name: data.name || '',
                    regNo: data.regNo || '',
                    dept: data.dept?.name || data.dept || '',
                    batch: data.batch?.name || data.batch || '',
                    semester: data.semester || '4',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    dob: data.dob || '',
                    bloodGroup: data.bloodGroup || ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsEditing(false);
        const userId = localStorage.getItem('userId');
        try {
            await API.updateStudent(userId, {
                email: profile.email,
                phone: profile.phone,
                address: profile.address
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-medium animate-pulse">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-red-500 animate-fade-in-up">
                <FaExclamationCircle className="text-4xl mb-2" />
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm ${isEditing ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                >
                    {isEditing ? <><FaSave /> Save Changes</> : <><FaPen /> Edit Details</>}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ID Card Style Info */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center sticky top-24">
                        <div className="w-32 h-32 mx-auto bg-slate-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                            <FaUser className="text-5xl text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                        <p className="text-slate-500 font-mono text-sm mt-1">{profile.regNo}</p>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{profile.dept}</span>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">Sem {profile.semester}</span>
                        </div>
                    </div>
                </div>

                {/* Details Form/View */}
                <div className="md:col-span-2 space-y-6">
                    {/* Academic Info (Read Only) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Academic Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Department</label>
                                <p className="font-medium text-slate-700">{profile.dept || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch</label>
                                <p className="font-medium text-slate-700">{profile.batch || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                                <p className="font-medium text-slate-700">{profile.dob || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Blood Group</label>
                                <p className="font-medium text-slate-700">{profile.bloodGroup || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info (Editable) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Contact Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase mb-1"><FaEnvelope /> Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-slate-700">{profile.email || 'N/A'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase mb-1"><FaPhone /> Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-slate-700">{profile.phone || 'N/A'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase mb-1"><FaMapMarkerAlt /> Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-slate-700">{profile.address || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
