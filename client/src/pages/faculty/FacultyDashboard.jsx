import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBell, FaSignOutAlt, FaUsers, FaClipboardList, FaChartBar, FaEdit, FaBook, FaCloudUploadAlt, FaCheck, FaInfoCircle, FaSearch, FaTimes, FaFilePdf, FaFileWord, FaFilePowerpoint, FaTrash, FaFilter, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as API from '../../api/index';
// PDF Export Imports
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ... Input Component ...
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

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [facultyData, setFacultyData] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);

  // Updated Materials State with Lesson/SubTopic
  // Updated Materials State with Lesson/SubTopic
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const facultyRes = await API.fetchFaculty();
      const currentFaculty = facultyRes.data.find(f => f._id === userId);

      if (currentFaculty) {
        setFacultyData(currentFaculty);

        // Faculty courses (Handle Array or Single Object for backward compatibility)
        const facultyCourses = Array.isArray(currentFaculty.course)
          ? currentFaculty.course
          : (currentFaculty.course ? [currentFaculty.course] : []);

        const facultyDeptId = currentFaculty.dept?._id || currentFaculty.dept;

        // Load all data
        const [studentsRes, coursesRes, examsRes] = await Promise.all([
          API.fetchStudents(),
          API.fetchCourses(),
          API.fetchExams()
        ]);

        // Get Batches for ALL assigned courses
        // Create a Set of valid batches derived from the assigned courses
        const validBatches = new Set();
        facultyCourses.forEach(facCourse => {
          // Find the full course object in the fetched courses list to get its batches
          // facCourse might be an ID string or populated object
          const courseId = facCourse._id || facCourse;
          const courseName = facCourse.name || facCourse;

          const fullCourse = coursesRes.data.find(c => c._id === courseId || c.name === courseName);
          if (fullCourse && fullCourse.batches) {
            fullCourse.batches.forEach(b => validBatches.add(b));
          }
        });

        // Filter students belonging to this faculty's department AND one of the valid batches
        const facultyStudents = studentsRes.data.filter(s => {
          const sDeptId = s.dept?._id || s.dept;
          const sBatchName = s.batch?.name || s.batch;

          const deptMatch = (sDeptId === facultyDeptId);
          // Check if student's batch is in our set of valid batches
          // NOTE: 'validBatches' contains Strings (Batch Names). Ensure sBatchName is the Name.
          const batchMatch = validBatches.has(sBatchName);

          return deptMatch && batchMatch;
        });

        console.log("Faculty Debug - Filtered Students:", facultyStudents.length);
        setStudents(facultyStudents);
        setCourses(coursesRes.data);
        setExams(examsRes.data);
      }
    } catch (error) {
      console.error('Error loading faculty data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'attendance', label: 'Mark Attendance', icon: FaUsers },
    { id: 'materials', label: 'Study Materials', icon: FaBook },
    { id: 'reports', label: 'Attendance Reports', icon: FaClipboardList },
    { id: 'marks', label: 'Marks Entry', icon: FaEdit },
    { id: 'profile', label: 'Profile', icon: FaUserCircle },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'attendance': return <AttendanceSection />;
      case 'materials': return <UploadMaterialsSection />;
      case 'reports': return <ReportsSection />;
      case 'marks': return <MarksSection />;
      case 'profile': return <ProfileSection />;
      default: return <OverviewSection />;
    }
  };

  const OverviewSection = () => {
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

  // --- UPDATED: Modal-based Material Upload ---
  const UploadMaterialsSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
      lesson: '',
      subTopic: '',
      course: facultyData?.course?.name || facultyData?.course || '',
      file: null
    });

    // Update default course if faculty data loads late
    useEffect(() => {
      const courseName = facultyData?.course?.name || facultyData?.course;
      if (courseName && !uploadForm.course) {
        setUploadForm(prev => ({ ...prev, course: courseName }));
      }
    }, [facultyData]);

    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        setUploadForm({ ...uploadForm, file: e.target.files[0] });
      }
    };

    const handleUpload = (e) => {
      e.preventDefault();
      if (!uploadForm.lesson || !uploadForm.subTopic || !uploadForm.course || !uploadForm.file) return;

      const newDoc = {
        id: Date.now(),
        lesson: uploadForm.lesson,
        subTopic: uploadForm.subTopic,
        course: uploadForm.course,
        type: uploadForm.file.name.split('.').pop() || 'file',
        size: (uploadForm.file.size / 1024 / 1024).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0]
      };

      setMaterials([newDoc, ...materials]);
      setUploadForm({ ...uploadForm, lesson: '', subTopic: '', file: null }); // Keep course
      setIsModalOpen(false);
      alert("Material Uploaded Successfully!");
    };

    const deleteMaterial = (id) => {
      if (window.confirm('Are you sure you want to remove this material?')) {
        setMaterials(materials.filter(m => m.id !== id));
      }
    }

    const getIcon = (type) => {
      if (type.includes('pdf')) return <FaFilePdf className="text-red-500 text-3xl" />;
      if (type.includes('doc')) return <FaFileWord className="text-blue-500 text-3xl" />;
      if (type.includes('ppt')) return <FaFilePowerpoint className="text-orange-500 text-3xl" />;
      return <FaFilePdf className="text-gray-500 text-3xl" />;
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            <FaCloudUploadAlt /> Upload Material
          </button>
        </div>

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Upload New Material</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleUpload} className="space-y-4">
                  <Input
                    label="Lesson Name / Unit"
                    name="lesson"
                    placeholder="e.g., Unit 1"
                    value={uploadForm.lesson}
                    onChange={(n, v) => setUploadForm({ ...uploadForm, lesson: v })}
                  />
                  <Input
                    label="Sub-topic Name"
                    name="subTopic"
                    placeholder="e.g., Intro to Algorithms"
                    value={uploadForm.subTopic}
                    onChange={(n, v) => setUploadForm({ ...uploadForm, subTopic: v })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                      value={uploadForm.course}
                      onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">Select Course</option>
                      {Array.isArray(facultyData?.course) ? (
                        facultyData.course.map((c, i) => {
                          const cName = c.name || c;
                          return <option key={i} value={cName}>{cName}</option>;
                        })
                      ) : (
                        <option value={facultyData?.course?.name || facultyData?.course}>
                          {facultyData?.course?.name || facultyData?.course}
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer bg-white border border-dashed border-gray-300 text-gray-500 rounded-lg px-4 py-8 hover:bg-gray-50 flex flex-col items-center gap-2 justify-center">
                        <FaCloudUploadAlt size={24} className="text-gray-400" />
                        <span className="text-sm">{uploadForm.file ? uploadForm.file.name : 'Click to Browse File'}</span>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!uploadForm.lesson || !uploadForm.subTopic || !uploadForm.file}
                      className="bg-green-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Materials Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Materials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between h-48">
                <div className="flex items-start justify-between">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {getIcon(item.type)}
                  </div>
                  <button
                    onClick={() => deleteMaterial(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Material"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.subTopic}</h4>
                  <p className="text-sm font-medium text-blue-600">{item.lesson}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.course}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <span>{item.date}</span>
                  <span>{item.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AttendanceSection = () => {
    // ... Copied ...
    const [attendanceForm, setAttendanceForm] = useState({
      date: new Date().toISOString().split('T')[0],
      period: [],
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
        const facDeptId = facultyData?.dept?._id || facultyData?.dept;
        const sDeptId = s.dept?._id || s.dept;
        const sBatchName = s.batch?.name || s.batch;

        // Match Dept AND Batch belonging to the selected course
        return sDeptId === facDeptId && targetBatches.some(b => b === sBatchName || b._id === s.batch || b === s.batch);
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
          const batchId = student?.batch?._id || student?.batch;
          // If we want to save Name for readability in DB, use student.batch.name. 
          // But for linking, ID is better. Let's use ID as string.
          // However, existing data might use names.
          // Let's stick to what the STUDENT DASHBOARD uses to filter.
          // The student dashboard has `currentStudent.batch` (ObjectId).
          // So saving ID is best.

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
                <p className="text-xs text-gray-400 mt-1">Batches: {targetBatches.join(', ')}</p>
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



  const ReportsSection = () => {
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

        const targetBatches = courseObj.batches || [];

        // Find students in these batches (and dept)
        // We can reuse logic or just filter existing students list
        // Note: 'students' state is already filtered by logic in loadFacultyData, 
        // which includes ALL students from ALL courses the faculty teaches.
        // So we just need to filter by the selected course's batches here for the report
        // OR, just iterate all students and check if they have attendance for this course.
        // Actually, fetching attendance for ALL dates for ALL students might be heavy?
        // But let's stick to current logic: iterate unique batches of students.

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

  const MarksSection = () => {
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

  const ProfileSection = () => (
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center gap-8">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-200">
                F
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Faculty <span className="text-green-600">Portal</span>
              </span>
            </div>

            {/* Navigation Buttons */}
            <nav className="hidden lg:flex gap-1 items-center bg-gray-50/50 p-1.5 rounded-xl border border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${activeSection === item.id
                    ? 'bg-white text-green-700 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-green-600 hover:bg-white/50'
                    }`}
                >
                  <item.icon size={16} className={activeSection === item.id ? 'text-green-600' : 'text-gray-400'} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveSection('profile')}
                className="hidden md:flex items-center gap-3 pr-6 border-r border-gray-200 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-green-600 transition-colors">{facultyData?.name || 'Faculty'}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{facultyData?.dept?.name || facultyData?.dept || 'Dept'}</p>
                </div>
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 group-hover:border-green-200 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                  <FaUserCircle size={20} />
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Logout"
              >
                <FaSignOutAlt size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {renderContent()}
      </main>
    </div>
  );
};
export default FacultyDashboard;