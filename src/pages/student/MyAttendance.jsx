// Attendance Page
import React, { useState, useEffect } from 'react';
import * as API from '../../api';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [rawAttendance, setRawAttendance] = useState([]); // Store raw for Grid
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAttendanceData();
    }, []);

    const loadAttendanceData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            // Fetch student to get Batch ID
            const studentsRes = await API.fetchStudents();
            const currentStudent = studentsRes.data.find(s => s._id === userId);

            if (currentStudent) {
                const batchId = currentStudent.batch?._id || currentStudent.batch;

                // Fetch Attendance
                const attRes = await API.fetchAttendance(null, batchId);
                const myAttendance = attRes.data.filter(a => a.studentId === currentStudent.regNo);

                setRawAttendance(myAttendance); // Store raw data

                // Group by Course (Keep existing logic if needed, or remove if unused)
                // ... (Existing summary logic can stay if we want to show it, but user asked for Grid)
                // We'll keep it for now as "attendance" state if needed, or just rely on Grid.
            }
        } catch (error) {
            console.error("Error loading attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateGridData = () => {
        // Group rawAttendance by Date
        const grouped = {};

        rawAttendance.forEach(record => {
            const dateStr = new Date(record.date).toLocaleDateString('en-GB'); // DD/MM/YYYY
            if (!grouped[dateStr]) {
                const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' });
                grouped[dateStr] = {
                    date: dateStr,
                    day: dayName,
                    periods: ['N', 'N', 'N', 'N', 'N', 'N', 'N'] // Default N
                };
            }

            // Parse periods "1,2,3" -> [1, 2, 3]
            const periodNums = record.period.split(',').map(p => parseInt(p.trim()));
            const statusChar = record.status === 'present' ? 'P' : 'A';

            periodNums.forEach(p => {
                if (p >= 1 && p <= 7) {
                    grouped[dateStr].periods[p - 1] = statusChar;
                }
            });
        });

        // Convert to array and sort by Date Descending
        return Object.values(grouped).sort((a, b) => {
            // Parse DD/MM/YYYY to Date object for sorting
            const [d1, m1, y1] = a.date.split('/');
            const [d2, m2, y2] = b.date.split('/');
            return new Date(`${y2}-${m2}-${d2}`) - new Date(`${y1}-${m1}-${d1}`);
        });
    };



    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900">My Attendance</h2>

            {/* Semester/Batch Selector (Visual only as per request) */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <label className="font-semibold text-gray-700">Select Semester:</label>
                <select
                    className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => console.log("Sem selected:", e.target.value)}
                >
                    <option value="4">Sem: 4 (Current)</option>
                    <option value="3">Sem: 3</option>
                    <option value="2">Sem: 2</option>
                    <option value="1">Sem: 1</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance Grid Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                            <h3 className="text-blue-800 font-bold">Attendance Details for Sem: 4, Sem Period: Even Sem - 2025-2026</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-center border-collapse">
                                <thead className="bg-gray-100 text-gray-600 font-bold">
                                    <tr>
                                        <th className="p-3 border border-gray-200">#</th>
                                        <th className="p-3 border border-gray-200 text-left">Date</th>
                                        <th className="p-3 border border-gray-200 text-left">Week day</th>
                                        {[1, 2, 3, 4, 5, 6, 7].map(p => (
                                            <th key={p} className="p-3 border border-gray-200 w-10">{p}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {generateGridData().length > 0 ? generateGridData().map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-2 border border-gray-100">{idx + 1}</td>
                                            <td className="p-2 border border-gray-100 text-left font-medium">{row.date}</td>
                                            <td className="p-2 border border-gray-100 text-left text-gray-500">{row.day}</td>
                                            {row.periods.map((status, i) => (
                                                <td key={i} className="p-2 border border-gray-100 font-bold">
                                                    {status === 'P' && <span className="text-green-600">P</span>}
                                                    {status === 'A' && <span className="text-red-500">A</span>}
                                                    {status === 'N' && <span className="text-blue-400">N</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="10" className="p-8 text-gray-400">No attendance records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Absentia History (Right Side) */}
                    <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden h-fit">
                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                            <h3 className="text-blue-800 font-bold">My Absentia History</h3>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold">
                                    <tr>
                                        <th className="p-2 border">Date</th>
                                        <th className="p-2 border">Day</th>
                                        <th className="p-2 border">Hours</th>
                                        <th className="p-2 border">Term</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateGridData().filter(r => r.periods.includes('A')).map((r, i) => (
                                        <tr key={i} className="hover:bg-red-50">
                                            <td className="p-2 border text-red-600 font-medium">{r.date}</td>
                                            <td className="p-2 border">{r.day}</td>
                                            <td className="p-2 border text-center">
                                                {r.periods.map((s, idx) => s === 'A' ? (idx + 1) : null).filter(Boolean).join(', ')}
                                            </td>
                                            <td className="p-2 border text-red-500 font-bold">Absent</td>
                                        </tr>
                                    ))}
                                    {generateGridData().filter(r => r.periods.includes('A')).length === 0 && (
                                        <tr><td colSpan="4" className="p-4 text-center text-gray-400">No absents recorded.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAttendance;
