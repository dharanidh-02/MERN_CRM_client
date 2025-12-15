import mongoose from "mongoose";
import dotenv from "dotenv";
import FacultyCollection from "../Model/FacultyModel.js";
import StudentCollection from "../Model/StudentModel.js";

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        console.log("\n--- FACULTY ---");
        const faculty = await FacultyCollection.find();
        faculty.forEach(f => {
            const isHash = f.password && f.password.startsWith('$2b$');
            console.log(`Name: ${f.name}, ID: ${f.id}, Password: ${f.password ? (isHash ? 'HASHED ($2b$...)' : 'PLAIN TEXT (' + f.password + ')') : 'MISSING'}`);
        });

        console.log("\n--- STUDENTS ---");
        const students = await StudentCollection.find();
        students.forEach(s => {
            const isHash = s.password && s.password.startsWith('$2b$');
            console.log(`Name: ${s.name}, RegNo: ${s.regNo}, Password: ${s.password ? (isHash ? 'HASHED ($2b$...)' : 'PLAIN TEXT (' + s.password + ')') : 'MISSING'}`);
        });

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkDB();
