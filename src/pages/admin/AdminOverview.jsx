import React from 'react';

const AdminOverview = ({ students, faculty, courses, departments }) => {
    return (
        <>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome Admin, here's the current status.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Students', value: students.length, change: 'Live', border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Faculty', value: faculty.length, change: 'Live', border: 'border-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Courses', value: courses.length, change: 'Live', border: 'border-teal-500', text: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'Departments', value: departments.length, change: 'Live', border: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, index) => (
                    <div key={index} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${stat.border} hover:shadow-md transition-shadow`}>
                        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.text}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AdminOverview;
