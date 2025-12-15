import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    batch: { type: String, required: true },
    period: { type: String, required: true }, // Or Array of strings if multi-period
    studentId: { type: String, required: true }, // Link to Student regNo or ID
    status: { type: String, enum: ['present', 'absent'], required: true },
    // Optional: course, facultyId to track who marked it
    course: { type: String },
    facultyId: { type: String }
});

const AttendanceCollection = mongoose.model('attendance', attendanceSchema);
export default AttendanceCollection;
