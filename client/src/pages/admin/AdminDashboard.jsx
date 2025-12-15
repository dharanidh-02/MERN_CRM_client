import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBell, FaSearch, FaSignOutAlt, FaPlus, FaArrowLeft, FaCheck, FaExclamationTriangle, FaTimes, FaInfoCircle, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/admin/DataTable';
import GenericModal from '../../components/admin/GenericModal';
import * as API from '../../api';
import { motion, AnimatePresence } from 'framer-motion';

// --- UI Components ---
const NotificationToast = ({ message, type = 'info', onClose }) => {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };
  const icons = {
    success: <FaCheck className="text-white" />,
    error: <FaTimes className="text-white" />,
    info: <FaInfoCircle className="text-white" />,
    warning: <FaExclamationTriangle className="text-white" />
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center gap-3 ${bgColors[type]}`}
    >
      {icons[type]}
      <span className="text-white font-medium">{message}</span>
    </motion.div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            <FaExclamationTriangle className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-transform hover:scale-105 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'}`}
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Form Components (Defined OUTSIDE to prevent re-renders) ---
const Input = ({ label, name, type = "text", placeholder, value, onChange, autoComplete }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      required={true}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      autoComplete={autoComplete}
    />
  </div>
);

const PasswordInput = ({ label, name, placeholder, value, onChange, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

const Select = ({ label, name, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      required={true}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
    >
      <option value="">Select {label}</option>
      {options.map(opt => {
        const val = opt._id || opt.id || opt; // Prioritize _id
        const disp = opt.name || opt;
        return <option key={val} value={val}>{disp}</option>;
      })}
    </select>
  </div>
);

const MultiSelect = ({ label, options, selected = [], onChange }) => {
  const toggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="mb-4 group">
      <label className="block text-blue-900 text-sm font-semibold mb-2 ml-1">{label}</label>
      <div className="p-3 bg-gray-50 border-b border-gray-200 rounded-lg max-h-32 overflow-y-auto">
        {options.map(opt => (
          <div key={opt} className="flex items-center mb-2 last:mb-0">
            <input
              type="checkbox"
              id={`opt-${opt}`}
              checked={selected.includes(opt)}
              onChange={() => toggleOption(opt)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor={`opt-${opt}`} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
              {opt}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --- UI States ---
  const [notification, setNotification] = useState(null); // { message, type }
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // --- Data States ---
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [exams, setExams] = useState([]);

  // Load Data on Mount
  React.useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [d, c, b, s, f, e] = await Promise.all([
        API.fetchDepartments(),
        API.fetchCourses(),
        API.fetchBatches(),
        API.fetchStudents(),
        API.fetchFaculty(),
        API.fetchExams()
      ]);
      setDepartments(d.data);
      setCourses(c.data);
      setBatches(b.data);
      setStudents(s.data);
      setFaculty(f.data);
      setExams(e.data);
    } catch (err) {
      console.error("Failed to load CRM data", err);
    }
  };

  // --- Attendance States ---
  const [attendanceStep, setAttendanceStep] = useState('list'); // 'list' | 'mark'
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  // Separate state for whether we have "Searched" and are ready to show the table
  const [isAttendanceTableVisible, setIsAttendanceTableVisible] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({ dept: '', course: '', batch: '', date: '', period: [] });
  const [attendanceEntries, setAttendanceEntries] = useState({}); // { regNo: 'present' | 'absent' }

  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState(null);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const handleLogout = () => {
    navigate('/login');
  };

  // --- Generic Handlers ---
  const handleOpenModal = (type, data = {}) => {
    setCurrentModalType(type);
    setFormData(data);
    setEditIndex(null); // Default to Add mode
    setIsModalOpen(true);
  };

  const handleEdit = (type, item) => {
    setCurrentModalType(type);

    // Normalize data for editing
    let normalizedItem = { ...item };
    if ((type === 'course' || type === 'batch') && normalizedItem.dept && !Array.isArray(normalizedItem.dept)) {
      // Handle legacy string data by converting to array
      normalizedItem.dept = [normalizedItem.dept];
    }

    // Normalize populated relationships to IDs for the form
    if (normalizedItem.dept && typeof normalizedItem.dept === 'object' && normalizedItem.dept._id) {
      normalizedItem.dept = normalizedItem.dept._id;
    }
    if (normalizedItem.course) {
      if (type === 'faculty') {
        // Ensure it's an array for Faculty
        if (!Array.isArray(normalizedItem.course)) {
          normalizedItem.course = [normalizedItem.course];
        }
        // Map objects to IDs
        normalizedItem.course = normalizedItem.course.map(c => (c && c._id) ? c._id : c);
      } else {
        // For Exam (and others), keep as single value
        // If it's an object (populated), extract ID or Name depending on what Model expects.
        // ExamModel expects 'String' (Course Name) usually? Or ID?
        // Looking at ExamModel: course: { type: String, required: true }
        // Looking at AdminDashboard inputs for Exam: It uses a Select with options=courses.
        // The Select component uses `value._id` or `value`.
        // If ExamModel stores Name, we should ensure we extract Name.
        // Let's assume Exam stores Name as per `ExamModel.js`.

        if (typeof normalizedItem.course === 'object' && normalizedItem.course !== null) {
          // If populated, use Name if Model expects String, or ID if Ref.
          // ExamModel says Type: String. So likely Name.
          // But let's check what the Select options provide. 
          // The Select options use _id as value usually.
          // Wait, previous data might use Name.
          // Let's stick to what it was before: just extract _id if it's an object, assuming ref-like behavior or just use it.
          // Actually, if ExamModel is String, and we pass ID, it saves ID string.
          // If we pass Name, it saves Name string.
          // Let's assume we want to flatten it if it's an object.
          normalizedItem.course = normalizedItem.course._id || normalizedItem.course.name || normalizedItem.course;
        }
      }
    }
    if (normalizedItem.batch && typeof normalizedItem.batch === 'object' && normalizedItem.batch._id) {
      normalizedItem.batch = normalizedItem.batch._id;
    }

    // Clear password field to avoid showing hashed password and prevent re-hashing existing one
    if (type === 'student' || type === 'faculty') {
      normalizedItem.password = '';
    }

    setFormData(normalizedItem);
    setIsModalOpen(true);

    // Determine index based on type for updating state
    let index = -1;
    switch (type) {
      case 'department': index = departments.indexOf(item); break;
      case 'course': index = courses.indexOf(item); break;
      case 'batch': index = batches.indexOf(item); break;
      case 'student': index = students.indexOf(item); break;
      case 'faculty': index = faculty.indexOf(item); break;
      case 'exam': index = exams.indexOf(item); break;
      default: break;
    }
    setEditIndex(index);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditIndex(null);
  };

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...formData };

    // For specific transformations (like converting checkbox to bool) already happened in state or implicit

    try {
      // Validate Faculty Course
      if (currentModalType === 'faculty' && (!data.course || (Array.isArray(data.course) && data.course.length === 0))) {
        // Should allow empty course? Maybe warn.
        // But let's proceed. 
      }

      console.log('Saving Data:', currentModalType, data);

      if (formData._id) {
        // Edit Mode
        const id = formData._id;

        switch (currentModalType) {
          case 'department': await API.updateDepartment(id, data); break;
          case 'course': await API.updateCourse(id, data); break;
          case 'batch': await API.updateBatch(id, data); break;
          case 'student': await API.updateStudent(id, data); break;
          case 'faculty': await API.updateFaculty(id, data); break;
          case 'exam': await API.updateExam(id, data); break;
          default: break;
        }
      } else {
        // Create Mode
        switch (currentModalType) {
          case 'department': await API.createDepartment(data); break;
          case 'course': await API.createCourse(data); break;
          case 'batch': await API.createBatch(data); break;
          case 'student': await API.createStudent(data); break;
          case 'faculty': await API.createFaculty(data); break;
          case 'exam': await API.createExam(data); break;
          default: break;
        }
      }

      // Refresh Data
      loadAllData();
      handleCloseModal();
      setNotification({ message: 'Saved successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: "Failed to save: " + (err.response?.data?.message || err.message), type: 'error' });
    }
  };

  const showToast = (msg, type = 'info') => setNotification({ message: msg, type });

  const handleDelete = async (type, index, id) => {
    // Note: DataTables usually pass index. I need the ID from the item at that index.
    // The columns config passed to DataTable needs to expose the original object or ID.
    // Assuming DataTable passes the entire item or I can access it.
    // Wait, the DataTable `onDelete` passes `idx`. I have to lookup the item.

    let itemToDelete = null;
    let apiCall = null;

    // Helper to find ID.
    // This depends on which array we are looking at.
    // This is tricky because `type` argument tells us which array.
    switch (type) {
      case 'department': itemToDelete = departments[index]; apiCall = API.deleteDepartment; break;
      case 'course': itemToDelete = courses[index]; apiCall = API.deleteCourse; break;
      case 'batch': itemToDelete = batches[index]; apiCall = API.deleteBatch; break;
      case 'student': itemToDelete = students[index]; apiCall = API.deleteStudent; break;
      case 'faculty': itemToDelete = faculty[index]; apiCall = API.deleteFaculty; break;
      case 'exam': itemToDelete = exams[index]; apiCall = API.deleteExam; break;
    }

    if (!itemToDelete || !itemToDelete._id) {
      console.error("Item ID not found", itemToDelete);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await apiCall(itemToDelete._id);
          loadAllData();
          showToast('Deleted successfully', 'success');
        } catch (err) {
          showToast("Failed to delete.", 'error');
          console.error(err);
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  // --- Attendance Handlers ---
  const handleSelectFacultyForAttendance = (fac) => {
    setSelectedFaculty(fac);
    setAttendanceStep('mark');
    setIsAttendanceTableVisible(false); // Reset table
    // Pre-fill form with Faculty's Dept/Course if possible
    let facCourseName = '';
    if (Array.isArray(fac.course)) {
      if (fac.course.length > 0) {
        facCourseName = fac.course[0].name || fac.course[0];
      }
    } else {
      facCourseName = fac.course?.name || fac.course || '';
    }

    setAttendanceForm({
      dept: fac.dept?.name || fac.dept || '',
      course: facCourseName,
      batch: '', // Reset batch? Or try to guess? Better to leave for Course selection to drive.
      date: new Date().toISOString().split('T')[0], // Default to today
      period: []
    });
    setAttendanceEntries({});
  };

  const handleAttendanceChange = (regNo, status) => {
    setAttendanceEntries(prev => ({ ...prev, [regNo]: status }));
  };

  const saveAttendance = async () => {
    try {
      const entries = Object.entries(attendanceEntries).map(([regNo, status]) => {
        // We find the student to know their specific batch
        const student = students.find(s => s.regNo === regNo);
        return {
          date: attendanceForm.date,
          batch: student ? student.batch : 'Unknown', // Use student's actual batch
          period: attendanceForm.period.join(','),
          studentId: regNo,
          status: status,
          course: attendanceForm.course,
          facultyId: selectedFaculty ? selectedFaculty.id : 'ADMIN', // Track who marked it (or Admin on behalf of Fac)
        };
      });

      if (entries.length === 0) return;

      await API.saveAttendance({ entries });
      showToast(`Attendance Saved!`, 'success');
      setAttendanceEntries({});
      setIsAttendanceTableVisible(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to save attendance", 'error');
    }
  };

  const markAll = (status) => {
    if (!attendanceForm.dept || !attendanceForm.course) return;

    // Logic must match the render filter
    const selectedCourseObj = courses.find(c => c.name === attendanceForm.course);
    const targetBatches = selectedCourseObj ? (selectedCourseObj.batches || []) : [];

    // Filter students belonging to ANY of the target batches
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

  const handleSearchStudents = () => {
    if (attendanceForm.date && attendanceForm.period.length > 0 && attendanceForm.dept && attendanceForm.course) {
      setIsAttendanceTableVisible(true);
    } else {
      showToast("Please select Dept, Course, Date, and Period", "warning");
      return;
    }
  };


  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'department', label: 'Department' },
    { id: 'course', label: 'Course' },
    { id: 'batch', label: 'Batch' },
    { id: 'student', label: 'Student' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'exam', label: 'Exams' }, // Added Exams
    { id: 'enquiries', label: 'Enquiries' },
  ];

  const renderTableSection = (title, type, columns, data) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={() => handleOpenModal(type)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-colors text-sm"
        >
          <FaPlus /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        onDelete={(idx) => handleDelete(type, idx)}
        onEdit={(item) => handleEdit(type, item)}
      />
    </div>
  );

  const renderAttendanceSection = () => {
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
    } else {
      // Mark Attendance View (After selecting a Faculty)

      // Cascading Filter Logic (Same as before, but pre-filled/constrained by Faculty if needed)
      // We allow Admin to override Dept/Course if they want, but it starts with Faculty's defaults.

      const availableCourses = attendanceForm.dept
        ? courses.filter(c => {
          // If a faculty is explicitly selected, only show their assigned course
          if (selectedFaculty && selectedFaculty.course) {
            if (Array.isArray(selectedFaculty.course)) {
              // Check if this course (c) is in the faculty's assigned courses
              return selectedFaculty.course.some(fc => (fc.name === c.name) || (fc === c.name) || (fc._id === c._id));
            } else {
              // Fallback for single object/string
              const facCourseName = selectedFaculty.course.name || selectedFaculty.course;
              return c.name === facCourseName;
            }
          }
          // Otherwise show all courses in the dept
          return Array.isArray(c.dept) ? c.dept.includes(attendanceForm.dept) : c.dept === attendanceForm.dept;
        })
        : [];

      // Find selected course object to get its batches
      const selectedCourseObj = courses.find(c => c.name === attendanceForm.course);
      const targetBatches = selectedCourseObj ? (selectedCourseObj.batches || []) : [];

      // Filter students belonging to ANY of the target batches
      const filteredStudents = (attendanceForm.course && isAttendanceTableVisible)
        ? students.filter(s => {
          const sBatchName = s.batch?.name || s.batch;
          const sDeptName = s.dept?.name || s.dept;
          return targetBatches.includes(sBatchName) && sDeptName === attendanceForm.dept;
        })
        : [];

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setAttendanceStep('list')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <FaArrowLeft />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Mark Attendance
              </h2>
              <p className="text-sm text-gray-500">
                Marking for: <span className="font-semibold text-blue-600">{selectedFaculty?.name}</span>
              </p>
            </div>
          </div>

          {/* Attendance Controls */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Department Selector */}
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

              {/* Course Selector */}
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
                  <p className="text-xs text-blue-600 mt-1">Includes Batches: {targetBatches.join(', ')}</p>
                )}
              </div>

              {/* Date Selector */}
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

            {/* Period Selector (1-7 Checkboxes style) */}
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

            {/* Go Button */}
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


          {/* Student List (Only visible after search) */}
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
    }
  };

  const OverviewSection = () => (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome Admin, here's the current status.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Students', value: students.length, change: 'Live', border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Faculty', value: faculty.length, change: 'Live', border: 'border-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Courses', value: courses.length, change: 'Live', border: 'border-teal-500', text: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Batches', value: batches.length, change: 'Live', border: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-2xl bg-white border-2 ${stat.border} shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300`}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${stat.bg} ${stat.text}`}>{stat.change}</span>
            </div>
            <h3 className={`text-3xl font-bold ${stat.text}`}>{stat.value}</h3>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3></div>
        <div className="p-6 text-center text-gray-400 py-12">No recent activity.</div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'attendance': return renderAttendanceSection();
      case 'department':
        return renderTableSection('Departments', 'department',
          [{ header: 'Name', accessor: 'name' }, { header: 'Code', accessor: 'code' }, { header: 'HOD', accessor: 'head' }],
          departments
        );
      case 'course':
        return renderTableSection('Courses', 'course',
          [
            { header: 'Code', accessor: 'code' },
            { header: 'Course Name', accessor: 'name', className: 'whitespace-normal min-w-[300px]' },
            { header: 'Dept', accessor: (row) => Array.isArray(row.dept) ? row.dept.join(', ') : row.dept, className: 'whitespace-normal' },
            { header: 'Batches', accessor: (row) => Array.isArray(row.batches) ? row.batches.join(', ') : '-' },
            { header: 'Credits', accessor: 'credits' }
          ],
          courses
        );
      case 'batch':
        return renderTableSection('Batches', 'batch',
          [{ header: 'Batch Name', accessor: 'name' }, { header: 'Dept', accessor: (row) => Array.isArray(row.dept) ? row.dept.join(', ') : row.dept }],
          batches
        );
      case 'student':
        return renderTableSection('Students', 'student',
          [
            { header: 'Name', accessor: 'name' },
            { header: 'Reg No', accessor: 'regNo' },
            { header: 'Dept', accessor: (row) => row.dept?.name || row.dept },
            { header: 'Batch', accessor: (row) => row.batch?.name || row.batch }
          ],
          students
        );
      case 'faculty':
        return renderTableSection('Faculty', 'faculty',
          [
            { header: 'Name', accessor: 'name' },
            { header: 'Handling Course', accessor: (row) => Array.isArray(row.course) ? row.course.map(c => c.name || c).join(', ') : (row.course?.name || row.course), className: 'whitespace-normal min-w-[200px]' },
            { header: 'Dept', accessor: (row) => row.dept?.name || row.dept },
            { header: 'Designation', accessor: 'designation' }
          ],
          faculty
        );
      case 'exam':
        return renderTableSection('Exams', 'exam',
          [
            { header: 'Exam Name', accessor: 'name' },
            { header: 'Date', accessor: 'date' },
            { header: 'Dept', accessor: (row) => Array.isArray(row.dept) ? row.dept.join(', ') : (row.dept?.name || row.dept) },
            { header: 'Batch', accessor: (row) => row.batch?.name || row.batch },
            { header: 'Course', accessor: (row) => row.course?.name || row.course },
            { header: 'Marks', accessor: 'marks' }
          ],
          exams
        );
      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Publish Grades</h3>
                  <p className="text-gray-500 text-sm">Allow students to view their exam grades in the dashboard.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localStorage.getItem('showGrades') === 'true'}
                    onChange={(e) => {
                      localStorage.setItem('showGrades', e.target.checked);
                      // Force re-render to reflect change immediately (in a real app, use Context)
                      window.location.reload();
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'enquiries':
        return <EnquiriesSection
          showToast={showToast}
          confirmAction={(opts) => setConfirmModal({ ...opts, isOpen: true })}
        />;
      default: return <OverviewSection />;
    }
  };

  const EnquiriesSection = ({ showToast, confirmAction }) => {
    const [enquiries, setEnquiries] = useState([]);

    // Load from API on mount
    React.useEffect(() => {
      loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
      try {
        const res = await API.fetchEnquiries();
        setEnquiries(res.data);
      } catch (err) {
        console.error(err);
        if (showToast) showToast('Failed to load enquiries', 'error');
      }
    }

    const updateStatus = async (id, newStatus) => {
      try {
        await API.updateEnquiry(id, { status: newStatus });
        loadEnquiries();
        if (showToast) showToast('Status updated', 'success');
      } catch (err) {
        console.error(err);
        if (showToast) showToast('Failed to update status', 'error');
      }
    };

    const deleteEnquiry = async (id) => {
      if (confirmAction) {
        confirmAction({
          title: 'Delete Enquiry',
          message: 'Are you sure you want to delete this enquiry?',
          onConfirm: async () => {
            try {
              await API.deleteEnquiry(id);
              loadEnquiries();
              if (showToast) showToast('Enquiry deleted successfully', 'success');
            } catch (err) {
              console.error(err);
              if (showToast) showToast('Failed to delete enquiry', 'error');
            }
          }
        });
      }
    };

    return (
      <div className="space-y-6 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900">Admissions Enquiries</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No new enquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-semibold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Message</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(enq.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {enq.name}
                        <div className="text-xs text-gray-500 font-normal">{enq.email}</div>
                      </td>
                      <td className="px-6 py-4">{enq.department}</td>
                      <td className="px-6 py-4 relative group cursor-help">
                        <span className="truncate max-w-xs block">{enq.message || '-'}</span>
                        {/* Tooltip for full message */}
                        {enq.message && (
                          <div className="absolute hidden group-hover:block z-10 bg-black text-white p-2 rounded text-xs w-64 -top-8 left-0 shadow-lg">
                            {enq.message}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${enq.status === 'New' ? 'bg-blue-100 text-blue-700' :
                          enq.status === 'Contacted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {enq.status === 'New' && (
                          <button onClick={() => updateStatus(enq._id, 'Contacted')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 border border-green-200">
                            Mark Contacted
                          </button>
                        )}
                        <button onClick={() => deleteEnquiry(enq._id)} className="text-red-400 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">

      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer">
                A
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Admin<span className="text-blue-600">Portal</span>
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-2 items-center text-gray-600 font-medium text-sm overflow-x-auto no-scrollbar">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'hover:bg-gray-50 hover:text-blue-600'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <div className="h-8 w-px bg-gray-200 mx-2"></div>

              {/* User Profile + Sign Out */}
              <div className="flex items-center gap-3 relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                    <FaUserCircle size={22} />
                  </div>
                </div>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 origin-top-right z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@college.edu</p>
                    </div>
                    <button
                      onClick={() => handleOpenModal('profile')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      My Profile
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="flex items-center gap-2 bg-red-50 text-red-600 p-2 rounded-lg font-semibold hover:bg-red-100 transition-colors text-sm"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Shared Modal */}
      <GenericModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentModalType === 'profile' ? 'My Profile' : `${editIndex !== null ? 'Edit' : 'Add New'} ${currentModalType ? currentModalType.charAt(0).toUpperCase() + currentModalType.slice(1) : 'Item'}`}
      >
        {currentModalType === 'profile' ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <FaUserCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Admin User</h3>
              <p className="text-gray-500">Super Administrator</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">admin@college.edu</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-900">+1 234 567 890</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Department</p>
                <p className="font-medium text-gray-900">Administration</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1">Joined</p>
                <p className="font-medium text-gray-900">Jan 2024</p>
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <button onClick={handleCloseModal} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Grid Layout for Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Dynamic Form Fields based on Type */}
              {currentModalType === 'department' && (
                <>
                  <Input label="Department Name" name="name" placeholder="e.g. Computer Science" value={formData.name} onChange={handleFormChange} />
                  <Input label="Department Code" name="code" placeholder="e.g. CSE" value={formData.code} onChange={handleFormChange} />
                  <div className="md:col-span-2">
                    <Input label="Head of Dept" name="head" placeholder="e.g. Dr. Smith" value={formData.head} onChange={handleFormChange} />
                  </div>
                </>
              )}

              {currentModalType === 'course' && (
                <>
                  <Input label="Course Name" name="name" placeholder="e.g. Data Structures" value={formData.name} onChange={handleFormChange} />
                  <Input label="Course Code" name="code" placeholder="e.g. CS101" value={formData.code} onChange={handleFormChange} />
                  <MultiSelect
                    label="Departments"
                    options={departments.map(d => d.name)}
                    selected={formData.dept || []}
                    onChange={(newVal) => handleFormChange('dept', newVal)}
                  />
                  <MultiSelect
                    label="Batches"
                    options={batches.map(b => b.name)}
                    selected={formData.batches || []}
                    onChange={(newVal) => handleFormChange('batches', newVal)}
                  />
                  <Input label="Credits" name="credits" type="number" placeholder="4" value={formData.credits} onChange={handleFormChange} />
                </>
              )}

              {currentModalType === 'batch' && (
                <>
                  <Input label="Batch Name" name="name" placeholder="e.g. 2023-2027" value={formData.name} onChange={handleFormChange} />
                  <MultiSelect
                    label="Departments"
                    options={departments.map(d => d.name)}
                    selected={formData.dept || []}
                    onChange={(newVal) => handleFormChange('dept', newVal)}
                  />
                </>
              )}

              {currentModalType === 'student' && (
                <>
                  <Input label="Student Name" name="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleFormChange} />
                  <Input label="Register Number" name="regNo" placeholder="7207..." value={formData.regNo} onChange={handleFormChange} />
                  <Select label="Department" name="dept" options={departments} value={formData.dept} onChange={handleFormChange} />
                  <Select label="Batch" name="batch" options={batches} value={formData.batch} onChange={handleFormChange} />
                  <Input label="User ID" name="userId" placeholder="Set User ID" value={formData.userId} onChange={handleFormChange} autoComplete="username" />
                  <PasswordInput label="Password" name="password" placeholder={editIndex !== null ? "Leave blank to keep current" : "Set Password"} value={formData.password} onChange={handleFormChange} autoComplete="new-password" />
                </>
              )}

              {/* Updated Faculty Form: Select Course instead of Dept */}
              {currentModalType === 'faculty' && (
                <>
                  <Input label="Faculty Name" name="name" placeholder="e.g. Prof. Williams" value={formData.name} onChange={handleFormChange} />
                  <Input label="Employee ID" name="id" placeholder="FAC..." value={formData.id} onChange={handleFormChange} />
                  {/* Replaced Dept Select with Course Select */}
                  <MultiSelect
                    label="Handling Courses"
                    options={courses.map(c => c.name)}
                    selected={courses.filter(c => (formData.course || []).includes(c._id)).map(c => c.name)}
                    onChange={(selectedNames) => {
                      const selectedIds = courses.filter(c => selectedNames.includes(c.name)).map(c => c._id);
                      handleFormChange('course', selectedIds);
                    }}
                  />
                  <Select
                    label="Department"
                    name="dept"
                    options={departments}
                    value={formData.dept}
                    onChange={handleFormChange}
                  />
                  <Input label="Designation" name="designation" placeholder="e.g. Assistant Professor" value={formData.designation} onChange={handleFormChange} />
                  <Input label="User ID" name="userId" placeholder="Set User ID" value={formData.userId} onChange={handleFormChange} autoComplete="username" />
                  <PasswordInput label="Password" name="password" placeholder={editIndex !== null ? "Leave blank to keep current" : "Set Password"} value={formData.password} onChange={handleFormChange} autoComplete="new-password" />
                </>
              )}

              {currentModalType === 'exam' && (
                <>
                  <Input label="Exam Name" name="name" placeholder="e.g. Internal Assessment 1" value={formData.name} onChange={handleFormChange} />
                  <Input label="Date" name="date" type="date" placeholder="" value={formData.date} onChange={handleFormChange} />
                  {/* Added Dept and Batch selectors */}
                  <MultiSelect
                    label="Department"
                    options={departments.map(d => d.name)}
                    selected={formData.dept || []}
                    onChange={(newVal) => handleFormChange('dept', newVal)}
                  />
                  <Select
                    label="Batch"
                    name="batch"
                    options={batches.map(b => b.name)}
                    value={formData.batch}
                    onChange={handleFormChange}
                  />
                  <Select
                    label="Course"
                    name="course"
                    options={courses.map(c => c.name)}
                    value={formData.course}
                    onChange={handleFormChange}
                  />

                  <Input label="Total Marks" name="marks" type="number" placeholder="100" value={formData.marks} onChange={handleFormChange} />

                  <div className="md:col-span-2 flex items-center gap-3 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="publishGrades"
                      name="publishGrades"
                      checked={formData.publishGrades || false}
                      onChange={(e) => handleFormChange('publishGrades', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="publishGrades" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                      Publish Grades for this Exam
                    </label>
                  </div>
                </>
              )}

            </div>

            <div className="pt-6 flex justify-end gap-3 mt-2 border-t border-gray-100">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm">
                Save
              </button>
            </div>
          </form>
        )}
      </GenericModal>

    </div >
  );
};



export default AdminDashboard;
