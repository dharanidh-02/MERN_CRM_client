import React, { useState } from 'react';
import { FaCheck, FaArrowLeft, FaSearch } from 'react-icons/fa';
import DataTable from '../../components/admin/DataTable';
import * as API from '../../api';

// Simple Input component for local use if not imported
const Input = ({ label, name, type = "text", value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
        />
    </div>
);

const AdminAttendance = ({
    faculty,
    students,
    courses,
    departments,
    showToast,
    onAttendanceSave // Callback to refresh data if needed
}) => {
    const [attendanceStep, setAttendanceStep] = useState('list'); // 'list' | 'mark'
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [attendanceForm, setAttendanceForm] = useState({ dept: '', course: '', batch: '', date: new Date().toISOString().split('T')[0], period: [] });
    const [attendanceEntries, setAttendanceEntries] = useState({});
    const [isAttendanceTableVisible, setIsAttendanceTableVisible] = useState(false);

    const handleSelectFacultyForAttendance = (fac) => {
        setSelectedFaculty(fac);
        setAttendanceStep('mark');
        setIsAttendanceTableVisible(false);
        // Pre-fill form
        let facCourseName = '';
        if (Array.isArray(fac.course)) {
            if (fac.course.length > 0) facCourseName = fac.course[0].name || fac.course[0];
        } else {
            facCourseName = fac.course?.name || fac.course || '';
        }

        setAttendanceForm({
            dept: fac.dept?.name || fac.dept || '',
            course: facCourseName,
            batch: '',
            date: new Date().toISOString().split('T')[0],
            period: []
        });
        setAttendanceEntries({});
    };

    const handleSearchStudents = () => {
        if (attendanceForm.date && attendanceForm.period.length > 0 && attendanceForm.dept && attendanceForm.course) {
            setIsAttendanceTableVisible(true);
        } else {
            showToast("Please select Dept, Course, Date, and Period", "warning");
        }
    };

    const handleAttendanceChange = (regNo, status) => {
        setAttendanceEntries(prev => ({ ...prev, [regNo]: status }));
    };

    const markAll = (status) => {
        const selectedCourseObj = courses.find(c => c.name === attendanceForm.course);
        const targetBatches = selectedCourseObj ? (selectedCourseObj.batches || []) : [];
        const currentViewStudents = students.filter(s => {
            const sBatchName = s.batch?.name || s.batch;
            const sDeptName = s.dept?.name || s.dept;
            return targetBatches.includes(sBatchName) && sDeptName === attendanceForm.dept;
        });

        const newEntries = { ...attendanceEntries };
        currentViewStudents.forEach(s => {
            newEntries[s.regNo] = status;
        });
        setAttendanceEntries(newEntries);
    };

    const saveAttendance = async () => {
        try {
            const entries = Object.entries(attendanceEntries).map(([regNo, status]) => {
                const student = students.find(s => s.regNo === regNo);
                return {
                    date: attendanceForm.date,
                    batch: student ? student.batch : 'Unknown',
                    period: attendanceForm.period.join(','),
                    studentId: regNo,
                    status: status,
                    course: attendanceForm.course,
                    facultyId: selectedFaculty ? selectedFaculty._id : 'ADMIN',
                };
            });

            if (entries.length === 0) return;

            await API.saveAttendance({ entries });
            showToast(`Attendance Saved!`, 'success');
            setAttendanceEntries({});
            setIsAttendanceTableVisible(false);
            if (onAttendanceSave) onAttendanceSave();
        } catch (err) {
            console.error(err);
            showToast("Failed to save attendance", 'error');
        }
    };

    // Derived State for Filter Logic
    const availableCourses = attendanceForm.dept
        ? courses.filter(c => {
            if (selectedFaculty && selectedFaculty.course) {
                if (Array.isArray(selectedFaculty.course)) {
                    return selectedFaculty.course.some(fc => (fc.name === c.name) || (fc === c.name) || (fc._id === c._id));
                } else {
                    const facCourseName = selectedFaculty.course.name || selectedFaculty.course;
                    return c.name === facCourseName;
                }
            }
            return Array.isArray(c.dept) ? c.dept.includes(attendanceForm.dept) : c.dept === attendanceForm.dept;
        })
        : [];

    const selectedCourseObj = courses.find(c => c.name === attendanceForm.course);
    const targetBatches = selectedCourseObj ? (selectedCourseObj.batches || []) : [];

    const filteredStudents = (attendanceForm.course && isAttendanceTableVisible)
        ? students.filter(s => {
            // Robust Dept Match: Form uses Name, Student might be Object or ID
            let sDeptName = s.dept?.name;
            if (!sDeptName && s.dept) {
                // If s.dept is ID, find the name from departments list
                const dObj = departments.find(d => d._id === s.dept);
                sDeptName = dObj ? dObj.name : s.dept;
            }
            const deptMatch = sDeptName === attendanceForm.dept;

            // Robust Batch Match: Compare IDs
            const sBatchId = s.batch?._id || s.batch;

            // targetBatches comes from selectedCourseObj.batches (Objects or IDs)
            const batchMatch = targetBatches.some(b => {
                const bId = b._id || b;
                return String(bId) === String(sBatchId);
            });

            return deptMatch && batchMatch;
        })
        : [];

    if (attendanceStep === 'list') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
                </div>
                <p className="text-gray-500">Select a faculty member to mark attendance for their class.</p>
                <DataTable
                    columns={[
                        { header: 'Faculty Name', accessor: 'name' },
                        {
                            header: 'Handling Course', accessor: (row) => {
                                if (Array.isArray(row.course)) return row.course.map(c => c?.name || c).join(', ');
                                return row.course?.name || (typeof row.course === 'object' ? 'N/A' : row.course) || '-';
                            }
                        },
                        { header: 'Department', accessor: (row) => row.dept?.name || (typeof row.dept === 'object' ? 'N/A' : row.dept) || '-' },
                    ]}
                    data={faculty}
                    onDelete={null}
                    onEdit={(item) => handleSelectFacultyForAttendance(item)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => setAttendanceStep('list')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                    <FaArrowLeft />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
                    <p className="text-sm text-gray-500">Marking for: <span className="font-semibold text-blue-600">{selectedFaculty?.name}</span></p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={attendanceForm.dept}
                            onChange={(e) => {
                                setAttendanceForm(prev => ({ ...prev, dept: e.target.value, course: '' }));
                                setIsAttendanceTableVisible(false);
                            }}
                        >
                            <option value="">-- Select Department --</option>
                            {departments.map(d => (
                                <option key={d._id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={attendanceForm.course}
                            onChange={(e) => {
                                setAttendanceForm(prev => ({ ...prev, course: e.target.value }));
                                setIsAttendanceTableVisible(false);
                            }}
                            disabled={!attendanceForm.dept}
                        >
                            <option value="">-- Select Course --</option>
                            {availableCourses.map(c => (
                                <option key={c._id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                        {targetBatches.length > 0 && (
                            <p className="text-xs text-blue-600 mt-1">Includes Batches: {targetBatches.map(b => b.name || b).join(', ')}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={attendanceForm.date}
                            onChange={(n, v) => setAttendanceForm(prev => ({ ...prev, [n]: v }))}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Periods</label>
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
                                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSearchStudents}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!attendanceForm.dept || !attendanceForm.course || !attendanceForm.date}
                    >
                        Search Students
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
                                        <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{student.regNo}</td>
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
                            No students found in this course/department.
                        </div>
                    )}

                    {filteredStudents.length > 0 && (
                        <div className="p-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={saveAttendance}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
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

export default AdminAttendance;
