import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    head: { type: String }
});

const DepartmentCollection = mongoose.model('departments', departmentSchema);
export default DepartmentCollection;
