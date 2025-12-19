import React, { useState } from 'react';
import * as API from '../../api';

const FacultyMarks = ({ exams, courses, facultyData, students }) => {
    const [marks, setMarks] = useState({});
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isMarksTableVisible, setIsMarksTableVisible] = useState(false);

    // If selectedCourse is set, filter exams for that course. Otherwise show all (or empty).
    const displayExams = selectedCourse
        ? exams.filter(e => e.course === selectedCourse)
        : [];

    const handleSearchMarks = () => {
        if (!selectedExam || !selectedCourse) {
            alert('Please select Course and Exam');
            return;
        }
        setIsMarksTableVisible(true);
    };

    const updateMarks = (studentId, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSaveMarks = async () => {
        try {
            const payload = Object.entries(marks).map(([sId, score]) => ({
                exam: selectedExam,
                course: selectedCourse,
                studentId: sId,
                marks: Number(score),
                total: 100
            }));

            if (payload.length === 0) {
                alert("No marks entered to save.");
                return;
            }

            await API.saveMarks({ marksData: payload });
            alert('Marks saved successfully!');
            setMarks({});
            setIsMarksTableVisible(false);
        } catch (err) {
            console.error("Error saving marks:", err);
            alert("Failed to save marks: " + (err.response?.data?.message || err.message));
        }
    };

    // Filter students: Same Dept AND Batch belonging to selectedCourse
    const marksStudents = students.filter(s => {
        const sBatchName = s.batch?.name || s.batch;
        const courseObj = courses.find(c => c.name === selectedCourse);
        const targetBatches = courseObj ? (courseObj.batches || []) : [];

        return targetBatches.includes(sBatchName);
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Marks Entry</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => {
                                setSelectedExam(e.target.value);
                                setIsMarksTableVisible(false); // Reset table on change
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                        >
                            <option value="">-- Select Exam --</option>
                            {displayExams.map(ex => (
                                <option key={ex._id} value={ex.name}>{ex.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setIsMarksTableVisible(false);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                        >
                            <option value="">-- Select Course --</option>
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
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSearchMarks}
                        disabled={!selectedExam || !selectedCourse}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Show Student List
                    </button>
                </div>
            </div>

            {isMarksTableVisible && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <h3 className="text-lg font-semibold mb-4">Enter Marks for {selectedCourse} - {selectedExam}</h3>

                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {marksStudents.map(student => (
                                    <tr key={student.regNo} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.regNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={marks[student.regNo] || ''}
                                                onChange={(e) => updateMarks(student.regNo, e.target.value)}
                                                className="w-24 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={handleSaveMarks}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                    >
                        Save Marks
                    </button>
                </div>
            )}
        </div>
    );
};

export default FacultyMarks;
