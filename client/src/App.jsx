import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import EnquiryPage from './pages/public/EnquiryPage';
import LoginPage from './pages/public/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';

// Student Routes
import StudentLayout from './components/layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance from './pages/student/MyAttendance';
import MyMarks from './pages/student/MyMarks';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/enquiry" element={<EnquiryPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        {/* Student Section */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="marks" element={<MyMarks />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
