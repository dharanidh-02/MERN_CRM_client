import express from "express";
import {
    getDepartments, createDepartment, deleteDepartment, updateDepartment,
    getCourses, createCourse, deleteCourse, updateCourse,
    getBatches, createBatch, deleteBatch, updateBatch,
    getStudents, createStudent, deleteStudent, updateStudent,
    getFaculty, createFaculty, deleteFaculty, updateFaculty,
    getExams, createExam, deleteExam, updateExam,
    saveAttendance, getAttendance,
    saveMarks, getMarks
} from "../Controller/crmController.js";

const router = express.Router();

// Departments
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Courses
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Batches
router.get('/batches', getBatches);
router.post('/batches', createBatch);
router.put('/batches/:id', updateBatch);
router.delete('/batches/:id', deleteBatch);

// Students
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Faculty
router.get('/faculty', getFaculty);
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

// Exams
router.get('/exams', getExams);
router.post('/exams', createExam);
router.put('/exams/:id', updateExam);
router.delete('/exams/:id', deleteExam);

// Attendance
router.post('/attendance', saveAttendance);
router.get('/attendance', getAttendance);

// Marks
router.post('/marks', saveMarks);
router.get('/marks', getMarks);

export default router;
