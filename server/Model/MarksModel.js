import mongoose from 'mongoose';

const MarksSchema = new mongoose.Schema({
    exam: {
        type: String, // Exam Name (e.g., "Internal 1")
        required: true
    },
    course: {
        type: String, // Course Name
        required: true
    },
    studentId: {
        type: String, // Reg No
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        default: 100
    },
    grade: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const MarksModel = mongoose.model('Marks', MarksSchema);
export default MarksModel;
