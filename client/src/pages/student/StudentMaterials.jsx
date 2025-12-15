import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';

const StudentMaterials = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('All');

    // Mock Data
    // Mock Data
    const materials = [];

    const courses = ['All', ...new Set(materials.map(m => m.course))];

    const filteredMaterials = materials.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse === 'All' || item.course === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'pdf': return <FaFilePdf className="text-red-500 text-3xl" />;
            case 'docx': return <FaFileWord className="text-blue-500 text-3xl" />;
            case 'pptx': return <FaFilePowerpoint className="text-orange-500 text-3xl" />;
            default: return <FaFilePdf className="text-gray-500 text-3xl" />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Study Materials</h1>
                <p className="text-slate-500 mt-1">Download notes, assignments, and reference materials.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <FaFilter className="text-slate-400" />
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-slate-50 border border-gray-200 text-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium"
                    >
                        {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between h-48">
                            <div className="flex items-start justify-between">
                                <div className="bg-slate-50 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                    {getIcon(item.type)}
                                </div>
                                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded uppercase">{item.type}</span>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                <p className="text-xs text-slate-500 font-medium">{item.course}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                                <span className="text-xs text-slate-400">{item.date} • {item.size}</span>
                                <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors">
                                    <FaDownload />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p>No study materials found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMaterials;
