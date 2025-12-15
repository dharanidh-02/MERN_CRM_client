import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    dept: { type: [String], required: true },
    credits: { type: Number, required: true },
    batches: { type: [String], required: true } // Linked batches
});

const CourseCollection = mongoose.model('courses', courseSchema);
export default CourseCollection;
