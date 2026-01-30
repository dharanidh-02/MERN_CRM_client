import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaUsers, FaClipboardList, FaChartBar, FaEdit, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as API from '../../api/index';

// Imported Sub-components
import FacultyOverview from './FacultyOverview';
import FacultyAttendance from './FacultyAttendance';
import FacultyMaterials from './FacultyMaterials';
import FacultyReports from './FacultyReports';
import FacultyMarks from './FacultyMarks';
import FacultyProfile from './FacultyProfile';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [facultyData, setFacultyData] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);

  const [materials, setMaterials] = useState([]);

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

        // Load data independently to prevent one failure from blocking others
        let studentsRes = { data: [] };
        let coursesRes = { data: [] };
        let examsRes = { data: [] };

        try {
          studentsRes = await API.fetchStudents();
        } catch (e) { console.error("Failed to fetch students", e); }

        try {
          coursesRes = await API.fetchCourses();
        } catch (e) { console.error("Failed to fetch courses", e); }

        try {
          // This might fail if Schema changed and DB has old data
          examsRes = await API.fetchExams();
        } catch (e) { console.error("Failed to fetch exams", e); }

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
        // Helper for ID matching
        const areIdsEqual = (id1, id2) => {
          if (!id1 || !id2) return false;
          const str1 = (id1._id || id1).toString();
          const str2 = (id2._id || id2).toString();
          return str1 === str2;
        };

        // Filter students belonging to this faculty's department AND one of the valid batches
        const facultyStudents = studentsRes.data.filter(s => {
          // Robust Dept Match
          const sDept = s.dept;
          const fDept = currentFaculty.dept;
          const deptMatch = areIdsEqual(sDept, fDept);

          // Robust Batch Match
          // validBatches contains Batch Names (Strings).
          // Student batch might be Name, ID, or Object.
          // We need to match against Batch Names because that's what we extracted from Courses.

          let sBatchName = '';
          if (s.batch && s.batch.name) {
            sBatchName = s.batch.name;
          } else if (s.batch) {
            // If s.batch is an ID string, we need to find the Name from fetched batches (not available here easily?)
            // Wait, validBatches came from `coursesRes`.
            // Ideally we should match IDs.
            // Let's rebuild validBatches to store IDs if possible.
            sBatchName = s.batch; // fallback
          }

          // RE-STRATEGY: Match by ID if possible.
          // validBatchesSet should contain IDs.
          const sBatchId = s.batch?._id || s.batch;

          // Let's re-collect valid batch IDs
          const validBatchIds = new Set();
          facultyCourses.forEach(facCourse => {
            const cId = facCourse._id || facCourse;
            const fullCourse = coursesRes.data.find(c => c._id === cId || c.name === facCourse.name); // Handle name match too
            if (fullCourse && fullCourse.batches) {
              fullCourse.batches.forEach(b => validBatchIds.add(b._id || b));
            }
          });

          // Check if student batch ID is in the set
          const batchMatch = Array.from(validBatchIds).some(bId => areIdsEqual(bId, sBatchId));

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
      case 'overview':
        return <FacultyOverview facultyData={facultyData} students={students} />;
      case 'attendance':
        return <FacultyAttendance courses={courses} facultyData={facultyData} students={students} />;
      case 'materials':
        return <FacultyMaterials facultyData={facultyData} materials={materials} setMaterials={setMaterials} />;
      case 'reports':
        return <FacultyReports courses={courses} facultyData={facultyData} students={students} />;
      case 'marks':
        return <FacultyMarks exams={exams} courses={courses} facultyData={facultyData} students={students} />;
      case 'profile':
        return <FacultyProfile facultyData={facultyData} />;
      default:
        return <FacultyOverview facultyData={facultyData} students={students} />;
    }
  };

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