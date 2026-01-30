import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import UserCollection from "./Model/UserModel.js";
import FacultyCollection from "./Model/FacultyModel.js";
import StudentCollection from "./Model/StudentModel.js";
import DepartmentCollection from "./Model/DepartmentModel.js";
import BatchCollection from "./Model/BatchModel.js";

dotenv.config();

const verifyUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB for verification");

        // 1. Ensure Department (Needed for Faculty and Student)
        let dept = await DepartmentCollection.findOne({ code: 'CSE' });
        if (!dept) {
            console.log("Creating CSE Department...");
            dept = new DepartmentCollection({
                name: 'Computer Science',
                code: 'CSE',
                head: 'Head of CSE'
            });
            await dept.save();
        }
        console.log("Department ID:", dept._id);

        // 2. Ensure Batch (Needed for Student)
        let batch = await BatchCollection.findOne({ name: '2024-2028' });
        if (!batch) {
            console.log("Creating Batch 2024-2028...");
            batch = new BatchCollection({
                name: '2024-2028',
                dept: ['CSE']
            });
            await batch.save();
        }
        console.log("Batch ID:", batch._id);

        // 3. Verify Admin
        const adminName = 'admin';
        const adminPass = 'admin';
        let admin = await UserCollection.findOne({ username: adminName });
        if (!admin) {
            console.log("Seeding Admin...");
            const hashed = await bcrypt.hash(adminPass, 10);
            admin = new UserCollection({
                username: adminName,
                password: hashed,
                role: 'Admin'
            });
            await admin.save();
            console.log("Admin created.");
        } else {
            console.log("Admin exists.");
            // Optional: Update password to ensure it matches 'admin' if you want strict test
            // const match = await bcrypt.compare(adminPass, admin.password);
            // if (!match) { ... update ... }
        }

        // 4. Verify Faculty (cb012 / 1234)
        const facultyId = 'cb012';
        const facultyPass = '1234';
        let faculty = await FacultyCollection.findOne({ id: facultyId });
        if (!faculty) {
            console.log(`Seeding Faculty ${facultyId}...`);
            const hashed = await bcrypt.hash(facultyPass, 10);
            faculty = new FacultyCollection({
                name: 'Test Faculty',
                id: facultyId,
                userId: facultyId, // Often used for login
                password: hashed,
                dept: dept._id,
                designation: 'Assistant Professor'
            });
            await faculty.save();
            console.log(`Faculty ${facultyId} created.`);
        } else {
            console.log(`Faculty ${facultyId} exists.`);
        }

        // 5. Verify Student (24cb059 / 1234)
        const studentReg = '24cb059';
        const studentPass = '1234';
        let student = await StudentCollection.findOne({ regNo: studentReg });
        if (!student) {
            console.log(`Seeding Student ${studentReg}...`);
            const hashed = await bcrypt.hash(studentPass, 10);
            student = new StudentCollection({
                name: 'Test Student',
                regNo: studentReg,
                userId: studentReg,
                password: hashed,
                dept: dept._id,
                batch: batch._id,
                semester: '1',
                email: 'student@test.com'
            });
            await student.save();
            console.log(`Student ${studentReg} created.`);
        } else {
            console.log(`Student ${studentReg} exists.`);
        }

        console.log("Verification Complete. Exiting.");
        process.exit(0);
    } catch (err) {
        console.error("Verification Error:", err);
        process.exit(1);
    }
};

verifyUsers();
