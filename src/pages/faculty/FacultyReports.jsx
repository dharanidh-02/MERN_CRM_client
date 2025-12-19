import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import * as API from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FacultyReports = ({ courses, facultyData, students }) => {
    const [reportData, setReportData] = useState([]);
    const [loadingReport, setLoadingReport] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');

    const handleGenerateReport = async () => {
        if (!selectedCourse) {
            alert("Please select a course first.");
            return;
        }
        setLoadingReport(true);
        try {
            // Find batches for the SELECTED course
            const courseObj = courses.find(c => c.name === selectedCourse);
            if (!courseObj) throw new Error("Course not found");

            // const targetBatches = courseObj.batches || [];

            // Find students in these batches (and dept)
            // Note: 'students' state is already filtered by logic in loadFacultyData, 
            // which includes ALL students from ALL courses the faculty teaches.
            // So we just need to filter by the selected course's batches here for the report

            // OR, just iterate all students and check if they have attendance for this course.
            // Let's iterate unique batches of students.

            const batchIds = students.map(s => s.batch).filter((v, i, a) => a.indexOf(v) === i);

            // Fetch attendance for these batches
            const allAttendance = [];
            for (const b of batchIds) {
                const bid = b._id || b;
                const res = await API.fetchAttendance(null, bid);
                allAttendance.push(...res.data);
            }

            // Calculate Stats per student
            const stats = students.map(student => {
                // Filter attendance by Student AND Course
                const studentAtt = allAttendance.filter(a => a.studentId === student.regNo && a.course === selectedCourse);
                const total = studentAtt.length;
                const present = studentAtt.filter(a => a.status === 'present').length;
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                return {
                    regNo: student.regNo,
                    name: student.name,
                    total,
                    present,
                    percentage
                };
            }).filter(s => s.total > 0 || s.percentage >= 0); // Keep all students even with 0 classes? Yes.

            setReportData(stats);
            generatePDF(stats);

        } catch (err) {
            console.error("Report Generation Error:", err);
            alert("Failed to generate report: " + (err.response?.data?.message || err.message));
        } finally {
            setLoadingReport(false);
        }
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("College CRM - Attendance Report", 14, 20);

        doc.setFontSize(12);
        doc.text(`Faculty: ${facultyData?.name}`, 14, 30);
        doc.text(`Course: ${selectedCourse}`, 14, 36);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);

        autoTable(doc, {
            startY: 50,
            head: [['Register No', 'Name', 'Total Classes', 'Present', 'Percentage']],
            body: data.map(row => [row.regNo, row.name, row.total, row.present, `${row.percentage}%`]),
            theme: 'grid',
        });

        doc.save(`${selectedCourse}_Attendance_Report.pdf`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Attendance Reports</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">

                <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white mb-4"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
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

                <p className="text-gray-500">Generate detailed attendance report.</p>
                <button
                    onClick={handleGenerateReport}
                    disabled={loadingReport || !selectedCourse}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingReport ? 'Generating...' : <><FaFilePdf /> Export PDF</>}
                </button>
            </div>
        </div>
    );
};

export default FacultyReports;
