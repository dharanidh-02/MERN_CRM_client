import React, { useState } from 'react';
import { FaSearch, FaCheck } from 'react-icons/fa';
import * as API from '../../api';

const Input = ({ label, name, type = "text", value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const FacultyAttendance = ({ courses, facultyData, students }) => {
    const [attendanceForm, setAttendanceForm] = useState({
        date: new Date().toISOString().split('T')[0],
        period: [],
        course: '' // Added course to state
    });
    const [isAttendanceTableVisible, setIsAttendanceTableVisible] = useState(false);
    const [attendanceEntries, setAttendanceEntries] = useState({});

    const handleSearchStudents = () => {
        if (attendanceForm.date && attendanceForm.period.length > 0 && attendanceForm.course) {
            setIsAttendanceTableVisible(true);
        } else {
            alert("Please select Course, Date, and at least one Period.");
        }
    };

    // Calculate batches for the SELECTED course
    const selectedCourseObj = courses.find(c => c.name === attendanceForm.course);
    const targetBatches = selectedCourseObj ? (selectedCourseObj.batches || []) : [];

    const filteredStudents = isAttendanceTableVisible
        ? students.filter(s => {
            // Robust ID Comparison Helper
            const areIdsEqual = (id1, id2) => {
                if (!id1 || !id2) return false;
                const str1 = (id1._id || id1).toString();
                const str2 = (id2._id || id2).toString();
                return str1 === str2;
            };

            const facDept = facultyData?.dept;
            const sDept = s.dept;

            // Robust Batch Comparison
            const sBatch = s.batch;

            // Match Dept AND (Batch ID match OR Batch Name match)
            // targetBatches from course might be objects or IDs
            return areIdsEqual(sDept, facDept) && targetBatches.some(b => {
                // Check ID equality
                if (areIdsEqual(b, sBatch)) return true;

                // If not ID match, try Name match (legacy support)
                const bName = b.name || b;
                const sBatchName = sBatch?.name || sBatch;
                return bName === sBatchName;
            });
        })
        : [];

    const handleAttendanceChange = (regNo, status) => {
        setAttendanceEntries(prev => ({ ...prev, [regNo]: status }));
    };

    const markAll = (status) => {
        const newEntries = { ...attendanceEntries };
        filteredStudents.forEach(s => {
            newEntries[s.regNo] = status;
        });
        setAttendanceEntries(newEntries);
    };

    const saveAttendance = async () => {
        try {
            const entries = Object.entries(attendanceEntries).map(([regNo, status]) => {
                const student = students.find(s => s.regNo === regNo);
                // Determine Batch ID/Name safely
                // Student batch might be populated or just ID
                const batchId = student?.batch?._id || student?.batch;

                return {
                    date: attendanceForm.date,
                    batch: batchId, // Saving ID
                    period: attendanceForm.period.join(','),
                    studentId: regNo,
                    status: status,
                    course: attendanceForm.course, // Use selected course name
                    facultyId: facultyData?.id
                };
            });


            if (entries.length === 0) return;

            await API.saveAttendance({ entries });
            alert('Attendance Saved Successfully!');
            setAttendanceEntries({});
            setIsAttendanceTableVisible(false);
        } catch (err) {
            console.error(err);
            alert('Failed to save attendance');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course Selector for Attendance */}
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <label className="text-sm font-medium text-gray-700">Course</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                            onChange={(e) => {
                                const selectedName = e.target.value;
                                setAttendanceForm(prev => ({ ...prev, course: selectedName }));
                                setIsAttendanceTableVisible(false); // Reset table on course change
                            }}
                            value={attendanceForm.course || ''}
                        >
                            <option value="">Select Course</option>
                            {Array.isArray(facultyData?.course) ? (
                                facultyData.course.map((c, i) => (
                                    <option key={i} value={c.name || c}>{c.name || c}</option>
                                ))
                            ) : (
                                <option value={facultyData?.course?.name || facultyData?.course}>
                                    {facultyData?.course?.name || facultyData?.course}
                                </option>
                            )}
                        </select>

                        {/* Recalculate batches based on selected course */}
                        {targetBatches.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                                Batches: {targetBatches.map(b => b.name || b).join(', ')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={attendanceForm.date}
                            onChange={(n, v) => setAttendanceForm(prev => ({ ...prev, [n]: v }))}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Periods</label>
                            {/* ... periods ... */}
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => {
                                            setAttendanceForm(prev => {
                                                const currentPeriods = prev.period || [];
                                                const newPeriods = currentPeriods.includes(p.toString())
                                                    ? currentPeriods.filter(pr => pr !== p.toString())
                                                    : [...currentPeriods, p.toString()];
                                                return { ...prev, period: newPeriods.sort() };
                                            });
                                        }}
                                        className={`w-10 h-10 rounded-lg font-bold border transition-all ${(attendanceForm.period || []).includes(p.toString())
                                            ? 'bg-green-600 text-white border-green-600 ring-2 ring-green-200'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSearchStudents}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium shadow-sm transition-colors"
                    >
                        <FaSearch /> Search Students
                    </button>
                </div>
            </div>

            {isAttendanceTableVisible && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
                        <div className="flex gap-2">
                            <button onClick={() => markAll('present')} className="text-xs text-green-600 hover:text-green-700 font-medium">Mark All Present</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => markAll('absent')} className="text-xs text-red-600 hover:text-red-700 font-medium">Mark All Absent</button>
                        </div>
                    </div>

                    {filteredStudents.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Register No</th>
                                    <th className="px-6 py-3">Student Name</th>
                                    <th className="px-6 py-3 text-center">Present</th>
                                    <th className="px-6 py-3 text-center">Absent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map(student => (
                                    <tr key={student.regNo} className="hover:bg-gray-50 transition-colors duration-150 group">
                                        <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-green-600 transition-colors">{student.regNo}</td>
                                        <td className="px-6 py-4 font-medium">{student.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleAttendanceChange(student.regNo, 'present')}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm mx-auto ${attendanceEntries[student.regNo] === 'present'
                                                    ? 'bg-green-500 text-white scale-110 shadow-green-200'
                                                    : 'bg-white border-2 border-green-100 text-green-400 hover:border-green-400 hover:bg-green-50'
                                                    }`}
                                            >
                                                <FaCheck size={14} className={attendanceEntries[student.regNo] === 'present' ? 'opacity-100' : 'opacity-0 hover:opacity-50'} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleAttendanceChange(student.regNo, 'absent')}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm mx-auto ${attendanceEntries[student.regNo] === 'absent'
                                                    ? 'bg-red-500 text-white scale-110 shadow-red-200'
                                                    : 'bg-white border-2 border-red-100 text-red-400 hover:border-red-400 hover:bg-red-50'
                                                    }`}
                                            >
                                                <span className={`font-bold text-sm ${attendanceEntries[student.regNo] === 'absent' ? 'opacity-100' : 'opacity-0 hover:opacity-50'}`}>A</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            No students found for this Department/Course.
                        </div>
                    )}

                    {filteredStudents.length > 0 && (
                        <div className="p-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={saveAttendance}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                            >
                                <FaCheck /> Confirm & Save
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyAttendance;
