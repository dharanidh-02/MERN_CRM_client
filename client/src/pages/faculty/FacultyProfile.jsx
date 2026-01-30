import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const FacultyProfile = ({ facultyData }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Faculty Profile</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <FaUserCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{facultyData?.name}</h3>
                <p className="text-gray-500">{facultyData?.dept?.name || facultyData?.dept} Department</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-1">Employee ID</p>
                    <p className="font-medium">{facultyData?.id}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-1">Handling Course</p>
                    <p className="font-medium">
                        {Array.isArray(facultyData?.course)
                            ? facultyData.course.map(c => c.name || c).join(', ')
                            : (facultyData?.course?.name || facultyData?.course)}
                    </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-1">Department</p>
                    <p className="font-medium">{facultyData?.dept?.name || facultyData?.dept}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-1">Designation</p>
                    <p className="font-medium">{facultyData?.designation}</p>
                </div>
            </div>
        </div>
    </div>
);

export default FacultyProfile;
