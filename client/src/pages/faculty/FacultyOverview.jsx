import React from 'react';

const FacultyOverview = ({ facultyData, students }) => {
    // Helper to get comma separated course names
    const courseNames = Array.isArray(facultyData?.course)
        ? facultyData.course.map(c => c.name || c).join(', ')
        : (facultyData?.course?.name || facultyData?.course || 'N/A');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'My Courses', value: courseNames, color: 'green' },
                    { label: 'My Students', value: students.length, color: 'blue' },
                    { label: 'Department', value: facultyData?.dept?.name || facultyData?.dept || 'N/A', color: 'orange' },
                    { label: 'Designation', value: facultyData?.designation || 'N/A', color: 'indigo' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 truncate" title={String(stat.value)}>{stat.value}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacultyOverview;
