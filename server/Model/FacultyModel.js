import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true }, // Employee ID
    course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
    dept: { type: mongoose.Schema.Types.ObjectId, ref: 'departments', required: true },
    designation: { type: String },
    userId: { type: String },
    password: { type: String }
});

const FacultyCollection = mongoose.model('job_faculty', facultySchema); // 'job_faculty' to avoid naming collisions if any, or just 'faculty'
export default FacultyCollection;
