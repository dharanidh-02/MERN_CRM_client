import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// --- Departments ---
export const fetchDepartments = () => API.get('/api/departments');
export const createDepartment = (data) => API.post('/api/departments', data);
export const updateDepartment = (id, data) => API.put(`/api/departments/${id}`, data);
export const deleteDepartment = (id) => API.delete(`/api/departments/${id}`);

// --- Courses ---
export const fetchCourses = () => API.get('/api/courses');
export const createCourse = (data) => API.post('/api/courses', data);
export const updateCourse = (id, data) => API.put(`/api/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/api/courses/${id}`);

// --- Batches ---
export const fetchBatches = () => API.get('/api/batches');
export const createBatch = (data) => API.post('/api/batches', data);
export const updateBatch = (id, data) => API.put(`/api/batches/${id}`, data);
export const deleteBatch = (id) => API.delete(`/api/batches/${id}`);

// --- Students ---
export const fetchStudents = () => API.get('/api/students');
export const createStudent = (data) => API.post('/api/students', data);
export const updateStudent = (id, data) => API.put(`/api/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/api/students/${id}`);

// --- Faculty ---
export const fetchFaculty = () => API.get('/api/faculty');
export const createFaculty = (data) => API.post('/api/faculty', data);
export const updateFaculty = (id, data) => API.put(`/api/faculty/${id}`, data);
export const deleteFaculty = (id) => API.delete(`/api/faculty/${id}`);

// --- Exams ---
export const fetchExams = () => API.get('/api/exams');
export const createExam = (data) => API.post('/api/exams', data);
export const updateExam = (id, data) => API.put(`/api/exams/${id}`, data);
export const deleteExam = (id) => API.delete(`/api/exams/${id}`);

// --- Enquiries ---
export const fetchEnquiries = () => API.get('/enquiry/read');
export const updateEnquiry = (id, data) => API.put(`/enquiry/${id}`, data);
export const deleteEnquiry = (id) => API.delete(`/enquiry/${id}`);

// --- Attendance ---
export const saveAttendance = (data) => API.post('/api/attendance', data);
export const fetchAttendance = (date, batch) => {
    let url = '/api/attendance?';
    if (date) url += `date=${date}&`;
    if (batch) url += `batch=${batch}&`;
    return API.get(url);
};

// --- Marks ---
export const saveMarks = (data) => API.post('/api/marks', data);
export const fetchMarks = (studentId, course, exam) => {
    let url = '/api/marks?';
    if (studentId) url += `studentId=${studentId}&`;
    if (course) url += `course=${course}&`;
    if (exam) url += `exam=${exam}&`;
    return API.get(url);
};
