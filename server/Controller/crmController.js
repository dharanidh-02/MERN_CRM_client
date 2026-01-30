import DepartmentCollection from "../Model/DepartmentModel.js";
import CourseCollection from "../Model/CourseModel.js";
import BatchCollection from "../Model/BatchModel.js";
import StudentCollection from "../Model/StudentModel.js";
import FacultyCollection from "../Model/FacultyModel.js";
import ExamCollection from "../Model/ExamModel.js";
import AttendanceCollection from "../Model/AttendanceModel.js";
import bcrypt from "bcryptjs";

// --- Generic Helpers ---
const getAll = (Model) => async (req, res) => {
    try {
        const data = await Model.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createOne = (Model) => async (req, res) => {
    try {
        const newData = new Model(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteOne = (Model) => async (req, res) => {
    try {
        const { id } = req.params;
        await Model.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateOne = (Model) => async (req, res) => {
    try {
        const { id } = req.params;
        // Strip _id and __v from update body to prevent immutable field error
        const { _id, __v, ...updateData } = req.body;
        const updatedData = await Model.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Specific Implementations ---

// Departments
export const getDepartments = getAll(DepartmentCollection);
export const createDepartment = createOne(DepartmentCollection);
export const updateDepartment = updateOne(DepartmentCollection);
export const deleteDepartment = deleteOne(DepartmentCollection);

// Courses
export const getCourses = async (req, res) => {
    try {
        const data = await CourseCollection.find().populate('dept batches');
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const createCourse = createOne(CourseCollection);
export const updateCourse = updateOne(CourseCollection);
export const deleteCourse = deleteOne(CourseCollection);

// Batches
export const getBatches = getAll(BatchCollection);
export const createBatch = createOne(BatchCollection);
export const updateBatch = updateOne(BatchCollection);
export const deleteBatch = deleteOne(BatchCollection);

// Students (with password hashing if needed)
export const getStudents = async (req, res) => {
    try {
        const data = await StudentCollection.find().populate('dept batch');
        // Debug Log
        if (data.length > 0) {
            console.log("DEBUG /api/students Sample:", JSON.stringify(data[0], null, 2));
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const createStudent = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        console.log("Create Student Payload:", { ...rest, password: password ? "********" : "MISSING" });
        let studentData = { ...rest };

        // Hash password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            studentData.password = hashedPassword;
        }

        const newStudent = new StudentCollection(studentData);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, __v, password, ...rest } = req.body;
        let updateData = { ...rest };

        console.log(`Updating Student ${id}. Password provided: ${!!password}`);

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
            console.log("Password hashed.");
        }

        const updatedData = await StudentCollection.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error("Update Student Error:", err);
        res.status(500).json({ message: err.message });
    }
};

export const deleteStudent = deleteOne(StudentCollection);

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await StudentCollection.findById(id).populate('dept batch');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getFaculty = async (req, res) => {
    console.error("!!! HIT getFaculty CONTROLLER !!!");
    try {
        // Fetch raw data to verify DB has items
        const rawCount = await FacultyCollection.countDocuments();
        console.error("!!! RAW FACULTY COUNT:", rawCount);

        const data = await FacultyCollection.find().populate('dept course');
        console.error("!!! POPULATED DATA COUNT:", data.length);

        if (data.length > 0) {
            console.error("DEBUG /api/faculty Sample:", JSON.stringify(data[0], null, 2));
        } else {
            console.error("DEBUG /api/faculty: No data found");
        }
        res.status(200).json(data);
    } catch (err) {
        console.error("!!! getFaculty ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

export const createFaculty = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        console.log("Create Faculty Payload:", { ...rest, password: password ? "********" : "MISSING" });
        let facultyData = { ...rest };

        // Hash password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            facultyData.password = hashedPassword;
        }

        const newFaculty = new FacultyCollection(facultyData);
        await newFaculty.save();
        res.status(201).json(newFaculty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, __v, password, ...rest } = req.body;
        let updateData = { ...rest };

        console.error(`!!! HIT updateFaculty for ID: ${id}`);
        console.error("!!! UPDATE PAYLOAD:", JSON.stringify(updateData, null, 2));

        console.log(`Updating Faculty ${id}. Password provided: ${!!password}`);

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
            console.log("Password hashed.");
        }

        const updatedData = await FacultyCollection.findByIdAndUpdate(id, updateData, { new: true });
        console.error("!!! DB UPDATE RESULT:", JSON.stringify(updatedData, null, 2));
        res.status(200).json(updatedData);
    } catch (err) {
        console.error("Update Faculty Error:", err);
        res.status(500).json({ message: err.message });
    }
};
export const deleteFaculty = deleteOne(FacultyCollection);

// Exams
export const getExams = getAll(ExamCollection);
export const createExam = createOne(ExamCollection);
export const updateExam = updateOne(ExamCollection);
export const deleteExam = deleteOne(ExamCollection);

// Attendance
export const saveAttendance = async (req, res) => {
    try {
        // Expecting an array of entries or single entry
        const entries = req.body.entries; // Expecting { entries: [ { studentId, status, date, batch... } ] }
        if (Array.isArray(entries)) {
            const saved = await AttendanceCollection.insertMany(entries);
            res.status(201).json(saved);
        } else {
            const newEntry = new AttendanceCollection(req.body);
            await newEntry.save();
            res.status(201).json(newEntry);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// Helper to get attendance for specific batch/date if needed
export const getAttendance = async (req, res) => {
    try {
        const { date, batch } = req.query;
        let query = {};
        if (date) query.date = date;
        if (batch) query.batch = batch;

        const data = await AttendanceCollection.find(query);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
import MarksModel from '../Model/MarksModel.js';

export const saveMarks = async (req, res) => {
    try {
        const { marksData } = req.body; // Expecting array of { exam, course, studentId, marks, total }

        if (!marksData || !Array.isArray(marksData)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const savedMarks = await MarksModel.insertMany(marksData);
        res.status(201).json(savedMarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMarks = async (req, res) => {
    try {
        const { studentId, course, exam } = req.query;
        let query = {};
        if (studentId) query.studentId = studentId;
        if (course) query.course = course;
        if (exam) query.exam = exam;

        const marks = await MarksModel.find(query);
        res.status(200).json(marks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
