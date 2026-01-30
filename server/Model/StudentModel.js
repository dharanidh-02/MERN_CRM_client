import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    name: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    dept: { type: mongoose.Schema.Types.ObjectId, ref: 'departments', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'batches', required: true },
    semester: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    dob: { type: String },
    bloodGroup: { type: String },
    userId: { type: String }, // Optional link to UserCollection
    password: { type: String } // Storing hashed password if they can login
});

const StudentCollection = mongoose.model('students', studentSchema);
export default StudentCollection;
