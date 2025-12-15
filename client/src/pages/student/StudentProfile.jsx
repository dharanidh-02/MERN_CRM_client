import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPen, FaSave } from 'react-icons/fa';

const StudentProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'John Doe',
        regNo: '2023CSBS001',
        dept: 'Computer Science & Business Systems',
        batch: '2023 - 2027',
        semester: 4,
        email: 'john.doe@college.edu',
        phone: '+91 98765 43210',
        address: '123, Student Hostel, College Campus, Coimbatore',
        dob: '2004-05-15',
        bloodGroup: 'O+'
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically send the data to the backend
        alert('Profile updated successfully! (Mock)');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    {isEditing ? <><FaSave /> Save Changes</> : <><FaPen /> Edit Details</>}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ID Card Style Info */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center sticky top-24">
                        <div className="w-32 h-32 mx-auto bg-slate-200 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg">
                            <img src="https://cdn-icons-png.flaticon.com/512/2995/2995620.png" alt="Profile" className="w-full h-full object-cover p-2" />
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
                                <p className="font-medium text-slate-700">{profile.dept}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch</label>
                                <p className="font-medium text-slate-700">{profile.batch}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                                <p className="font-medium text-slate-700">{profile.dob}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Blood Group</label>
                                <p className="font-medium text-slate-700">{profile.bloodGroup}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info (Editable) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">Contact Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><FaEnvelope /> Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-slate-700">{profile.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><FaPhone /> Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-slate-700">{profile.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><FaMapMarkerAlt /> Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-slate-700">{profile.address}</p>
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
