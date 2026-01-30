import mongoose from "mongoose";

const examSchema = mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    dept: { type: [String], required: true }, // Array of Strings for Multi-Dept
    batch: { type: String, required: true },
    course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true }],
    marks: { type: Number, required: true },
    publishGrades: { type: Boolean, default: false }
});

const ExamCollection = mongoose.model('exams', examSchema);
export default ExamCollection;
