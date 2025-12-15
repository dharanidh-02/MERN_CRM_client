import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaClipboardList, FaLock } from 'react-icons/fa';
import * as API from '../../api/index';

const MyMarks = () => {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMarksData();
    }, []);

    const loadMarksData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            // We need student's RegNo. Fetch student details first.
            const studentsRes = await API.fetchStudents();
            const currentStudent = studentsRes.data.find(s => s._id === userId);

            if (currentStudent) {
                // Fetch ALL Exams to get metadata (publishGrades)
                const examsRes = await API.fetchExams();
                const examsMetadata = examsRes.data; // Array of exam objects
                const examMap = {};
                examsMetadata.forEach(e => { examMap[e.name] = e; });

                const marksRes = await API.fetchMarks(currentStudent.regNo);
                const allMarks = marksRes.data;

                // Group by Exam Name
                const grouped = {};
                allMarks.forEach(record => {
                    const examName = record.exam;
                    const meta = examMap[examName] || {};

                    if (!grouped[examName]) {
                        grouped[examName] = {
                            id: examName, // Use name as ID for now
                            name: examName,
                            publishGrades: meta.publishGrades === true, // Default false if not found
                            subjects: []
                        };
                    }
                    grouped[examName].subjects.push({
                        code: record.course, // Or course code if available? record.course is likely Name.
                        name: record.course,
                        max: record.total,
                        scored: record.marks,
                        grade: record.grade || calculateGrade(record.marks, record.total)
                    });
                });

                const examList = Object.values(grouped);
                setExams(examList);
                if (examList.length > 0) {
                    setSelectedExamId(examList[0].id);
                }
            }
        } catch (error) {
            console.error("Error loading marks:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateGrade = (scored, total) => {
        const pct = (scored / total) * 100;
        if (pct >= 90) return 'O';
        if (pct >= 80) return 'A+';
        if (pct >= 70) return 'A';
        if (pct >= 60) return 'B+';
        if (pct >= 50) return 'B';
        return 'U';
    };

    const currentExam = exams.find(e => e.id === selectedExamId) || (exams.length > 0 ? exams[0] : null);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading marks...</div>;
    if (!currentExam) return <div className="p-8 text-center text-gray-500">No marks available yet.</div>;

    const currentMarks = currentExam.subjects;
    const average = (currentMarks.reduce((acc, curr) => acc + (curr.scored / curr.max) * 100, 0) / currentMarks.length).toFixed(1);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Marks</h1>
                    <p className="text-slate-500 mt-1">View your performance across different examinations.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-sm font-semibold text-slate-600 pl-2">Select Exam:</span>
                    <select
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="bg-slate-50 border border-gray-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                    >
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Performance Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-blue-100 font-medium mb-1">Overall Percentage</p>
                    <h2 className="text-4xl font-bold">{average}%</h2>
                    <p className="text-sm text-blue-200 mt-2">
                        {average >= 90 ? 'Outstanding Performance! 🌟' : average >= 75 ? 'Great job! Keep it up. 👍' : 'Needs Improvement. 📈'}
                    </p>
                </div>
                <div className="relative z-10 text-right hidden sm:block">
                    <FaTrophy size={64} className="text-white opacity-20" />
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
            </div>

            {!currentExam.publishGrades && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaLock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Grades for this exam have not been published by the administration yet. Only scores are visible.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Marks List */}
            <div className="grid grid-cols-1 gap-4">
                {currentMarks.map((subject, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow">
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                            {currentExam.publishGrades ? (
                                <div className="text-center">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Grade</p>
                                    <p className="text-xl font-bold text-blue-600">{subject.grade}</p>
                                </div>
                            ) : (
                                <div className="text-center opacity-50">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Grade</p>
                                    <p className="text-xl font-bold text-slate-400">-</p>
                                </div>
                            )}

                            <div className="text-right min-w-[100px]">
                                <p className="text-xs text-slate-400 uppercase font-bold">Score</p>
                                <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-3xl font-bold text-slate-900">{subject.scored}</span>
                                    <span className="text-sm text-slate-500 font-medium">/ {subject.max}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyMarks;
